import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { sharedNoteDto } from './dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { CustomLoggerService } from 'src/logger/logger.service';

@Controller('notes')
@UseGuards(AuthGuard('jwt-checker'))
export class NotesController {
  constructor(
    private readonly notesService: NotesService,
    ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() note: CreateNoteDto, @GetUser() user: any) {
    return this.notesService.create(user.id, note);
  }

  @Post('share')
  async share(@Body() note: sharedNoteDto, @GetUser() user: any) {
    return this.notesService.shareNote(user.id, note.NoteId, note.targetId);
  }

  @Get()
  findAll(@GetUser() user: any) {
    return this.notesService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: any) {
    return this.notesService.findOne(user.id, +id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() content: UpdateNoteDto, @GetUser() user: any) {
    return this.notesService.update(user.id, +id, content);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @GetUser() user: any) {
    return this.notesService.remove(user.id, +id);
  }
}