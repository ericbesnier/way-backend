console.log('users/userRoutes...');
import { Router } from 'express';
import * as userController from './userController';
import { requireJwtAuth } from '../../utils/requireJwtAuth';

const UserRoutes = new Router();

// p o s t   u s e r
UserRoutes.post('/user/login', userController.login);
UserRoutes.post('/user/:_id/logout', userController.logout);
UserRoutes.post('/user', userController.createUser);
UserRoutes.post('/user/:_id/updateLocation', userController.updateLocation);
UserRoutes.post('/user/:_id/registerForNotifications', userController.registerForNotifications);
UserRoutes.post('/user/:_id/sendInstallationMail', userController.sendInstallationMail);

// g e t   u s e r
UserRoutes.get('/user/isServerRunning', userController.isServerRunning);
UserRoutes.get('/users', requireJwtAuth, userController.getAllUsers);
UserRoutes.get('/user/getUserById', userController.getUserById);
UserRoutes.get('/user/getUserByEmail', userController.getUserByEmail);

export default UserRoutes;
