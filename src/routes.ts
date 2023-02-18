import express, { Request, Response, NextFunction } from 'express';
import { authenticate } from "./middleware";
import { User } from './models/user.model';
import { UserController } from './controllers/user.controller';
import { TwoFaController } from './controllers/twoFa.controller';
import { ApplicationError } from './errors';
import { TwoFa } from './models/twoFa.model';

const router = express.Router();


router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password, phoneNumber, twoFa } = req.body;
  try {
    if (!email || !password || !name || !phoneNumber || !twoFa) {
      res.status(400).send({ message: "Invalid data" });
      return;
    }
    const { code, token } = twoFa;

    await TwoFaController(twoFa).verify({
      code,
      token,
      action: 'register'
    });

    const user = await UserController(User).register({
      name,
      email,
      password,
      phoneNumber
    });
    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
});

// Route to list all users
router.get('/users', authenticate, async (req, res) => {
  try {
    // Retrieve all users from the database
    const users = await User.find();

    // Return the list of users
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.post("/initiate-2fa", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { action, phoneNumber } = req.body;

    if (!action || !phoneNumber) {
      res.status(400).send({ message: "Invalid data" });
      return;
    }

    const token = await TwoFaController(TwoFa).create({
      action,
      phoneNumber
    });

    res.status(200).send({ message: "2FA initiated successfully", token });
  } catch (error) {
    next(error)
  }
})

// Login route
router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, twoFa } = req.body;
    if (!email || !password || !twoFa) {
      res.status(400).send({ message: "Invalid data" });
      return;
    }
    const { code, twoFaToken } = twoFa;

    await TwoFaController(twoFa).verify({
      code,
      token: twoFaToken,
      action: 'login'
    });

    const authToken = await UserController(User).login({
      email,
      password
    });
    res.status(200).send({ message: "Authentication successful", authToken });
  } catch (error) {
    next(error);
  }
});

export { router };