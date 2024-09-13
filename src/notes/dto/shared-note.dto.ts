import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class sharedNoteDto {
  @IsNotEmpty()
  NoteId: number;


  @IsNotEmpty()
  targetId: number;
}
