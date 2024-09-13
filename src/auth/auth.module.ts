import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AtStratJwt } from './stratgies';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    AtStratJwt,
  ],
  imports:[
    DatabaseModule,
    JwtModule.register({
      secret:jwtConstants.secret
    })
  ]
})
export class AuthModule {}
