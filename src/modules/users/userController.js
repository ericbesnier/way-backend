const fetch = require('node-fetch');

import User from './userModel';
import { createToken } from './utils/createToken';
import { facebookAuth } from './utils/facebookAuth';
import { googleAuth } from './utils/googleAuth';
import { findOrCreateLoginPending, getLoginPending } from '../loginPending/loginPendingController';
import {
  EXPO_WAY_MOBILE_LINK,
  EXPO_ANDROID_LINK,
  EXPO_IOS_LINK
} from '../../config/expoConfig';
import { MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE } from '../../config/mailJetConfig';

// c o n n e c t  M a i l J e t
//
const Mailjet = require('node-mailjet')
  .connect(MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE);


const sendNotification = async (token, title, body, data) => {
  console.log('userController/sendNotification: token=', token, ' title=', title, 'body=', body, ' data=', data);
  const message = {
    to: token,
    sound: 'default',
    title: title,
    body: body,
    data: data,
  };
  try {
    var response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
    const data = response._bodyInit;
    console.log('userController/sendNotification: response data=', data);
    return data;
  } catch (e) { throw e; }
};

const userToContact = (user) => {
  var contact = {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    name: user.fullName,
    emails: [{ email: user.email }],
    expoToken: user.expoToken,
    userId: user._id,
    image: { uri: user.avatar }
  };
  return contact;
};

// -----------------------------------------
//               p o s t
// -----------------------------------------

// l o g i n
//
export const login = async (req, res) => {
  console.log('=====================================');
  console.log('userController/login: req.body=', req.body);
  const { provider, providerToken, idToken } = req.body;
  var userInfos;
  var user;
  try {
    if (provider === 'google') {
      userInfos = await googleAuth(providerToken);
    } else {
      userInfos = await facebookAuth(providerToken);
    }
    user = await User.findOrCreateUser(userInfos);
    userInfos = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          idToken: idToken,
        }, new: true
      },
    );
    userInfos = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          isLogged: true,
        }, new: true
      },
    );
    userInfos = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          providerToken: providerToken,
        }, new: true
      },
    );
    console.log('userController/login: userInfos=', userInfos);
    return res.status(200).json({
      success: true,
      userInfos: userInfos,
      JWTtoken: `JWT ${createToken(userInfos)}`,
    });
  } catch (error) {
    console.log('userController/login findByIdAndUpdate error=', error);
    return res.status(400).json({ error: true, errorMessage: error.message });
  }
};

// l o g o u t
//
export const logout = async (req, res) => {
  const _id = req.params._id;
  console.log('=====================================');
  console.log('userController/logout _id=', _id);
  try {
    let userInfos = await User.findByIdAndUpdate(
      _id,
      { $set: { isLogged: false }, new: true },
    );
    console.log('userController/logout: userInfos=', userInfos);
    console.log('userController/logout: userInfos.isLogged=', userInfos.isLogged);
    return res.status(200).json({
      success: true,
      userInfos: userInfos
    });
  } catch (error) {
    console.log('userController/logout error=', error);
    return res.status(400).json({ error: true, errorMessage: error.message });
  }
};

// c r e a t e U s e r
//
export const createUser = async (req, res) => {
  const userInfos = new User(req.body);
  try {
    return res.status(200).json({
      success: true,
      userInfos: await userInfos.save()
    });
  } catch (error) {
    return res.status(error.status).json({ error: true, message: 'Error createUser' });
  }
};

// u p d a t e L o c a t i o n
//
export const updateLocation = async (req, res) => {
  const _id = req.params._id;
  const location = req.body;
  console.log('=====================================');
  console.log('userController/updateLocation _id=', _id);
  console.log('userController/updateLocation location=', location);
  try {
    let userInfos = await User.findByIdAndUpdate(
      _id,
      { $push: { locations: location } },
      { upsert: true, new: true },
    );
    return res.status(200).json({
      success: true,
      userInfos: userInfos
    });
  } catch (error) {
    console.log('userController/updateLocation error=', error);
    return res.status(error.status).json({ error: true, message: 'Error updateLocation' });
  }
};

// r e g i s t e r F o r P u s h N o t i f i c a t i o n s
//
export const registerForNotifications = async (req, res) => {
  const _id = req.params._id;
  const expoToken = req.body;
  console.log('=====================================');
  console.log('userController/registerForNotifications _id=', _id);
  console.log('userController/registerForNotifications expoToken=', expoToken);
  try {
    var userInfos = await User.findByIdAndUpdate(
      _id,
      { $set: expoToken },
      { upsert: true, new: true },
    );
    console.log('userController/registerForNotifications userInfos=', userInfos);

    // traitement du login pending suite à une demande de partage de localisation via email
    let loginPending = await getLoginPending(userInfos.email);
    console.log('userController/login: loginPending=', loginPending);

    if (loginPending.length > 0) {
      let userWaitingForLogin = await User.findById(loginPending[0].userId, (error, user) => {
        if (error) {
          console.log('userController/login: error !!! ', error);
        }
        if (user) {
          return user;
        } else {
          return null;
        }
      });
      console.log('userController/login: userWaitingForLogin=', userWaitingForLogin);

      let expoToken = userWaitingForLogin.expoToken;
      let title = 'login fulfilled !';
      let body = userInfos.fullName;
      let data = {
        action: 'LOGIN_FULFILLED',
        contact: userToContact(userInfos),
        payload: null
      };

      var response = await sendNotification(expoToken, title, body, data);
      console.log('userController/registerForNotifications response=', response);
    }
    return res.status(200).json({
      success: true,
      userInfos: userInfos
    });
  } catch (error) {
    console.log('userController/registerForNotifications error=', error);
    return res.status(error.status).json({ error: true, message: 'Error registerForNotifications' });
  }
};

// s e n d I n s t a l l a t i o n M a i l 
//
export const sendInstallationMail = async (req, res) => {
  var fullName;
  const _id = req.params._id;
  const contact = req.body;

  let body = 'L\'application way-mobile vous permet de partager votre localisation avec vos amis et de voir où ils sont sur une carte !\n\n'
    + 'L\'installation se fait en deux temps : \n\n'
    + '1. Installez d\'abord l\'application \'expo\' sur votre smartphone en cliquant sur le lien :\n'
    + '     - pour Android : ' + EXPO_ANDROID_LINK + '\n'
    + '     - pour Ios : ' + EXPO_IOS_LINK + '\n\n'
    + '2. Puis, installez l\'application \'way-mobile\' sur votre smartphone en cliquant sur le lien : ' + EXPO_WAY_MOBILE_LINK + '\n\n'
    + 'C\'est tout !';

  console.log('=====================================');
  console.log('userController/sendInstallationMail: _id=', _id);
  console.log('userController/sendInstallationMail: contact=', contact);
  await User.find({ _id: _id }, function (err, result) {
    if (err) throw err;
    fullName = result[0].fullName;
    console.log('userController/sendInstallationMail: fullName=', fullName, ' via way@deepfocus.fr');
  });
  console.log('userController/sendInstallationMail: contact.emails[0].email=', contact.emails[0].email);
  console.log('userController/sendInstallationMail: contact.name=', contact.name);

  try {
    let response = await Mailjet
      .post('send', { 'version': 'v3.1' })
      .request({
        'Messages': [
          {
            'From': {
              'Email': 'way@deepfocus.fr',
              'Name': fullName
            },
            'To': [
              {
                'Email': contact.emails[0].email,
                'Name': contact.name
              }
            ],
            'subject': 'Voulez-vous installer l\'application way-mobile sur votre smartphone ?',
            'TextPart': body,
          }
        ]
      });

    await findOrCreateLoginPending(_id, contact.emails[0].email);

    return res.status(200).json({
      success: true,
      response: response.body,
    });
  } catch (error) {
    console.log('userController/sendInstallationMail error=', error);
    return res.status(error.statusCode).json({ error: true, message: 'Error sendInstallationMail' });
  }
};


// -----------------------------------------
//               g e t
// -----------------------------------------

// i s S e r v e r R u n n i n g
//
export const isServerRunning = async (req, res) => {
  console.log('userController/isServerRunning');
  try {
    return res.status(200).json({
      success: true,
      infos: 'server is running'
    });
  } catch (error) {
    console.log('userController/isServerRunning error=', error);
    return res.status(error.status).json({ error: true, message: 'isServerRunning' });
  }

  // res.send('server is running');
};

// g e t A l l U s e r s
//
export const getAllUsers = async (req, res) => {
  console.log('userController/getAllUsers');
  console.log('userController/getAllUsers');

  try {
    return res.status(200).json({
      success: true,
      users: await User.find({})
    });
  } catch (error) {
    return res.status(error.status).json({ error: true, message: 'Error: getAllUsers' });
  }
};

// g e t U s e r B y I d
//
export const getUserById = async (req, res) => {
  const _id = req.query._id;
  console.log('=====================================');
  console.log('userController/getUserById _id=', _id);
  try {
    let userInfos = await User.findOne(
      { _id: _id },
    );
    console.log('userController/getUserById userInfos=', userInfos);
    return res.status(200).json({
      success: true,
      userInfos: userInfos
    });
  } catch (error) {
    console.log('userController/getUserById error=', error);
    return res.status(error.status).json({ error: true, message: 'Error: getUserById' });
  }
};

// g e t U s e r B y E m a i l
//
export const getUserByEmail = async (req, res) => {
  const email = req.query.email;
  console.log('=====================================');
  console.log('userController/getUserByEmail email=', email);
  try {
    let userInfos = await User.findOne(
      { email: email },
    );
    console.log('userController/getUserByEmail userInfos=', userInfos);
    return res.status(200).json({
      success: true,
      userInfos: userInfos
    });
  } catch (error) {
    console.log('userController/getUserByEmail error=', error);
    return res.status(error.status).json({ error: true, message: 'Error getUserByEmail' });
  }
};




// let userInfos = await User.findByIdAndUpdate(
//   user._id,
//   { $set: { isLogged: true }, new: true },
// );
// console.log('userController/login: isLogged userInfos=', userInfos);

// userInfos = await User.findByIdAndUpdate(
//   user._id,
//   { $set: { providerToken: providerToken }, new: true }
// );
// console.log('userController/login: providerToken userInfos=', userInfos);

// userInfos = await User.findByIdAndUpdate(
//   user._id,
//   { $set: { idToken: idToken }, new: true }
// );
// console.log('userController/login: idToken userInfos=', userInfos);