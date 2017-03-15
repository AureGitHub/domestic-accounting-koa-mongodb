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




    const app = new Koa();
   
   
   app.use(async (ctx, next) => {
        ctx.body = 'My first middleware';
});


    app.listen(process.env.PORT || 8080, function (err) {
       
    });
