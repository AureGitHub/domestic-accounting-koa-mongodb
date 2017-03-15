const Koa = require('koa');




    const app = new Koa();
   
   
   app.use(async (ctx, next) => {
        ctx.body = 'My first middleware';
});

  
    app.listen(process.env.PORT || 3000, function (err) {
       
    });
