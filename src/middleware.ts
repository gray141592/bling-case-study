import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = "tajna";

export interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: 'No authorization header provided' });
  }

  const [_, token] = authHeader.split(' ');

  try {
    const payload = jwt.verify(token, JWT_SECRET) as UserPayload;
    req.currentUser = payload;
    next();
  } catch (err) {
    res.status(401).send({ message: 'Invalid token' });
  }
};
