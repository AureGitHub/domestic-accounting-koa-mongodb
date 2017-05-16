const Router = require('koa-router');
const passport = require('koa-passport');
const logger = require('logger');
const UserModel = require('models/user.model');
var jwt = require("jwt-simple");
//const bcrypt = require('bcrypt');

const router = new Router({
    prefix: '/auth'
});

class AuthRouter {

    static genToken(user) {
        var expires = AuthRouter.expiresIn(15); // Minutos de session


        var token = jwt.encode({
            exp: expires,
            user: user
        }, 'constants.JWT_SECRET');

        return {
            token: token,
            expires: expires,
            user: user
        };
    }

    static expiresIn(numMin) {
        var dateObj = new Date();
        return dateObj.setMinutes(dateObj.getMinutes() + numMin);
    }

    static async loginN(ctx) {
        logger.info(`LoginN `);

        let email = ctx.request.body.email;
        let password = ctx.request.body.password;
        
        let userFind = await UserModel.find({ "email": email, "password": password });

        if (userFind.length > 0) {
            ctx.body = {
                Security: AuthRouter.genToken(userFind)
            };
        }
        else {
            ctx.body = {
                Security: null
            };
        }






    }

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

router.post('/loginN', AuthRouter.loginN);

router.get('/logout', AuthRouter.logout);
router.get('/error', AuthRouter.showError);
router.post('/login', passport.authenticate('local', {
    successRedirect: '/auth/success',
    failureRedirect: '/auth/fail'
}));

router.get('/success', AuthRouter.success);
router.get('/fail', AuthRouter.fail);

module.exports = router;

