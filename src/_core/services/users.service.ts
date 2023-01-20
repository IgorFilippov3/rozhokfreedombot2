import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "../dto/create-user.dto";
import { UserEntity } from "../entities/user.entity";
import { UserRole } from "../models/user-role.enum";

@Injectable()
export class UsersService {

  private logger: Logger = new Logger(this.constructor.name);

  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) { }

  async removeUser(userId: number): Promise<void> {
    const user = await this.findUserByUserId(userId);

    if (user !== null) {
      try {
        await user.remove();
        this.logger.log(`User with ID: ${user.userId} was removed`);
      } catch (e) {
        this.logger.error(e);
      }
    }
  }

  async findUserByUserId(userId: number): Promise<UserEntity | null> {
    const user: UserEntity | null = await this.usersRepository.findOne({
      where: { userId: userId.toString() }
    });
    return user;
  }

  async createUser({ userId, firstName, lastName, username }: CreateUserDto): Promise<UserEntity> {
    const user = new UserEntity();
    user.userId = userId.toString();
    user.firstName = firstName ?? '';
    user.lastName = lastName ?? '';
    user.username = username ?? '';
    user.role = UserRole.defineRole(username);

    try {
      await user.save();
      this.logger.log(`User with ID: ${user.userId} was created`);
      return user;
    } catch (e) {
      this.logger.error(e);
    }
  }
}