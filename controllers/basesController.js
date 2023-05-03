const ApiError = require('../error/ApiError');
const { Bases } = require('../models/models')

class BasesController {
    async create(req, res, next) {
        const { data } = req.body
        let update = ''
        let notIdForBase = ''
        let error = []
        let bases = []
        const forPostman = [{ ...req.body }]
        console.log(1, data, req.body)
        const result = await Promise.all(data.map(async (item, index) => {
            const checkUnique = await Bases.findOne({ where: { base_id: item.base_id } })
            if (checkUnique) {
                try {
                    await Bases.update({
                        id_for_base: Number(item.id_for_base),
                        base_id: item.base_id || null,
                        base_stat_1: item.base_stat_1 || null,
                        base_stat_2: item.base_stat_2 || null,
                        base_stat_3: item.base_stat_3 || null,
                        base_type: item.base_type || null,
                        base_sort: item.base_sort || null,
                        base_sogl_1: Number(item.base_sogl_1) || null,
                        base_sogl_2: Number(item.base_sogl_2) || null,
                        base_sogl_3: Number(item.base_sogl_3) || null,
                        base_comment: item.base_comment || null
                    }, { where: { id: checkUnique.id } })
                    update = `${update}/${item.base_id}`
                    return;
                } catch (e) {
                    return error.push({
                        base_id: item.base_id,
                        error: e.message,
                    })
                }
            }
            if (!item.id_for_base) {
                notIdForBase = `${notIdForBase}/${item.base_id}`
                return;
            }
            try {
                const base = await Bases.create({
                    id_for_base: Number(item.id_for_base),
                    base_id: item.base_id || null,
                    base_stat_1: item.base_stat_1 || null,
                    base_stat_2: item.base_stat_2 || null,
                    base_stat_3: item.base_stat_3 || null,
                    base_type: item.base_type || null,
                    base_sort: item.base_sort || null,
                    base_sogl_1: Number(item.base_sogl_1) || null,
                    base_sogl_2: Number(item.base_sogl_2) || null,
                    base_sogl_3: Number(item.base_sogl_3) || null,
                    base_comment: item.base_comment || null
                })
                bases.push(base.dataValues)
            } catch (e) {
                return error.push({
                    base_id: item.base_id,
                    error: e.message,
                })
            }
        }))
        return res.json({
            bases,
            update,
            notIdForBase,
            error,
        })
    }

    async getAll(req, res) {
        const bases = await Bases.findAll()
        return res.json(bases)
    }

    async getOneBase(req, res, next) {
        const { id, base_id } = req.body

        if (!id && !base_id) {
            return next(ApiError.badRequest('Укажите id или base_id'))
        }
        const base = await Bases.findOne({ where: { id: Number(id) || 0 } }) || await Bases.findOne({ where: { base_id: base_id } })
        if (!base) {
            return next(ApiError.internal('База не найдена'))
        }
        return res.json(base)
    }

    async getBasesForCity(req, res, next) {
        const { id_for_base } = req.body

        if (!id_for_base) {
            return next(ApiError.badRequest('Укажите id_for_base'))
        }
        const bases = await Bases.findAll({ where: { id_for_base: Number(id_for_base) } })
        if (!bases) {
            return next(ApiError.internal('Базы не найдены'))
        }
        return res.json(bases)
    }

    async changeBase(req, res, next) {
        const { id_for_base, id, base_id, base_stat_1, base_stat_2, base_stat_3, base_type, base_sort, base_sogl_1, base_sogl_2, base_sogl_3, base_comment } = req.body

        if (!id && !base_id) {
            return next(ApiError.badRequest('Укажите id или base_id'))
        }
        const base = await Bases.findOne({ where: { id: Number(id) } }) || await Bases.findOne({ where: { base_id: base_id } })
        if (!base) {
            return next(ApiError.internal('База не найдена'))
        }
        const updatedBase = await Bases.update({
            id_for_base: Number(id_for_base),
            base_id: base_id || null,
            base_stat_1: base_stat_1 || null,
            base_stat_2: base_stat_2 || null,
            base_stat_3: base_stat_3 || null,
            base_type: base_type || null,
            base_sort: base_sort || null,
            base_sogl_1: Number(base_sogl_1) || null,
            base_sogl_2: Number(base_sogl_2) || null,
            base_sogl_3: Number(base_sogl_3) || null,
            base_comment: base_comment || null,
        }, { where: { id: base.id } })

        return res.json(updatedBase)
    }

    async deleteBase(req, res, next) {
        const { id, base_id } = req.body
        if (!id && !base_id) {
            return next(ApiError.badRequest('Укажите id или base_id'))
        }
        const base = await Bases.findOne({ where: { id: Number(id) } }) || await Bases.findOne({ where: { base_id: base_id } })
        if (!base) {
            return next(ApiError.internal('База не найдена'))
        }
        await Bases.destroy({
            where: { id: base.id }
        })
        return res.json({ ...base.dataValues })
    }

}

module.exports = new BasesController()