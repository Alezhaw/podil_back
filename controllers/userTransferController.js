const ApiError = require('../error/ApiError');
const {User, UserTransfer} = require('../models/models')
const bcrypt = require('bcrypt')

class UserTransferController {
    async create(req, res, next) {
        const {paymantSystem, walletNumber, score, time, userEmail, userNickname, password} = req.body
        if (!paymantSystem || !walletNumber || !score || !time || !userEmail || !password || !userNickname) {
            return next(ApiError.badRequest('Введите все данные'))
        }
        const user = await User.findOne({where: {email: userEmail}})
        if (!user) {
            return next(ApiError.badRequest('Пользователь с таким email не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'))
        }
        if(user.score < score){
            return next(ApiError.internal('Недостаточно средств'))
        }

        const userTransfer = await UserTransfer.create({paymantSystem, walletNumber, score , time, status: 1, userEmail, userNickname})
        const updatedUser = await User.update({score: user.score - score}, {where: {id: user.id}})

        return res.json({userTransfer: userTransfer, user: {...user.dataValues, score: user.score - score,password: password}})
    }

    async changeTransfer(req, res, next) {
        const {id, score, status, creatorEmail, creatorPassword} = req.body
        if (!id || !score || !status || !creatorEmail || !creatorPassword) {
            return next(ApiError.badRequest('Введите все данные'))
        }
        const creator = await User.findOne({where: {email: creatorEmail}})
        if (!creator) {
            return next(ApiError.badRequest('Админ с таким email не найден'))
        }
        let comparePassword = bcrypt.compareSync(creatorPassword, creator.password)
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'))
        }
        if(creator.role === 'USER'){
            return next(ApiError.badRequest('Нет доступа'))
        }
        const checkTransfer = await UserTransfer.findOne({where: {id}})
        if (!checkTransfer) {
            return next(ApiError.badRequest('Перевод не найден'))
        }

          const transfer = await UserTransfer.update({score, status}, {where: {id}})
           return res.json(transfer)
    }

    async getAll(req, res) {
        const transfers = await UserTransfer.findAll()
        return res.json(transfers)
    }

    async getUserTransfers(req, res, next) {
        const {email} = req.body
        if(!email) {
            return next(ApiError.badRequest('Некорректный email'))
        }
        const user = await User.findOne({where: {email}})
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }
        const userTransfers = await UserTransfer.findAll({where: {userEmail: email}})
        if (!userTransfers) {
            return next(ApiError.internal('Переводы по реквизитам не найдены'))
        }
        return res.json(userTransfers)
    }

    async getOneTransfer(req, res, next) {
        const {id} = req.body

        const transfer = await UserTransfer.findOne({where: {id}})
        if (!transfer) {
            return next(ApiError.internal('Перевод не найден'))
        }
        return res.json(transfer)
    }

}

module.exports = new UserTransferController()