import { IResolvers } from "graphql-tools";
import * as bcrypt from "bcrypt";

import { User } from "./entity/User";

export const resolvers: IResolvers = {
  Query: {
    me: async (parent, args, { req }) => {
      if (!req.session.userId) return null;
      return User.findOne(req.session.userId);
    }
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
    }
  }
};
