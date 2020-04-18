console.log('loginPending/routes...');
import { Router } from 'express';
import * as loginPendingController from './loginPendingController';

const LoginPendingRoutes = new Router();

// p o s t   S e n d i n g R e l a t i o n
// LoginPendingRoutes.post('/loginPending/findOrCreateLoginPending', loginPendingController.findOrCreateLoginPending);
LoginPendingRoutes.post('/loginPending/deleteLoginPending', loginPendingController.deleteLoginPending);

// g e t   s e n d i n g R e l a t i o n
LoginPendingRoutes.get('/loginPending/getLoginPending', loginPendingController.getLoginPending);
LoginPendingRoutes.get('/loginPending/fetchLoginPendingByUserId', loginPendingController.fetchLoginPendingByUserId);

export default LoginPendingRoutes;
