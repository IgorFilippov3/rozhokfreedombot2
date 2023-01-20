import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "../models/user-role.enum";

@Entity({
  name: 'users'
})
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userId: string;

  @Column()
  username: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  role: UserRole;
}