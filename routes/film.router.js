const logger = require('logger');
const Router = require('koa-router');
const FilmValidator = require('validators/film.validator');

const FilmModel = require('models/film.model');




class FilmRouter {
    static async get(ctx) {
        logger.info('Obtaining all films');
        ctx.body = await FilmModel.find();
    }
    static async getById(ctx) {
        logger.info(`Obtaining film with id ${ctx.params.id}`);
        const film = await FilmModel.findById(ctx.params.id);
        if (!film) {
            ctx.throw(404, 'Film not found');
            return;
        }
        ctx.body = film;
    }
    static async create(ctx) {
        logger.info(`Creating new film with body ${ctx.request.body}`);
        ctx.body = await new FilmModel(ctx.request.body).save();
    }
    static async update(ctx) {
        logger.info(`Updating film with id ${ctx.params.id}`);
        let film = await FilmModel.findById(ctx.params.id);
        if (!film) {
            ctx.throw(404, 'Film not found');
            return;
        }
        film = Object.assign(film, ctx.request.body);
        ctx.body = await film.save();
    }
    static async delete(ctx) {
        logger.info(`Deleting film with id ${ctx.params.id}`);
        const numDeleted = await FilmModel.delete({
            _id:
            mongoose.Types.ObjectId(ctx.params.id)
        });
        logger.debug('Elementos eliminados', numDeleted);
        if (numDeleted.result.ok <= 0) {
            ctx.throw(404, 'Film not found');
            return;
        }
        ctx.body = numDeleted.result;
    }
}

const router = new Router({
    prefix: '/film'
});


router.get('/', FilmRouter.get);
router.get('/:id', FilmValidator.validateId, FilmRouter.getById);
router.post('/', FilmValidator.validateCreate, FilmRouter.create);
router.put('/:id', FilmValidator.validateId, FilmValidator.validateCreate, FilmRouter.update);
router.delete('/:id', FilmValidator.validateId, FilmRouter.delete);

module.exports = router;