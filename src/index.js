import express from 'express';
import dbConfig from './config/db';
import middlewaresConfig from './config/middlewares';
import SendingRelationRoutes from './modules/sendingRelations/sendingRelationRoutes';
import UserRoutes from './modules/users/userRoutes';

const app = express();

/**
 * Database
 */
dbConfig();

/**
 * Middlewares
 */
middlewaresConfig(app);

app.use('/api', [UserRoutes]);
app.use('/api', [SendingRelationRoutes]);

// our custom "verbose errors" setting
// which we can use in the templates
// via settings['verbose errors']
app.enable('verbose errors');

console.log('src/index: process.env', process.env);
const PORT = process.env.PORT || 3000;

app.listen(PORT, err => {
  if (err) {
    console.log(err);
  }
  else {
    console.log(`App listen to port: ${PORT}`);
    // print process.argv
    process.argv.forEach((val, index) => {
      console.log(`${index}: ${val}`);
    });
    console.log(`Current directory: ${process.cwd()}`);
    console.log('COMPUTERNAME=', process.env.COMPUTERNAME);
    console.log('NODE_ENV=', process.env.NODE_ENV);
    if (process.getegid) {
      console.log(`Current gid: ${process.getegid()}`);
    }
    if (process.geteuid) {
      console.log(`Current uid: ${process.geteuid()}`);
    }
    if (process.getgid) {
      console.log(`Current gid: ${process.getgid()}`);
    }
    if (process.getuid) {
      console.log(`Current uid: ${process.getuid()}`);
    }
    console.log(`This process is pid ${process.pid}`);
    console.log(`The parent process is pid ${process.ppid}`);
    console.log('version=', process.version);
    console.log('versions=', process.versions);
    console.log('release=', process.release);
  }
});