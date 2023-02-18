import { ApplicationError } from "../../errors";

export const TwoFaErrors = {
  VERIFICATION_FAILED: new ApplicationError('Verification failed', 403),
  SENDING_VERIFICATION_CODE_FAILED: new ApplicationError('Sending verification code failed', 422),
  DATA_VALIDATION_ERROR: new ApplicationError('Data validation error', 400),
}

