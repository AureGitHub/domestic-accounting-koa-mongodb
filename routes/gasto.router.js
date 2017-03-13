
const logger = require('logger');
const Router = require('koa-router');
const mongoose = require('mongoose');

const GastoModel = require('models/gasto.model');




class GastoRouter {
    static async get(ctx) {
        logger.info('Obtaining all  gastos');
        ctx.body = await GastoModel.find();
    }
    static async getById(ctx) {
        logger.info(`Obtaining  gasto with id ${ctx.params.id}`);
        const gasto = await GastoModel.findById(ctx.params.id);
        if (!gasto) {
            ctx.throw(404, 'gasto not found');
            return;
        }
        ctx.body = gasto;
    }
    static async create(ctx) {
        logger.info(`Creating new  gasto  with body ${ctx.request.body}`);
        ctx.body = await new GastoModel(ctx.request.body).save();
    }
    static async update(ctx) {
        logger.info(`Updating gasto with id ${ctx.params.id}`);
        let gasto = await GastoModel.findById(ctx.params.id);
        if (!gasto) {
            ctx.throw(404, 'gasto not found');
            return;
        }
        gasto = Object.assign(gasto, ctx.request.body);
        ctx.body = await gasto.save();
    }
    static async delete(ctx) {
      logger.info(`Deleting tipo de gasto with id ${ctx.params.id}`);
        const numDeleted = await GastoModel.remove({_id: mongoose.Types.ObjectId(ctx.params.id)});
        logger.debug('Elementos eliminados', numDeleted);
        if (numDeleted.result.ok <= 0) {
            ctx.throw(404, ' gasto not found');
            return;
        }
        ctx.body = numDeleted.result;
    }
}

const router = new Router({
    prefix: '/gasto'
});


router.get('/', GastoRouter.get);
router.get('/:id', GastoRouter.getById);
router.post('/',  GastoRouter.create);
router.put('/:id', GastoRouter.update);
router.delete('/:id', GastoRouter.delete);

module.exports = router;