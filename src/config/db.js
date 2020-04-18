import mongoose from 'mongoose';
import config from './config';

export default () => {
  mongoose.Promise = global.Promise;
  mongoose.connect(config.DB_URL, { 
    useUnifiedTopology: true,
    useNewUrlParser: true 
  })
  .catch(err => console.error('Erreur initial connection', err));

  mongoose.set('debug', true);
  mongoose.connection
    .once('open', () => console.log('Mongodb running !!!'))
    .on('error', err => console.error('Erreur connection', err));
};