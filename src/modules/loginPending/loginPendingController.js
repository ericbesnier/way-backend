import LoginPending from './LoginPendingModel';


// -----------------------------------------
//               p o s t
// -----------------------------------------

// f i n d O r C r e a t e L o g i n P e n d i n g
//
export const findOrCreateLoginPending = async (userId, contactEmail) => {
  console.log('=====================================');
  console.log('loginPendingController/findOrCreateLoginPending: userId=', userId, ' contactEmail=', contactEmail);
  try {
    let loginPending = await LoginPending.findOrCreateLoginPending({ userId, contactEmail });
    console.log('loginPendingController/findOrCreateLoginPending: loginPending=', loginPending);

    return {
      success: true,
      loginPending: loginPending,
    };
  } catch (error) {
    console.log('loginPendingController/findOrCreateLoginPending: error=', error);
    return { error: true, errorMessage: error.message };
  }
};

// d e l e t e L o g i n P e n d i n g
//
export const deleteLoginPending = async (req, res) => {
  console.log('=====================================');
  console.log('loginPendingController/deleteLoginPending: req.body=', req.body);
  const { userId, contactEmail } = req.body;
  try {
    await LoginPending.findOneAndRemove({ userId: userId, contactEmail: contactEmail });
    return res.status(200).json({
      success: true,
      loginPending: await LoginPending.find({}),
    });
  } catch (error) {
    console.log('loginPendingController/deleteLoginPending error=', error);
    return res.status(400).json({ error: true, errorMessage: error.message });
  }
};

// g e t L o g i n P e n d i n g
//
export const getLoginPending = async (contactEmail) => {
  console.log('=====================================');
  console.log('loginPendingController/getLoginPending: contactEmail=', contactEmail);
  try {
    var loginPending = await LoginPending.find({ contactEmail: contactEmail });
    return loginPending;
  } catch (error) {
    console.log('loginPendingController/fetchLoginPendingByUserId error=', error);
    return { error: true, errorMessage: error.message };
  }
};

// f e t c h L o g i n P e n d i n g B y U s e r I d
//
export const fetchLoginPendingByUserId = async (req, res) => {
  console.log('=====================================');
  console.log('loginPendingController/fetchLoginPendingByUserId: req.body=', req.body);
  const _id = req.query._id;
  try {
    var loginPending = await LoginPending.find({ $or: [{ userId: _id }, { contactEmail: _id }] });
    return res.status(200).json({
      success: true,
      loginPending: loginPending
    });
  } catch (error) {
    console.log('loginPendingController/fetchLoginPendingByUserId error=', error);
    return res.status(400).json({ error: true, errorMessage: error.message });
  }
};