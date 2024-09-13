import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth/local')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  signUpLocal(@Body() user:CreateUserDto){
    return this.authService.signUpLocal(user)
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signInLocal(@Body() user:LoginUserDto){
    const userValidate = await this.authService.validateUser(user['email'],user['password']) 
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.signInLocal(userValidate)
  }

  @UseGuards(AuthGuard('jwt-checker'))
  @Get('profile')
  async getProfile(@Req() req: Request){
    const user = req.user
    return this.authService.getProfile(user['sub'])
  }

  
}
