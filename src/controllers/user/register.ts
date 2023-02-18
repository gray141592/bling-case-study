import { User }  from '../../models/user.model';
import { UserErrors } from './errors';

export const register = async  (userModel: User, data: registerDTO) => {
  const {
    name,
    email,
    password,
    phoneNumber
  } = data;

  const duplicatedUser = await userModel.count({ email });

  if (duplicatedUser != 0) {
    throw UserErrors.DUPLICATED_USER;
  }
  const user = new User({
    name,
    email,
    password,
    phoneNumber,
  });
  await user.save();
  return user;
}

type registerDTO = {
  name: String,
  email: String,
  password: String,
  phoneNumber: String,
}