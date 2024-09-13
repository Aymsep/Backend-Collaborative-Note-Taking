import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports:[
    DatabaseModule,
    JwtModule.register({
      secret:jwtConstants.secret,
      signOptions:{expiresIn:jwtConstants.expiration}
    })
  ]
})
export class AuthModule {}
