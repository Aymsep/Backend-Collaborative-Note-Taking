import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@UseGuards(AuthGuard('jwt-checker'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  async getAllUsers(){
    return await this.usersService.getUsers()
  }
}
