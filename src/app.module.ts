import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { NotesModule } from './notes/notes.module';
import { UsersModule } from './users/users.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { CustomLoggerService } from './logger/logger.service';

@Module({
  imports: [
    AuthModule,
    NotesModule,
    UsersModule,
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide:CustomLoggerService,
      useClass:CustomLoggerService 
    }
  ],
})
export class AppModule {
constructor(private readonly logger:CustomLoggerService ){
  this.logger.log('Application Initialized')
}
}
