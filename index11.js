
const Koa = require('koa');


 const app = new Koa();

app.use(async (ctx, next) => {
console.log(`The request url is ${ctx.url}`);
ctx.body = 'My first middleware';
});

var port = process.env.PORT || 3000;
app.listen(port);



console.log('Listening to %s', port);
