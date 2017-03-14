require('app-module-path').addPath(__dirname);
const Koa = require('koa');
const koaLogger = require('koa-logger');
const logger = require('logger');
const body = require('koa-body');
const mount = require('koa-mount');
const validate = require('koa-validate');
const views = require('koa-views');
const convert = require('koa-convert');
const session = require('koa-generic-session');
const mongoose = require('mongoose');
const passport = require('koa-passport');


const authRouter = require('routes/auth.router');
const inicioRouter = require('routes/inicio.router');

const gastoRouter = require('routes/gasto.router');
const tipoGastoRouter = require('routes/tipogasto.router');
const mongoUri = 'mongodb://localhost:27017/domestic-accounting';
const error = require('koa-error');



const onDBReady = (err) => {
    if (err) {
        logger.error('Error connecting', err);
        throw new Error('Error connecting', err);
    }

    const app = new Koa();
    if (process.env.NODE_ENV === 'dev') {
        app.use(koaLogger());
    }

    
     app.use(error({
      template: __dirname + '/views/pages/error.ejs',
      engine: 'ejs'
    }));


app.on('error', (err, ctx) =>
{
    logger.error('server error', err);
    
}
 
);



    app.keys = ['claveSuperSecreta'];

    var CONFIG = {
        key: 'koa:sess',
        /** (string) cookie key (default is koa:sess) */
        maxAge: 86400000,
        /** (number) maxAge in ms (default is 1 days) */
        overwrite: true,
        /** (boolean) can overwrite or not (default true) */
        httpOnly: true,
        /** (boolean) httpOnly or not (default true) */
        signed: true,
        /** (boolean) signed or not (default true) */
    };


    validate(app);

    app.use(body());
    app.use(convert(session(CONFIG, app)));


    app.use(async (ctx, next) => {
        logger.info(`Last request was ${ctx.session.lastRequest}`);
        ctx.session.lastRequest = new Date();
        await next();
    });

    app.use(views(__dirname + '/views', {
        map: {
            ejs: 'ejs'
        }
    }));


   app.use(function *(next) {
    this.state.title = 'My App';
    this.state.email = 'me@myapp.com';
    yield next;
});

  
    //Registramos passport

    require('services/auth.service');

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(authRouter.routes());

    //lo pongo aki para que no pase autenticacion
  

    app.use(async (ctx, next) => {
        if (!ctx.isAuthenticated()) {
            ctx.redirect('/auth/login');
            return;
        }
        await next();
    });
    
    app.use(inicioRouter.routes());
    app.use(tipoGastoRouter.routes());
    app.use(gastoRouter.routes());
    


    //app.use(mount('/api/v1', filmRouter.routes()));
   

    app.listen(3000, function (err) {
        if (err) {
            logger.error('Error listening in port 3000', err);
            process.exit(1);
        }
        logger.info('Koa server listening in port 3000');
    });
}

mongoose.connect(mongoUri, onDBReady);