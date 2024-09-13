import { Body, Controller, HttpCode, HttpStatus, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto, LoginUserDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('local/signup')
  signUpLocal(@Body() user:CreateUserDto){
    return this.authService.signUpLocal(user)
  }

  @HttpCode(HttpStatus.OK)
  @Post('local/signin')
  async signInLocal(@Body() user:LoginUserDto){
    const userValidate = await this.authService.validateUser(user['email'],user['password']) 
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.signInLocal(userValidate)
  }

  
}
