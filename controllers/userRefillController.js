const ApiError = require('../error/ApiError');
const {User, UserRefill} = require('../models/models')
const bcrypt = require('bcrypt')

class UserRefillController {
    async create(req, res, next) {
        const {id, time, score, user, creatorEmail, creatorPassword} = req.body
        if (!id || !time || !score || !user || !creatorEmail) {
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
        const checkUser = await User.findOne({where: {email: user}}) || await User.findOne({where: {nickname: user}})
        if (!checkUser) {
            return next(ApiError.badRequest('Пользователь не найден'))
        }
        const userRefill = await UserRefill.create({id, time, score, status: 2, userEmail: checkUser.email, userNickname: checkUser.nickname})
        const userUpdate = await User.update({score: checkUser.score + score}, {where: {email: checkUser.email}})

        return res.json(userRefill)
    }

    async changeRefill(req, res, next) {
        const {id, time, score, status, uniqueId, userEmail, creatorEmail, creatorPassword} = req.body
        console.log(1, typeof score)
        if (!id || !time || typeof score !== 'number' || !status || !uniqueId || !userEmail || !creatorEmail || !creatorPassword) {
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
        const checkRefill = await UserRefill.findOne({where: {uniqueId}})
        if(!checkRefill){
            return next(ApiError.badRequest('Пополнение не найдено'))
        }
          const checkUser = await User.findOne({where: {email: userEmail}})
          if(!checkUser) {
            return next(ApiError.badRequest('Пользователь не найден'))
        }
            console.log(1, checkUser.score - checkRefill.score + score, checkUser.score, )
          const updatedUser = await User.update({score: checkUser.score - checkRefill.score + score}, {where: {email: userEmail}})
          const refill = await UserRefill.update({id, time, score, status}, {where: {uniqueId}})
           return res.json(refill)
    }

    async getAll(req, res) {
        const refills = await UserRefill.findAll()
        return res.json(refills)
    }

    async getUserRefill(req, res, next) {
        const {email} = req.body
        if(!email) {
            return next(ApiError.badRequest('Некорректный email'))
        }
        const user = await User.findOne({where: {email}})
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }
        const userRefills = await UserRefill.findAll({where: {userEmail: email}})
        if (!userRefills) {
            return next(ApiError.internal('Пополнения не найдены'))
        }
        return res.json(userRefills)
    }

    async getOneRefill(req, res, next) {
        const {id} = req.body

        const refill = await UserRefill.findOne({where: {id}})
        if (!refill) {
            return next(ApiError.internal('Пополнение не найдено'))
        }
        return res.json(refill)
    }

    async deleteRefill(req, res, next) {
        const {uniqueId, creatorEmail, creatorPassword} = req.body
        const refill = await UserRefill.findOne({where: {uniqueId}})
        if (!refill) {
            return next(ApiError.internal('Пополнение не найдено'))
        }
        const creator = await User.findOne({where: {email: creatorEmail}})
        if (!creator) {
            return next(ApiError.internal('Админ не найден'))
        }
        let comparePassword = bcrypt.compareSync(creatorPassword, creator.password)
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'))
        }
        if(creator.role !== 'ADMIN'){
            return next(ApiError.badRequest('Нет доступа'))
        }
            await UserRefill.destroy({
                where: {uniqueId}
            })
           return res.json({...refill.dataValues})
    }

}

module.exports = new UserRefillController()