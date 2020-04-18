import jwt from 'jsonwebtoken';

import config from '../../../config/config';

console.log('createToken...');
export const createToken = args => {
  // console.log('createToken: args=', args);
  console.log('>>> createToken');
  return jwt.sign({ id: args._id }, config.JWT_SECRET);
};
