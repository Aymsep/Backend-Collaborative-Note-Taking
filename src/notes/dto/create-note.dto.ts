import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateNoteDto {
  @IsNotEmpty()
  @IsString()
  content: string;
}
