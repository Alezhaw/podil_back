const ApiError = require('../error/ApiError');
const {User, UserTransferToUser} = require('../models/models')
const bcrypt = require('bcrypt')

class UserTransferToUserController {
    async create(req, res, next) {
        const {score, time, userEmail, userNickname, receiverEmail, password} = req.body
        if (!score || !time || !userEmail || !userNickname || !receiverEmail || !password) {
            return next(ApiError.badRequest('Введите все данные'))
        }
        const receiver = await User.findOne({where: {email: receiverEmail}}) ||
         await User.findOne({where: {nickname: receiverEmail}})
        if(!receiver) {
            return next(ApiError.badRequest('Получатель не найден'))
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
        const userTransfertoUser = await UserTransferToUser.create({userEmail, userNickname, receiverEmail, receiverNickname: receiver.nickname ,score , time, status: 1})
        const updatedUser = await User.update({score: user.score - score}, {where: {id: user.id}})

        return res.json({userTransfertoUser: userTransfertoUser, user: {...user.dataValues, score: user.score - score, password: password}})
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
        const checkTransfer = await UserTransferToUser.findOne({where: {id}})
        if (!checkTransfer) {
            return next(ApiError.badRequest('Перевод не найден'))
        }

          const transfer = await UserTransferToUser.update({score, status}, {where: {id}})
           return res.json(transfer)
    }

    async getAll(req, res) {
        const transfers = await UserTransferToUser.findAll()
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
        const userTransfers = await UserTransferToUser.findAll({where: {userEmail: email}})
        if (!userTransfers) {
            return next(ApiError.internal('Переводы не найдены'))
        }
        return res.json(userTransfers)
    }

    async getOneTransfer(req, res, next) {
        const {id} = req.body

        const transferToUser = await UserTransferToUser.findOne({where: {id}})
        if (!transferToUser) {
            return next(ApiError.internal('Перевод не найден'))
        }
        return res.json(transferToUser)
    }

}

module.exports = new UserTransferToUserController()