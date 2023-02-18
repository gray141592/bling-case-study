import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User }  from '../../models/user.model';
import { UserErrors } from './errors';

export const login = async  (userModel: User, data: loginDTO) => {
  const {
    email,
    password
  } = data;

  const user = await userModel.findOne({ email });

    if (!user) {
      throw UserErrors.LOGIN_FAILED;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw UserErrors.LOGIN_FAILED;
    }

    return jwt.sign({ email: user.email }, "tajna");
}

type loginDTO = {
  email: String,
  password: String
}