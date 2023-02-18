import { TwoFa } from "../models/twoFa.model";
import { create, verify } from "./twoFa"

export const TwoFaController = (model: TwoFa) => ({
  create: (data) => create(model, data),
  verify: (data) => verify(model, data)
});
