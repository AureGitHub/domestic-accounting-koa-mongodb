
const Koa = require('koa');


 const app = new Koa();

app.use(async (ctx, next) => {
console.log(`The request url is ${ctx.url}`);
ctx.body = 'My first middleware';
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!');
});




