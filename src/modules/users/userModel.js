import mongoose from 'mongoose';
const Scheme = mongoose.Schema;

mongoose.set('useFindAndModify', false);

const UserSchema = new Scheme({
  firstName: String,
  lastName: String,
  fullName: String,
  email: String,
  avatar: String,
  expoToken: String,
  providerToken: String,
  idToken: String,
  JWTtoken: String,
  locations: [{
    moked: Boolean,
    timestamp: Number,
    coords: {
      speed: Number,
      heading: Number,
      accuracy: Number,
      longitude: Number,
      altitude: Number,
      latitude: Number
    },
    locationAddress:
   [ { street: String,
     postalCode: String,
     city: String,
     region: String,
     name: String,
     country: String,
     isoCountryCode: String } ] 
  }],
  providerData: {
    uid: String,
    provider: String,
  },
  isLogged: Boolean,
},
{ timestamp: true },
);

UserSchema.statics.findOrCreateUser = async function (args) {
  try {
    const user = await this.findOne({
      email: args.email,
      fullName: args.fullName,
    });
    if (!user) {
      return await this.create(args);
    }
    return user;
  } catch (e) {
    return e;
  }
};

export default mongoose.model('User', UserSchema);

