import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

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
    console.log('user',user)

    return this.notesService.create(user['id'],note);
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
  findOne(@Param('id') id: string) {
    return this.notesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    return this.notesService.update(+id, updateNoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notesService.remove(+id);
  }
}
