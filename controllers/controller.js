const ApiError = require('../error/ApiError');
const { User, Deal, Bases } = require('../models/models')
const bcrypt = require('bcrypt')

class DealController {
    async create(req, res, next) {
        const { name, buyer, buyerNickname, seller, sellerNickname, sum, description, creator } = req.body
        if (!name || (!buyer && !buyerNickname) || (!seller && !sellerNickname) || !sum || !description || !creator) {
            return next(ApiError.badRequest('Введите все данные'))
        }
        const checkBuyer = await User.findOne({ where: { email: buyer } }) || await User.findOne({ where: { nickname: buyer } })
        const checkSeller = await User.findOne({ where: { email: seller } }) || await User.findOne({ where: { nickname: seller } })
        const checkCreator = await User.findOne({ where: { email: creator } })
        if (!checkBuyer || !checkSeller || !checkCreator) {
            return next(ApiError.badRequest('Покупатель или продавец не найден'))
        }

        const deal = await Deal.create({
            name,
            buyer: checkBuyer.email,
            seller: checkSeller.email,
            sum,
            status: 1,
            description,
            buyerNickname: checkBuyer.nickname,
            sellerNickname: checkSeller.nickname,
            creator
        })
        return res.json(deal)
    }

    async getAll(req, res) {
        const deals = await Deal.findAll()
        return res.json(deals)
    }

    async getUserDeal(req, res, next) {
        const { email, password } = req.body
        if (!email || !password) {
            return next(ApiError.badRequest('Некорректный email или password'))
        }
        const user = await User.findOne({ where: { email } })
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'))
        }
        const dealBuyer = await Deal.findAll({ where: { buyer: email } })
        const dealSeller = await Deal.findAll({ where: { seller: email } })
        const deals = (dealBuyer && dealSeller) ? [...dealBuyer, ...dealSeller] :
            dealBuyer ? dealBuyer : dealSeller
        if (!deals) {
            return next(ApiError.internal('Сделки не найдены'))
        }
        return res.json(deals)
    }

    async getOneDeal(req, res, next) {
        const { id } = req.body

        const deal = await Deal.findOne({ where: { id } })
        if (!deal) {
            return next(ApiError.internal('Сделка не найдена'))
        }
        return res.json(deal)
    }

    async changeDeal(req, res, next) {
        const { id, name, sum, status, description, creatorEmail, creatorPassword } = req.body

        if (!id || !name || !sum || !status || !description || !creatorEmail || !creatorPassword) {
            return next(ApiError.badRequest('Введите все данные'))
        }
        const creator = await User.findOne({ where: { email: creatorEmail } })
        if (!creator) {
            return next(ApiError.internal('Админ не найден'))
        }
        let comparePassword = bcrypt.compareSync(creatorPassword, creator.password)
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'))
        }
        if (creator.role === 'USER') {
            return next(ApiError.badRequest('Нет доступа'))
        }
        const deal = await Deal.findOne({ where: { id } })
        if (!deal) {
            return next(ApiError.internal('Сделка не найдена'))
        }
        const updatedDeal = await Deal.update({ name, sum, status, description }, { where: { id } })

        return res.json(updatedDeal)
    }

    async changeDealStatus(req, res, next) {
        const { id, status, email, password } = req.body

        if (!id || !status || !email || !password) {
            return next(ApiError.badRequest('Введите все данные'))
        }
        const creator = await User.findOne({ where: { email: email } })
        if (!creator) {
            return next(ApiError.internal('Пользователь не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, creator.password)
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'))
        }
        const deal = await Deal.findOne({ where: { id } })
        if (!deal) {
            return next(ApiError.internal('Сделка не найдена'))
        }
        if (!(deal.status + 1 === status) && status !== 5) {
            return next(ApiError.internal('Неверный статус'))
        }
        const updatedDeal = await Deal.update({ status }, { where: { id } })

        return res.json({ ...updatedDeal, status })
    }

    async deleteDeals(req, res, next) {
        const { id, creatorEmail, creatorPassword } = req.body
        const deal = await Deal.findOne({ where: { id } })
        if (!deal) {
            return next(ApiError.internal('Сделка не найдена'))
        }
        const creator = await User.findOne({ where: { email: creatorEmail } })
        if (!creator) {
            return next(ApiError.internal('Админ не найден'))
        }
        let comparePassword = bcrypt.compareSync(creatorPassword, creator.password)
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'))
        }
        if (creator.role !== 'ADMIN') {
            return next(ApiError.badRequest('Нет доступа'))
        }
        await Deal.destroy({
            where: { id }
        })
        return res.json({ ...deal.dataValues })
    }

}

module.exports = new DealController()