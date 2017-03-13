
const logger = require('logger');
const Router = require('koa-router');
const mongoose = require('mongoose');

const TipoGastoModel = require('models/tipo-gasto.model');




class TipoGastoRouter {

    static async showget(ctx) {
        logger.info('Obtaining all tipos de gastos');
        let lstTipogasto = await TipoGastoModel.find();

        await ctx.render('pages/TiposGastos/ListaTiposGastos.ejs', { lista: lstTipogasto });

    }
    static async showEdit(ctx) {
        logger.info(`Obtaining tipo de gasto with id ${ctx.params.id}`);
        const tipogasto = await TipoGastoModel.findById(ctx.params.id);
        if (!tipogasto) {
            let newTipoGasto = new TipoGastoModel();
            await ctx.render('pages/TiposGastos/TipoGasto.ejs', { NoFound: true, item: newTipoGasto });
            return;
        }
        await ctx.render('pages/TiposGastos/TipoGasto.ejs', { NoFound: false, item: tipogasto });
    }

    static async showNew(ctx) {
        let newTipoGasto = new TipoGastoModel();
        await ctx.render('pages/TiposGastos/TipoGasto.ejs', { NoFound: true, item: newTipoGasto });
        return;

    }
    static async create(ctx) {
        logger.info(`Creating new tipo de gasto  with body ${ctx.request.body}`);
        await new TipoGastoModel(ctx.request.body).save();
        ctx.redirect('/tipogasto');
    }
    static async update(ctx) {
        logger.info(`Updating tipo de gasto with id ${ctx.request.body.id}`);
        let tipogasto = await TipoGastoModel.findById(ctx.request.body.id);
        if (!tipogasto) {
            await ctx.render('pages/TiposGastos/TipoGasto.ejs', { NoFound: true });
            return;
        }
        //tipogasto._doc.descripcion = ctx.request.body.descripcion;
        tipogasto = Object.assign(tipogasto, ctx.request.body);
        await tipogasto.save();
        await ctx.redirect('/tipogasto');



    }
    static async delete(ctx) {
        logger.info(`Deleting tipo de gasto with id ${ctx.params.id}`);
        const numDeleted = await TipoGastoModel.remove({ _id: mongoose.Types.ObjectId(ctx.params.id) });
        logger.debug('Elementos eliminados', numDeleted);
        if (numDeleted.result.ok <= 0) {
            ctx.throw(404, 'tipo de gasto not found');
            return;
        }
        await ctx.redirect('/tipogasto');

    }
}

const router = new Router({
    prefix: '/tipogasto'
});


router.get('/', TipoGastoRouter.showget);
router.get('/edit/:id', TipoGastoRouter.showEdit);
router.get('/new/', TipoGastoRouter.showNew);
router.post('/create/', TipoGastoRouter.create);
router.post('/update/', TipoGastoRouter.update);
router.get('/delete/:id', TipoGastoRouter.delete);

module.exports = router;