require('app-module-path').addPath(__dirname );
const Koa = require('koa');
const koaLogger = require('koa-logger');
const logger = require('logger');
const body = require('koa-body');
const mount = require('koa-mount');
const validate = require('koa-validate');
const views = require('koa-views');
const convert = require('koa-convert');
const session = require('koa-generic-session');
const File = require('koa-generic-session-file');

const filmRouter = require('routes/film.router');
const htmlRouter = require('routes/html.router');


const app = new Koa();
if (process.env.NODE_ENV === 'dev') {
    app.use(koaLogger());
}

app.keys = ['claveSuperSecreta'];

var CONFIG = {
  key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
  maxAge: 86400000, /** (number) maxAge in ms (default is 1 days) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
};


validate(app);

app.use(body());
app.use(convert(session(CONFIG, app)));

/*
app.use(convert(session({
    store: new File({
        sessionDirectory: __dirname + '/sessions'
    })
})));
*/

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


app.use(htmlRouter.routes());
app.use(mount('/api/v1', filmRouter.routes()));

app.listen(3000, function (err) {
    if (err) {
        logger.error('Error listening in port 3000', err);
        process.exit(1);
    }
    logger.info('Koa server listening in port 3000');
});