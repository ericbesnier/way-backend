export function getUserInfo(user, provider) {
  let firstName;
  let lastName;
  let fullName;
  let avatar;
  console.log('-----------------------------------------');
  console.log('utils/getUserInfo: provider=', provider);
  console.log('utils/getUserInfo: user=', user);
  if (provider === 'google') {
    firstName = user.given_name;
    lastName = user.family_name;
    fullName = `${user.given_name} ${user.family_name}`;
    avatar = user.picture;
  } else {
    fullName = user.name;
    avatar = user.picture.data.url;
  }

  return {
    firstName,
    lastName,
    fullName,
    avatar,
    email: user.email,
    providerData: {
      uid: user.id,
      provider,
    },
  };
}