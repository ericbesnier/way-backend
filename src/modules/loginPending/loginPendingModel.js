import mongoose from 'mongoose';
const Scheme = mongoose.Schema;

mongoose.set('useFindAndModify', false);

const LoginPendingSchema = new Scheme({
  userId: String,
  contactEmail: String
}
);

LoginPendingSchema.statics.findOrCreateLoginPending = async function (args) {
  try {
    const loginPending = await this.findOne({
      userId: args.userId,
      contactEmail: args.contactEmail,
    });
    if (!loginPending) {
      return await this.create(args);
    }
    console.log('LoginPendingModel/findOrCreateLoginPending: loginPending=', loginPending);

    return loginPending;
  } catch (e) {
    return e;
  }
};

export default mongoose.model('LoginPending', LoginPendingSchema);

