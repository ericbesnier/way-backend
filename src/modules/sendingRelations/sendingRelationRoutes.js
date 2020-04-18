console.log('sendingRelations/routes...');
import { Router } from 'express';
import * as sendingRelationController from './sendingRelationController';

const SendingRelationRoutes = new Router();

// p o s t   S e n d i n g R e l a t i o n
SendingRelationRoutes.post('/sendingRelation/findOrCreateSendingRelation', sendingRelationController.findOrCreateSendingRelation);
SendingRelationRoutes.post('/sendingRelation/deleteSendingRelation', sendingRelationController.deleteSendingRelation);
SendingRelationRoutes.post('/sendingRelation/deleteSendingRelationsById', sendingRelationController.deleteSendingRelationsById);

// g e t   s e n d i n g R e l a t i o n
SendingRelationRoutes.get('/sendingRelation/getSendingRelation', sendingRelationController.getSendingRelation);
SendingRelationRoutes.get('/sendingRelation/fetchSendingRelationsById', sendingRelationController.fetchSendingRelationsById);

export default SendingRelationRoutes;
