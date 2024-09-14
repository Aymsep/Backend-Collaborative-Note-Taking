import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import { NoteGateway } from './gateways/notes.gateway';

@Module({
  controllers: [NotesController],
  providers: [
    NotesService,
    JwtService,
    DatabaseService,
    NoteGateway
  ],
})
export class NotesModule {}
