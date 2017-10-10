
const Koa = require('koa');
const body = require('koa-body');
const authRouter = require('./routes/auth.router');


var cors = require('koa-cors');

const mongoose = require('mongoose');
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/domestic-accounting';

 const app = new Koa();
 
 if (process.env.NODE_ENV === 'dev') {
    
    }
    

 const onDBReady = (err) => {
    if (err) {
        logger.error('Error connecting', err);
        throw new Error('Error connecting', err);
    }

    app.use(cors());  
    app.use(body()); 
    app.use(authRouter.routes());
    var port = process.env.PORT || 3000;
    app.listen(port);
    console.log('Listening to %s', port);



}

mongoose.connect(mongoUri, onDBReady);
 
