const ApiError = require('../error/ApiError');
const {User, DealMessage, Deal} = require('../models/models')

class DealMessageController {
    async create(req, res, next) {
        const {dealId, nickname, email, message, time, role} = req.body
        if (!dealId || !nickname || !email || !message || !time || !role) {
            return next(ApiError.badRequest('Введите все данные'))
        }
        if (role !== 'ADMIN') {
            const user = await User.findOne({where: {email}})
            if (!user) {
                return next(ApiError.badRequest('Пользователь с таким email не найден'))
        }
        }
        const deal = await Deal.findOne({where: {id: dealId}})
        if (!deal) {
            return next(ApiError.badRequest('Сделка не найдена'))
        }

        const dealMessage = await DealMessage.create({dealId, nickname, email , message, time, role})
        if(!res) return;
        return res.json(dealMessage)
    }

    async getDealMessages(req, res, next) {
        const {dealId} = req.body
        if(!dealId) {
            return next(ApiError.badRequest('Введите все данные'))
        }
        const deal = await Deal.findOne({where: {id: dealId}})
        if (!deal) {
            return next(ApiError.internal('Сделка не найдена'))
        }
        const dealMessages = await DealMessage.findAll({where: {dealId}})
        if (!dealMessages) {
            return next(ApiError.internal('Сообщения не найдены'))
        }
        return res.json(dealMessages)
    }


}

module.exports = new DealMessageController()