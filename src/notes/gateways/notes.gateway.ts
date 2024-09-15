import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotesService } from '../notes.service';

@WebSocketGateway({
  cors: {
    origin: '*', // Allow requests from all origins, for development purposes
  },
})
export class NoteGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly noteService: NotesService
    ){}
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('NoteGateway');

  afterInit(server: Server) {
    this.logger.log('Initialized WebSocket Server');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('editNote')
  handleEditNote(client: Socket, payload: { noteId: number; content: string }) {
    this.logger.log(`Received editNote event for noteId: ${payload.noteId}`);
    client.broadcast.emit(`noteUpdated:${payload.noteId}`, payload.content); // Broadcast changes
  }

  @SubscribeMessage('deleteNote')
  handleDeleteNote(client: Socket, payload: { noteId: number }) {
    this.logger.log(`Received deleteNote event for noteId: ${payload.noteId}`);
    console.log(`Note deleted: ${payload.noteId}`);
    // Broadcast the note deletion to all other clients
    client.broadcast.emit(`noteDeleted:${payload.noteId}`);
  }

  @SubscribeMessage('shareNote')
  async handleShareNote(client: Socket, payload: {noteId: number; sharedWith: number }) {
  this.logger.log(`Sharing note ${payload.noteId} with users: ${payload.sharedWith}`);

  // Fetch the note data (assuming you have a service to retrieve note by ID)
  const note = await this.noteService.noteById(payload.noteId);

  // Emit the note data to all users the note is shared with
    client.broadcast.emit(`noteShared:${payload.sharedWith}`, { note });
}


  
}
