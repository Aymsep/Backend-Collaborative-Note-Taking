// src/auth/guards/jwt-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Request } from 'express';
import { jwtConstants } from 'src/auth/constants';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new ForbiddenException('No token provided');
    }

    const token = authHeader.split(' ')[1];
    try {
      const decodedToken = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret, // Using the access token secret
      });

      // Attach user information to the request object
      request['user'] = decodedToken;
      return true;
    } catch (error) {
      throw new ForbiddenException('Invalid token');
    }
  }
}