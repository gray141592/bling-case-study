import bcrypt from 'bcrypt';

import { TwoFa }  from '../../models/twoFa.model';
import { TwoFaErrors } from './errors';

const validActions = ['register', 'login', 'updatePassword'];

export const verify = async  (model: TwoFa, data: verifyDTO) => {
  const {
    action,
    token,
    code
  } = data;

  if (!validActions.includes(action)) {
    console.log(`Invalid action ${action}`);
    throw TwoFaErrors.DATA_VALIDATION_ERROR
  };

  const twoFa = await  TwoFa.findOne({ token });

  if (!twoFa || twoFa.validUntil.getTime() < Date.now()) {
    console.log(`Not valid ${action}`);
    throw TwoFaErrors.VERIFICATION_FAILED
  }

  const isValidCode = await bcrypt.compare(code, twoFa.code);

  if (!isValidCode) {
    console.log(`Code not comparing ${action}`);
    throw TwoFaErrors.VERIFICATION_FAILED
  }

  return;
}

type verifyDTO = {
  action: string,
  token: string,
  code: string
}