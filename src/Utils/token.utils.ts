// src/utils/token.util.ts

import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';

const jwtService = new JwtService({ secret: jwtConstants.secret});

export const generateToken = (user: any) => {
  const payload = { id: user.id, email: user.email, username: user.username };
  return {
    access_token: jwtService.sign(payload, { expiresIn: '7h' }), 
    user: { ...payload },
  };
};

export const verifyToken = (token: string) => {
  return jwtService.verify(token);
};
