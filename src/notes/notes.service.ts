import { ForbiddenException, Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { DatabaseService } from 'src/database/database.service';
import { SUCCESS_MESSAGES } from 'src/messages/success-messages';
import { ERROR_MESSAGES } from 'src/messages/error-messages';

@Injectable()
export class NotesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(userId: number, note: CreateNoteDto) {
    try {
      const newNote = await this.databaseService.note.create({
        data: {
          userId,
          content: note.content,
        },
      });

      return {
        message: SUCCESS_MESSAGES.NOTE_CREATED,
        note: newNote,
      };
    } catch (error) {
      throw new InternalServerErrorException(ERROR_MESSAGES.CREATE_NOTE_FAILED);
    }
  }

  async findAll(userId: number) {
    try {
      const userNotes = await this.databaseService.note.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      const sharedNotes = await this.databaseService.noteShare.findMany({
        where: { userId },
        include: { note: true },
      });

      const allNotes = [...userNotes, ...sharedNotes.map((share) => share.note)];
      return {
        message: SUCCESS_MESSAGES.NOTES_RETRIEVED,
        notes: allNotes,
      };
    } catch (error) {
      throw new InternalServerErrorException(ERROR_MESSAGES.RETRIEVE_NOTES_FAILED);
    }
  }

  async findOne(userId: number, noteId: number) {
    try {
      const note = await this.databaseService.note.findUnique({
        where: { id: noteId },
      });

      if (!note) {
        throw new NotFoundException(ERROR_MESSAGES.NOTE_NOT_FOUND);
      }

      const isSharedWithMe = await this.databaseService.noteShare.findFirst({
        where: { userId, noteId },
      });

      if (note.userId !== userId && !isSharedWithMe) {
        throw new ForbiddenException(ERROR_MESSAGES.ACCESS_DENIED);
      }

      return {
        message: SUCCESS_MESSAGES.NOTE_RETRIEVED,
        note,
      };
    } catch (error) {
      throw new InternalServerErrorException(ERROR_MESSAGES.RETRIEVE_NOTE_FAILED);
    }
  }

  async shareNote(userId: number, noteId: number, targetId: number) {
    try {
      const note = await this.databaseService.note.findUnique({
        where: { id: noteId },
      });

      if (!note || note.userId !== userId) {
        throw new ForbiddenException(ERROR_MESSAGES.ACCESS_DENIED);
      }

      const alreadyShared = await this.databaseService.noteShare.findFirst({
        where: { noteId, userId: targetId },
      });

      if (alreadyShared) {
        return {
          message: ERROR_MESSAGES.NOTE_ALREADY_SHARED(targetId),
        };
      }

      const sharedNote = await this.databaseService.$transaction(async (prisma) => {
        return prisma.noteShare.create({
          data: {
            userId: targetId,
            noteId,
          },
        });
      });

      return {
        message: SUCCESS_MESSAGES.NOTE_SHARED(targetId),
        sharedNote,
      };
    } catch (error) {
      throw new InternalServerErrorException(ERROR_MESSAGES.SHARE_NOTE_FAILED);
    }
  }

  async update(userId: number, noteId: number, noteUpdated: UpdateNoteDto) {
    try {
      const note = await this.databaseService.note.findUnique({
        where: { id: noteId },
      });

      if (!note) {
        throw new NotFoundException(ERROR_MESSAGES.NOTE_NOT_FOUND);
      }

      if (note.userId !== userId) {
        throw new ForbiddenException(ERROR_MESSAGES.ACCESS_DENIED);
      }

      const updatedNote = await this.databaseService.note.update({
        where: { id: noteId },
        data: { content: noteUpdated.content },
      });

      return {
        message: SUCCESS_MESSAGES.NOTE_UPDATED,
        note: updatedNote,
      };
    } catch (error) {
      throw new InternalServerErrorException(ERROR_MESSAGES.UPDATE_NOTE_FAILED);
    }
  }

  async remove(userId: number, noteId: number) {
    try {
      const note = await this.databaseService.note.findUnique({
        where: { id: noteId },
      });

      if (!note || note.userId !== userId) {
        throw new NotFoundException(ERROR_MESSAGES.NOTE_NOT_FOUND);
      }

      await this.databaseService.$transaction(async (prisma) => {
        await prisma.noteShare.deleteMany({
          where: { noteId },
        });

        await prisma.note.delete({
          where: { id: noteId },
        });
      });

      return {
        message: SUCCESS_MESSAGES.NOTE_DELETED,
      };
    } catch (error) {
      throw new InternalServerErrorException(ERROR_MESSAGES.DELETE_NOTE_FAILED);
    }
  }

  async noteById(noteId: number){
    const note = await this.databaseService.note.findUnique({
      where:{
        id:noteId
      }
    })
    if(!note) throw new NotFoundException('Note found')
    return note
  }
}
