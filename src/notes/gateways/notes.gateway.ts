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

@WebSocketGateway({
  cors: {
    origin: '*', // Allow requests from all origins, for development purposes
  },
})
export class NoteGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
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
}
