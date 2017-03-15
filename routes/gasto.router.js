
const logger = require('logger');
const Router = require('koa-router');
const mongoose = require('mongoose');


const GastoModel = require('models/gasto.model');
const TipoGastoModel = require('models/tipo-gasto.model');
var dateFormat = require('dateformat');


class GastoRouter {
    static async showget(ctx) {
        logger.info('Obtaining all  gastos');
     /*   let lstGastos = await GastoModel.aggregate([
            {
            $lookup:
                {
                from: "tipogastos",
                localField: "IdTipoGesto",
                foreignField: "_id",
                as: "TipodeGasto"
                }
        },
        {
            $lookup:
                {
                from: "users",
                localField: "IdUser",
                foreignField: "_id",
                as: "Usuario"
                }
        }
        ]);*/

let lstGastos = await GastoModel.aggregate([
            { "$lookup": {
                "from": "tipogastos",
                "localField": "IdTipoGesto",
                "foreignField": "_id",
                "as": "TipodeGasto"
             }},
               { "$lookup": {
                "from": "users",
                "localField": "IdUser",
                "foreignField": "_id",
                "as": "Usuario"
             }}
        ]);


        

        lstGastos.forEach(function(item) {
           item.fecha = dateFormat(item.fecha,"dd/mm/yyyy");
        });

       

        await ctx.render('pages/Gastos/ListaGastos.ejs', { lista: lstGastos });
    }

 static async showNew(ctx) {
        let newGasto = new GastoModel();

        newGasto._doc.fecha = dateFormat(newGasto._doc.fecha,"yyyy-mm-dd");

        let lstTipogasto = await TipoGastoModel.find();
        await ctx.render('pages/Gastos/Gasto.ejs', {NoFound: true, item: newGasto, lstTipogasto:lstTipogasto });
        return;

    }

    static async showEdit(ctx) {
        logger.info(`Obtaining  gasto with id ${ctx.params.id}`);
         let lstTipogasto = await TipoGastoModel.find();
        const gasto = await GastoModel.findById(ctx.params.id);
        if (!gasto) {
            ctx.throw(404, 'gasto not found');
            return;
        }
        
        gasto._doc.fecha = dateFormat(gasto._doc.fecha,"yyyy-mm-dd");
        await ctx.render('pages/Gastos/Gasto.ejs', {NoFound: true, item: gasto, lstTipogasto:lstTipogasto });
    }
    static async create(ctx) {
        logger.info(`Creating new  gasto  with body ${ctx.request.body}`);
        await new GastoModel(ctx.request.body).save();
        ctx.redirect('/gastos');
    }
    static async update(ctx) {
        logger.info(`Updating gasto with id ${ctx.request.body.id}`);
        let gasto = await GastoModel.findById(ctx.request.body.id);
        if (!gasto) {
           await ctx.render('pages/Gastos/Gasto.ejs', { NoFound: true });
            return;
        }
        gasto = Object.assign(gasto, ctx.request.body);
        await gasto.save();
         await ctx.redirect('/gastos');

    }
    static async delete(ctx) {
      logger.info(`Deleting tipo de gasto with id ${ctx.params.id}`);
        const numDeleted = await GastoModel.remove({_id: mongoose.Types.ObjectId(ctx.params.id)});
        logger.debug('Elementos eliminados', numDeleted);
        if (numDeleted.result.ok <= 0) {
            ctx.throw(404, ' gasto not found');
            return;
        }
         await ctx.redirect('/gastos');
    }
}

const router = new Router({
    prefix: '/gastos'
});


router.get('/', GastoRouter.showget);
router.get('/edit/:id', GastoRouter.showEdit);
router.get('/new/', GastoRouter.showNew);
router.post('/create/',  GastoRouter.create);
router.post('/update/', GastoRouter.update);
router.get('/delete/:id', GastoRouter.delete);

module.exports = router;