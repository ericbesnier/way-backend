import SendingRelation from './SendingRelationModel';


// -----------------------------------------
//               p o s t
// -----------------------------------------

// f i n d O r C r e a t e S e n d i n g R e l a t i o n
//
export const findOrCreateSendingRelation = async (req, res) => {
  // console.log('=====================================');
  // console.log('sendingRelationsController/findOrCreateSendingRelation: req.body=', req.body);
  try {
    await SendingRelation.findOrCreateSendingRelation(req.body);
    return res.status(200).json({
      success: true,
      sendingRelations: await SendingRelation.find({}),
    });
  } catch (error) {
    console.log('sendingRelationsController/findOrCreateSendingRelation error=', error);
    return res.status(400).json({ error: true, errorMessage: error.message });
  }
};

// d e l e t e S e n d i n g R e l a t i o n
//
export const deleteSendingRelation = async (req, res) => {
  console.log('=====================================');
  console.log('sendingRelationsController/deleteSendingRelation: req.body=', req.body);
  const { senderId, receiverId } = req.body;
  try {
    await SendingRelation.findOneAndRemove({ $and: [{ senderId: senderId }, { receiverId: receiverId }] });
    return res.status(200).json({
      success: true,
      sendingRelations: await SendingRelation.find({}),
    });
  } catch (error) {
    console.log('sendingRelationsController/deleteSendingRelation error=', error);
    return res.status(400).json({ error: true, errorMessage: error.message });
  }
};

// d e l e t e S e n d i n g R e l a t i o n s B y I d
//
export const deleteSendingRelationsById = async (req, res) => {
  console.log('=====================================');
  console.log('sendingRelationsController/deleteSendingRelationsById: req.body=', req.body);
  const { _id } = req.body;
  try {
    await SendingRelation.remove({ $or: [{ senderId: _id }, { receiverId: _id }] });
    return res.status(200).json({
      success: true,
      sendingRelations: await SendingRelation.find({}),
    });
  } catch (error) {
    console.log('sendingRelationsController/deleteSendingRelation error=', error);
    return res.status(400).json({ error: true, errorMessage: error.message });
  }
};

// g e t S e n d i n g R e l a t i o n
//
export const getSendingRelation = async (req, res) => {
  console.log('=====================================');
  console.log('sendingRelationsController/getSendingRelation: req.body=', req.body);
  const { senderId, receiverId } = req.body;
  try {
    var sendingRelation = await SendingRelation.find({ $and: [{ senderId: senderId }, { receiverId: receiverId }] });
    return res.status(200).json({
      success: true,
      sendingRelation: sendingRelation
    });
  } catch (error) {
    console.log('sendingRelationsController/getSendingRelation error=', error);
    return res.status(400).json({ error: true, errorMessage: error.message });
  }
};

// f e t c h S e n d i n g R e l a t i o n s B y I d
//
export const fetchSendingRelationsById = async (req, res) => {
  // console.log('=====================================');
  // console.log('sendingRelationsController/fetchSendingRelationsById: req.body=', req.body);
  const _id = req.query._id;
  try {
    var sendingRelations = await SendingRelation.find({ $or: [{ senderId: _id }, { receiverId: _id }] });
    return res.status(200).json({
      success: true,
      sendingRelations: sendingRelations
    });
  } catch (error) {
    console.log('sendingRelationsController/fetchSendingRelationsById error=', error);
    return res.status(400).json({ error: true, errorMessage: error.message });
  }
};