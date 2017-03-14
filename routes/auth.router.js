const Router = require('koa-router');
const passport = require('koa-passport');
const logger = require('logger');
const UserModel = require('models/user.model');
//const bcrypt = require('bcrypt');

const router = new Router({
    prefix: '/auth'
});

class AuthRouter {


    static async showSignUp(ctx) {
        await ctx.render('pages/sign-up.ejs');
    }

    static async showLogin(ctx) {
        await ctx.render('pages/login.ejs', { fail: false });
    }

    static async createUser(ctx) {
        const salt = 'await bcrypt.genSalt()';
        const password = ctx.request.body.password;//await bcrypt.hash(ctx.request.body.password, salt);

        await new UserModel({
            email: ctx.request.body.email,
            provider: 'local',
            salt,
            password
        }).save();
        ctx.redirect('/auth/login');
    }

    static async success(ctx) {
        await ctx.render('pages/index.ejs');
    }

    static async fail(ctx) {
        await ctx.render('pages/login.ejs', { fail: true });
    }

     static async logout(ctx) {
         await ctx.logout();
         await ctx.render('pages/login.ejs');
        
    }

     static async showError(ctx) {
        
         await ctx.render('pages/error.ejs');
        
    }

  


}

router.post('/sign-up', AuthRouter.createUser);
router.get('/sign-up', AuthRouter.showSignUp);
router.get('/login', AuthRouter.showLogin);
router.get('/logout', AuthRouter.logout);
router.get('/error', AuthRouter.showError);
router.post('/login', passport.authenticate('local', {
    successRedirect: '/auth/success',
    failureRedirect: '/auth/fail'
}));

router.get('/success', AuthRouter.success);
router.get('/fail', AuthRouter.fail);

module.exports = router;

