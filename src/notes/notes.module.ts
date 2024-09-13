import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [NotesController],
  providers: [
    NotesService,
    JwtService,
    DatabaseService
  ],
})
export class NotesModule {}
