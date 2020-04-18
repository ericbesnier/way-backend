import axios from 'axios';

import { getUserInfo } from './getUserInfo';

export async function googleAuth(token) {
  console.log('-----------------------------------------');
  console.log('googleAuth');
  try {
    const { data } = await axios.get('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('-----------------------------------------');
    console.log('googleAuth: data=', data);
    return getUserInfo(data, 'google');
  } catch (e) {
    console.log('-----------------------------------------');
    console.log('googleAuth: error=', e);
    throw (e);
  }
}