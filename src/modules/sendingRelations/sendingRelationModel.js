import mongoose from 'mongoose';
const Scheme = mongoose.Schema;

mongoose.set('useFindAndModify', false);

const SendingRelationSchema = new Scheme({
  senderId: String,
  senderEmail: String,
  senderFirstName: String,
  senderLastName: String,
  senderFullName: String,
  senderExpoToken: String,
  senderIsLogged: String,
  receiverId: String,
  receiverEmail: String,
  receiverFirstName: String,
  receiverLastName: String,
  receiverFullName: String,
  receiverExpoToken: String,
  receiverIsLogged: String,
}
);
SendingRelationSchema.statics.findOrCreateSendingRelation = async function (args) {
  try {
    const sendingRelation = await this.findOne({ $and: [{ senderId: args.senderId }, { receiverId: args.receiverId }] });
    if (!sendingRelation) {
      return await this.create(args);
    }
    return sendingRelation;
  } catch (e) {
    return e;
  }

// SendingRelationSchema.statics.findOrCreateSendingRelation = async function (args) {
//   try {
//     const sendingRelation = await this.findOne({
//       senderId: args.senderId,
//       senderEmail: args.senderEmail,
//       senderFirstName: args.senderFirstName,
//       senderLastName: args.senderLastName,
//       senderFullName: args.senderFullName,
//       senderExpoToken: args.senderExpoToken,
//       senderIsLogged: args.senderIsLogged,
//       receiverId: args.receiverId,
//       receiverEmail: args.receiverEmail,
//       receiverFirstName: args.receiverFirstName,
//       receiverLastName: args.receiverLastName,
//       receiverFullName: args.receiverFullName,
//       receiverExpoToken: args.receiverExpoToken,
//       receiverIsLogged: args.receiverIsLogged,
//     });
//     if (!sendingRelation) {
//       return await this.create(args);
//     }
//     return sendingRelation;
//   } catch (e) {
//     return e;
//   }
};

export default mongoose.model('SendingRelation', SendingRelationSchema);

