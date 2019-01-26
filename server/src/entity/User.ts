import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  stripeId: string;

  @Column({ default: "free-trial" })
  type: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  age: number;
}
