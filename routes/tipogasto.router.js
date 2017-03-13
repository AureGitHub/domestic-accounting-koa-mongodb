
const logger = require('logger');
const Router = require('koa-router');
const mongoose = require('mongoose');

const TipoGastoModel = require('models/tipo-gasto.model');




class TipoGastoRouter { 

    static async showget(ctx) {
        logger.info('Obtaining all tipos de gastos');
         let lstTipogasto = await TipoGastoModel.find();

        await ctx.render('tiposGastos/ListaTiposGastos.ejs', { lista: lstTipogasto });

    }
    static async showgetById(ctx) {
        logger.info(`Obtaining tipo de gasto with id ${ctx.params.id}`);
        const tipogasto = await TipoGastoModel.findById(ctx.params.id);
        if (!tipogasto) {
            await ctx.render('tiposGastos/TipoGasto.ejs', { NoFound: true });            
            return;
        }
         await ctx.render('tiposGastos/TipoGasto.ejs', {NoFound: false, item: tipogasto });
    }
    static async create(ctx) {
        logger.info(`Creating new tipo de gasto  with body ${ctx.request.body}`);
        ctx.body = await new TipoGastoModel(ctx.request.body).save();
    }
    static async update(ctx) {
        logger.info(`Updating tipo de gasto with id ${ctx.request.body.id}`);
        let tipogasto = await TipoGastoModel.findById(ctx.request.body.id);
        if (!tipogasto) {
            await ctx.render('tiposGastos/TipoGasto.ejs', { NoFound: true });   
            return;
        }
        //tipogasto._doc.descripcion = ctx.request.body.descripcion;
        tipogasto = Object.assign(tipogasto, ctx.request.body);
        await tipogasto.save();
         ctx.redirect('/tipogasto');



    }
    static async delete(ctx) {
      logger.info(`Deleting tipo de gasto with id ${ctx.params.id}`);
        const numDeleted = await TipoGastoModel.remove({_id: mongoose.Types.ObjectId(ctx.params.id)});
        logger.debug('Elementos eliminados', numDeleted);
        if (numDeleted.result.ok <= 0) {
            ctx.throw(404, 'tipo de gasto not found');
            return;
        }
        ctx.body = numDeleted.result;
    }
}

const router = new Router({
    prefix: '/tipogasto'
});


router.get('/', TipoGastoRouter.showget);
router.get('/:id', TipoGastoRouter.showgetById);
router.post('/',  TipoGastoRouter.create);
router.post('/:id', TipoGastoRouter.update);
router.delete('/:id', TipoGastoRouter.delete);

module.exports = router;