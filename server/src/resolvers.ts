import { IResolvers } from 'graphql-tools';
import * as bcrypt from 'bcrypt';

import { User } from './entity/User';
import { stripe } from './stripe';

export const resolvers: IResolvers = {
  Query: {
    me: async (parent, args, { req }) => {
      if (!req.session.userId) return null;
      return User.findOne(req.session.userId);
    },
  },
  Mutation: {
    register: async (parent, { email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({ email, password: hashedPassword }).save();
      return true;
    },
    login: async (parent, { email, password }, { req }) => {
      const user = await User.findOne({ email });
      if (!user) {
        return null;
      }
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return null;
      }

      req.session.userId = user.id;

      return user;
    },
    createSubscription: async (parent, { source, ccLast4 }, { req }) => {
      if (!req.session || !req.session.userId) {
        throw new Error('Not authenticated!');
      }
      const user = await User.findOne(req.session.userId);
      if (!user) {
        throw new Error('We have no idea what happened to you, you might have been deleted.');
      }

      let stripeId = user.stripeId;
      if (!user.stripeId) {
        const customer = await stripe.customers.create({
          email: user.email,
          source,
          plan: process.env.STRIPE_PLAN!,
        });
        stripeId = customer.id;
      } else {
        // update customer
        await stripe.customers.update(stripeId, { source });
        await stripe.subscriptions.create({
          customer: stripeId,
          items: [
            {
              plan: process.env.STRIPE_PLAN!,
            },
          ],
        });
      }

      user.ccLast4 = ccLast4;
      user.stripeId = stripeId;
      user.type = 'Standard';
      await user.save();

      return user;
    },
    changeCreditCard: async (parent, { source, ccLast4 }, { req }) => {
      if (!req.session || !req.session.userId) {
        throw new Error('Not authenticated!');
      }
      const user = await User.findOne(req.session.userId);
      if (!user) {
        throw new Error('We have no idea what happened to you, you might have been deleted.');
      }

      if (!user.stripeId) {
        throw new Error("You haven't subscribed yet, so there's no credit card registered.");
      }

      await stripe.customers.update(user.stripeId, { source });
      user.ccLast4 = ccLast4;
      await user.save();
      return user;
    },
    cancelSubscription: async (parent, _, { req }) => {
      if (!req.session || !req.session.userId) {
        throw new Error('Not authenticated!');
      }
      const user = await User.findOne(req.session.userId);
      if (!user) {
        throw new Error('We have no idea what happened to you, you might have been deleted.');
      }

      if (!user.stripeId) {
        throw new Error("You haven't subscribed yet, so there's no credit card registered.");
      }

      const stripeCustomer = await stripe.customers.retrieve(user.stripeId);
      const [subscription] = stripeCustomer.subscriptions.data;
      await stripe.subscriptions.del(subscription.id);

      if (stripeCustomer.default_source) {
        await stripe.customers.deleteCard(user.stripeId, stripeCustomer.default_source as string);
      }

      user.type = 'free-trial';
      user.stripeId = '';
      await user.save();
      return user;
    },
  },
};
