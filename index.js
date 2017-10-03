
const Koa = require('koa');
const body = require('koa-body');
const authRouter = require('routes/auth.router');
 const app = new Koa();

  app.use(body());
 app.use(authRouter.routes());

var port = process.env.PORT || 3000;
app.listen(port);



console.log('Listening to %s', port);
