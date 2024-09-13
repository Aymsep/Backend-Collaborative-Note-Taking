import { Injectable } from '@nestjs/common';
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

  findOne(id: number) {
    return `This action returns a #${id} note`;
  }

  update(id: number, updateNoteDto: UpdateNoteDto) {
    return `This action updates a #${id} note`;
  }

  remove(id: number) {
    return `This action removes a #${id} note`;
  }
}
