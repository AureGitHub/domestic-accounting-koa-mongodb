
const logger = require('logger');
const Router = require('koa-router');
const mongoose = require('mongoose');

const TipoGastoModel = require('models/tipo-gasto.model');




class TipoGastoRouter {

    static async get(ctx) {

        // for(let i=0; i<100000;i++){
        //      await new TipoGastoModel({descripcion : 'descripcion_' + i.toString()}).save();
        // }

        logger.info('Obtaining all tipos de gastos');
        let lstTipogasto = await TipoGastoModel.find().skip(parseInt(ctx.query.$skip)).limit(parseInt(ctx.query.$top));
        let total = await TipoGastoModel.find().count();

        if (!lstTipogasto) {
            ctx.throw(404, 'No hay tipos de gastos');
            return;
        }
        ctx.body = {
            //value : lstTipogasto.slice(parseInt(ctx.query.$skip), parseInt(ctx.query.$skip) + parseInt(ctx.query.$top)),
            value: lstTipogasto,
            total: total
        };

    }


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
    static async deleteNodes(ctx) {
        logger.info(`Deleting tipo de gasto with id ${ctx.params.id}`);
        const numDeleted = await TipoGastoModel.remove({ _id: mongoose.Types.ObjectId(ctx.params.id) });
        logger.debug('Elementos eliminados', numDeleted);
        if (numDeleted.result.ok <= 0) {
            ctx.throw(404, 'tipo de gasto not found');
            return;
        }
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
        ctx.body = {
            ok: 1
        };

    }
}

const router = new Router({
    prefix: '/tipogasto'
});

router.get('/get/', TipoGastoRouter.get);
router.get('/', TipoGastoRouter.showget);
router.get('/edit/:id', TipoGastoRouter.showEdit);
router.get('/new/', TipoGastoRouter.showNew);
router.post('/create/', TipoGastoRouter.create);
router.post('/update/', TipoGastoRouter.update);
router.get('/delete/:id', TipoGastoRouter.deleteNodes);

router.get('/deleteN/:id', TipoGastoRouter.delete);

module.exports = router;