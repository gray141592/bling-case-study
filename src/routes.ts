import express, { Request, Response, NextFunction } from 'express';
import User from './models/user.model';

const router = express.Router();

router.post('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, phoneNumber } = req.body;
    const user = new User({
      name,
      email,
      password,
      phoneNumber,
    });
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    next(err);
  }
});

export { router };
