import { User } from "../models/user.model";
import { login, register } from "./user"

export const UserController = (userModel: User) => ({
  login: (data) => login(userModel, data),
  register: (data) => register(userModel, data)
});