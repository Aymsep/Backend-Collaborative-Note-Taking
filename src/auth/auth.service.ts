import { ConflictException, ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { messages } from 'src/messages/auth-messages';
import { hashPassword } from 'src/Utils/hash.utils';
import { generateToken } from 'src/Utils/token.utils';

@Injectable()
export class AuthService {

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService
  ) {}

  // Register a new user
  async signUpLocal(user: CreateUserDto) {
    const { email, password, username } = user;

    // Check if the email is already registered
    const existingUser = await this.databaseService.user.findFirst({ where: { email } });
    if (existingUser) throw new ConflictException(messages.EMAIL_IN_USE);

    // Hash the password
    const hashedPassword = await hashPassword(password);

    try {
      // Create the new user and store in the database
      const newUser = await this.databaseService.user.create({
        data: { email, username, password: hashedPassword },
      });
      return generateToken(newUser);  // Return the access token after registration
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(messages.REGISTRATION_FAILED);
    }
  }

  // Log in a user
  async signInLocal(user: CreateUserDto) {
    return generateToken(user);
  }

  // Get the authenticated user's profile
  async getProfile(userId: number) {
    const user = await this.databaseService.user.findUnique({ where: { id: userId } });
    if (!user) throw new ForbiddenException(messages.USER_NOT_FOUND);

    // Remove sensitive information (password) from the returned user profile
    const { password, ...results } = user;
    return results;
  }

  // Validate a user with their email and password
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.databaseService.user.findUnique({ where: { email } });

    // Check if the user exists and the password matches
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException(messages.INVALID_CREDENTIALS);
    }

    // Return user details, excluding the password
    const { password: _, ...result } = user;
    return result;
  }
}