import axios from 'axios';

import { getUserInfo } from './getUserInfo';

export async function facebookAuth(token) {
  try {
    const { data } = await axios.get(
      `https://graph.facebook.com/v3.3/me?fields=email,name,picture.height(2048)&access_token=${token}`
    );
    console.log('userController/login: data=', data);

    return getUserInfo(data, 'facebook');
  } catch (e) {
    throw (e);
  }
}