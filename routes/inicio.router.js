const logger = require('logger');
const Router = require('koa-router');
class InicioRouter {
    static async home(ctx) {
        await ctx.render('pages/index.ejs', {
            text: ctx.session.lastRequest || 'Empty'
        });
    }

     static async about(ctx) {
        await ctx.render('pages/about.ejs', {
            text: ctx.session.lastRequest || 'Empty'
        });
    }
}
const router = new Router({});
router.get('/', InicioRouter.home);
router.get('/about', InicioRouter.about);
module.exports = router;