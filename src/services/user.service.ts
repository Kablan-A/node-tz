import HttpStatusCodes from 'http-status-codes';

import { AppDataSource } from '../data-source';
import { AuthRegisterRequestDto } from '../dto/auth.dto';
import { User } from '../entity/User.entity';
import { RoleType } from '../enums/RoleType.enum';
import { AppError } from '../errors/AppError.error';
import { hashPassword } from '../utils/hash-password.util';

export class UserService {
  static async getUserById(userId: string): Promise<User> {
    try {
      const userRepository = AppDataSource.getRepository('User');

      const user = await userRepository.findOne({
        where: { id: userId },
        relations: ['role'],
      });

      if (!user) {
        throw new AppError('User not found', HttpStatusCodes.NOT_FOUND);
      }

      return user as User;
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      }

      console.error('Error fetching user by ID:', err);
      throw new AppError('Failed to fetch user', HttpStatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  static async getUserByEmail(email: string): Promise<User> {
    try {
      const userRepository = AppDataSource.getRepository('User');

      const user = await userRepository.findOne({
        where: { email },
        relations: ['role'],
      });

      if (!user) {
        throw new AppError('User not found', HttpStatusCodes.NOT_FOUND);
      }

      return user as User;
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      }

      console.error('Error fetching user by email:', err);
      throw new AppError('Failed to fetch user', HttpStatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  static async getAllUsers(): Promise<User[]> {
    try {
      const userRepository = AppDataSource.getRepository('User');

      const users = await userRepository.find({
        relations: ['role'],
      });

      return users as User[];
    } catch (err) {
      console.error('Error fetching all users:', err);
      throw new AppError('Failed to fetch users', HttpStatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  static async createUser({
    fullName,
    email,
    dateOfBirth,
    password,
  }: AuthRegisterRequestDto): Promise<User> {
    try {
      const userRepository = AppDataSource.getRepository('User');

      const userExists = await userRepository.exists({
        where: { email },
      });
      if (userExists) {
        throw new AppError('User already exists', HttpStatusCodes.CONFLICT);
      }

      const roleRepository = AppDataSource.getRepository('Role');
      const userRole = await roleRepository.findOneBy({ name: RoleType.USER });
      if (!userRole) {
        throw new AppError('User role not found', HttpStatusCodes.INTERNAL_SERVER_ERROR);
      }

      const hashedPassword = await hashPassword(password);
      const newUser = userRepository.create({
        fullName,
        email,
        dateOfBirth: new Date(dateOfBirth),
        password: hashedPassword,
        role: userRole,
      });

      const savedUser = await userRepository.save(newUser);

      return savedUser as User;
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      }

      console.error('Error creating user:', err);
      throw new AppError('Failed to create user', HttpStatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  static async toggleUserActiveStatus(userId: string): Promise<User> {
    try {
      const userRepository = AppDataSource.getRepository('User');

      const user = await this.getUserById(userId);

      user.isActive = !user.isActive;

      const updatedUser = await userRepository.save(user);

      return updatedUser as User;
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      }

      console.error('Error toggling user active status:', err);
      throw new AppError(
        'Failed to toggle user active status',
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
