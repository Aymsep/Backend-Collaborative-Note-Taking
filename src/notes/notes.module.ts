import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { JwtService } from '@nestjs/jwt';
import { NoteGateway } from './gateways/notes.gateway';

@Module({
  controllers: [NotesController],
  providers: [
    NotesService,
    NoteGateway
  ],
})
export class NotesModule {}
