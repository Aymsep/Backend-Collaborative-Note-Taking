import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { sharedNoteDto } from './dto';

@Controller('notes')
@UseGuards(AuthGuard('jwt-checker'))
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(
    @Body() note: CreateNoteDto,
    @Req() req: Request
    ) {
      const user = req.user

    return this.notesService.create(user['id'],note);
  }

  @Post('share')
  async share(
    @Body() note:sharedNoteDto,
    @Req() req: Request
  ){
    const user = req.user
    return this.notesService.shareNote(user['id'],note['NoteId'],note['targetId'])

  }

  @Get()
  findAll(
    @Req() req: Request,
  ) {
    const user = req.user
    console.log('user',user)
    return this.notesService.findAll(user['id']);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Req() req: Request
    ) {
      const user = req.user
    return this.notesService.findOne(user['id'],+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    return this.notesService.update(+id, updateNoteDto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() req: Request
    ) {
      const user = req.user
    return this.notesService.remove(user['id'],+id);
  }
}
