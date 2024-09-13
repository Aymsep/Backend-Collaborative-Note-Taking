import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class NotesService {
  constructor(
    private readonly databaseService: DatabaseService
  ){}
  async create(userId:number,note: CreateNoteDto) {
    return await this.databaseService.note.create({
      data:{
        userId,
        content:note.content
      }
    })
  }

  async findAll(userId:number) {
    return await this.databaseService.note.findMany({
      where:{
        userId
      },
      orderBy:{createdAt:'desc'}
    }) 
  }

  async findOne(userId: number,noteId: number) {
    const note = await this.databaseService.note.findUnique({
      where:{
        id:noteId
      }
    })
    if(!note || note.userId !== userId) {
      throw new NotFoundException('Not found or Access Denied')
    }

    return note
    }

  update(id: number, updateNoteDto: UpdateNoteDto) {
    return `This action updates a #${id} note`;
  }

  async remove(userId:number,noteId:number) {
    const note = await this.databaseService.note.findUnique({
      where:{
        id:noteId
      }
    })
    if(!note || note.userId !== userId) {
      throw new NotFoundException('Not found or Access Denied')
    }
    return await this.databaseService.note.delete({
      where:{
        id:noteId
      }
    })
  }
}
