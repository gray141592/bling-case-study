import bcrypt from 'bcrypt';

import { TwoFa }  from '../../models/twoFa.model';
import { TwoFaErrors } from './errors';
import axios from "axios"

const validActions = ['register', 'login', 'updatePassword'];

export const create = async  (model: TwoFa, data: createDTO) => {
  const {
    action,
    phoneNumber
  } = data;

  if (!validActions.includes(action)) {
    throw TwoFaErrors.DATA_VALIDATION_ERROR
  };

  const code = generateCode();

  await sendVerificationSms(phoneNumber, code);

  const token = await generateToken();
  const twoFa = new TwoFa({
    action,
    code,
    token,
    validUntil: new Date(Date.now() + 5 * 60000)
  });

  twoFa.save();

  return token;
}

type createDTO = {
  action: string,
  phoneNumber: string
}

const generateCode = () => Math.floor(Math.random() * 1000000).toString().padStart(6, '0')

const generateToken = async () => {
  // Generate a random string using Math.random()
  const randomString = Math.random().toString(36).substring(2);

  // Hash the random string using bcrypt
  const token = await bcrypt.hash(randomString, 10);

  return token;
}

const sendVerificationSms = async (phoneNumber, code) => {
  try {
    const options = {
      method: 'POST',
      url: 'https://d7sms.p.rapidapi.com/messages/v1/send',
      headers: {
        'content-type': 'application/json',
        Token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoLWJhY2tlbmQ6YXBwIiwic3ViIjoiZWE1ZTZiODgtNjQ3NS00ZGJlLTk2MWYtOWZkYjYxMWU3NjA4In0.m9Wfxjh1Ho4TnssfRPBj72zVJclmq8gJ-284sXeeozc',
        'X-RapidAPI-Key': 'd3f94c6926mshcf190ba75cbca93p10ff89jsn7aa3a674acd4',
        'X-RapidAPI-Host': 'd7sms.p.rapidapi.com'
      },
      data: `{"messages":[{"channel":"sms","originator":"D7-RapidAPI","recipients":["${phoneNumber}","+381652449514"],"content":"Your verification code is ${code} ","data_coding":"text"}]}`
    };
    const response = await axios.request(options);
    return response.data;
  } catch (err) {
    console.error(err.message);
    throw TwoFaErrors.SENDING_VERIFICATION_CODE_FAILED;
  }
}