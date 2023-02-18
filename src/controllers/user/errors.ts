import { ApplicationError } from "../../errors";

export const UserErrors = {
  LOGIN_FAILED: new ApplicationError('Login failed', 422),
  DATA_VALIDATION_FAILED: new ApplicationError('Body validation faliature', 400),
  DUPLICATED_USER: new ApplicationError('Email taken', 422),
}

