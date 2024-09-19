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

interface OnlineUser {
  id: number; // userId is now a number
  username: string;
}

@WebSocketGateway({
  cors: {
    origin: '*', // Allow requests from all origins, for development purposes
  },
})
export class NoteGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly noteService: NotesService) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('NoteGateway');

  // Use an array to store online users as objects with userId and username
  private onlineUsers: OnlineUser[] = [];

  afterInit(server: Server) {
    this.logger.log('Initialized WebSocket Server');
  }

  handleConnection(client: Socket) {
    // Parse userId as a number
    const userId = Number(client.handshake.query.userId);
    const username = client.handshake.query.username as string;

    if (isNaN(userId)) {
      this.logger.error('User ID is missing or not a valid number');
      client.disconnect(); // Disconnect the client if no valid user ID is provided
      return;
    }

    this.logger.log(`Client connected: ${client.id}, UserId: ${userId}`);

    // Check if the user is already in the onlineUsers array
    const isUserOnline = this.onlineUsers.some(user => user.id === userId);

    if (!isUserOnline) {
      // Add the user to the online users array if not already present
      this.onlineUsers.push({
        id: userId,
        username: username || 'Unknown User', // Default to 'Unknown User' if no username is provided
      });
    }

    this.logger.log('Connected Users:', JSON.stringify(this.onlineUsers));

    // Notify all clients about the updated list of online users
    this.server.emit('onlineUsers', this.onlineUsers);
  }

  handleDisconnect(client: Socket) {
    // Parse userId as a number
    const userId = Number(client.handshake.query.userId);

    if (!isNaN(userId)) {
      // Filter out the disconnected user from the onlineUsers array
      this.onlineUsers = this.onlineUsers.filter(user => user.id !== userId);
      this.logger.log(`Client disconnected: ${client.id}, UserId: ${userId}`);

      // Notify all clients about the updated list of online users
      this.server.emit('onlineUsers', this.onlineUsers);
    } else {
      this.logger.error(`Could not find valid User ID for client: ${client.id}`);
    }
  }

  @SubscribeMessage('editNote')
  handleEditNote(client: Socket, payload: { noteId: number; content: string }) {
    this.logger.log(`Received editNote event for noteId: ${payload.noteId}`);
    this.logger.log(`Broadcasting note update for noteId: ${payload.noteId}, content: ${payload.content}`);
    
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
  async handleShareNote(client: Socket, payload: { noteId: number; sharedWith: number }) {
    this.logger.log(`Sharing note ${payload.noteId} with users: ${payload.sharedWith}`);

    // Fetch the note data (assuming you have a service to retrieve note by ID)
    const note = await this.noteService.noteById(payload.noteId);

    // Emit the note data to all users the note is shared with
    client.broadcast.emit(`noteShared:${payload.sharedWith}`, { note });

    client.broadcast.emit(`noteNotification:${payload.sharedWith}`, {
      message: `${client.handshake.query.username} has shared a note with you`,
      note,
    });
  }
}
