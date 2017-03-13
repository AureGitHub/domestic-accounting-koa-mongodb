const logger = require('logger');
const Router = require('koa-router');
class HtmlRouter {
    static async home(ctx) {
        await ctx.render('index.ejs', {
            text: ctx.session.lastRequest || 'Empty'
        });
    }
}
const router = new Router({});
router.get('/', HtmlRouter.home);
module.exports = router;