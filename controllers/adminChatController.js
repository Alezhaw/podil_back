const ApiError = require('../error/ApiError');
const { User, AdminChat, MessageToAdmin } = require('../models/models')
const bcrypt = require('bcrypt')

class AdminChatController {
    async create(req, res, next) {
        const { nickname, email } = req.body
        if (!nickname || !email) {
            return next(ApiError.badRequest('Введите все данные'))
        }
        const user = await User.findOne({ where: { email: email } })
        if (!user) {
            return next(ApiError.badRequest('Пользователь не найден'))
        }

        const checkAdminChat = await AdminChat.findOne({ where: { email } })
        if (checkAdminChat) {
            return next(ApiError.badRequest('Чат уже существует'))
        }

        const adminChat = await AdminChat.create({ nickname, email, statusForUser: 1, newMessage: 1 })
        return res.json(adminChat)
    }

    async getAdminChats(req, res, next) {
        const { adminEmail, adminPassword } = req.body
        if (!adminEmail || !adminPassword) {
            return next(ApiError.badRequest('Введите все данные'))
        }
        const admin = await User.findOne({ where: { email: adminEmail } })
        if (!admin) {
            return next(ApiError.internal('Админ не найден'))
        }
        let comparePassword = bcrypt.compareSync(adminPassword, admin.password)
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'))
        }
        if (admin.role === 'USER') {
            return next(ApiError.badRequest('Нет доступа'))
        }
        const adminChats = await AdminChat.findAll()
        if (!adminChats) {
            return next(ApiError.internal('Чаты не найдены'))
        }
        return res.json(adminChats)
    }

    async updateAdminChats(req, res, next) {
        const { status, email, adminEmail, adminPassword } = req.body
        if (!status || !email || !adminEmail || !adminPassword) {
            return next(ApiError.badRequest('Введите все данные'))
        }
        const user = await User.findOne({ where: { email } })
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }
        const admin = await User.findOne({ where: { email: adminEmail } })
        if (!admin) {
            return next(ApiError.internal('Админ не найден'))
        }
        let comparePassword = bcrypt.compareSync(adminPassword, admin.password)
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'))
        }
        if (admin.role === 'USER') {
            return next(ApiError.badRequest('Нет доступа'))
        }
        let adminChat = await AdminChat.findOne({ where: { email } })
        if (!adminChat) {
            return next(ApiError.badRequest('Чат не найден'))
        }
        await AdminChat.update({ statusForUser: status }, { where: { id: adminChat.id } })
        if (status === 2) {
            await MessageToAdmin.update({ statusForUser: status }, { where: { chatId: adminChat.id } })
        }
        return 'success'
    }
    async updateAdminChatRate(req, res, next) {
        const { rate, email } = req.body
        if (!rate || !email) {
            return next(ApiError.badRequest('Введите все данные'))
        }
        const user = await User.findOne({ where: { email } })
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }
        let adminChat = await AdminChat.findOne({ where: { email } })
        if (!adminChat) {
            return next(ApiError.badRequest('Чат не найден'))
        }
        await AdminChat.update({ rate }, { where: { id: adminChat.id } })
        return res.json({ ...adminChat, rate })
    }

    async getOne(req, res, next) {
        const { email, password } = req.body
        if (!email || !password) {
            return next(ApiError.badRequest('Введите все данные'))
        }
        const user = await User.findOne({ where: { email } })
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'))
        }
        let adminChat = await AdminChat.findOne({ where: { email } })
        if (!adminChat) {
            return next(ApiError.badRequest('Чат не найден'))
        }
        return res.json(adminChat)
    }

    async deleteAdminChats(req, res, next) {
        const { id, adminEmail, adminPassword } = req.body
        const adminChat = await AdminChat.findOne({ where: { id } })
        if (!adminChat) {
            return next(ApiError.internal('Сделка не найдена'))
        }
        const creator = await User.findOne({ where: { email: adminEmail } })
        if (!creator) {
            return next(ApiError.internal('Админ не найден'))
        }
        let comparePassword = bcrypt.compareSync(adminPassword, creator.password)
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'))
        }
        if (creator.role !== 'ADMIN') {
            return next(ApiError.badRequest('Нет доступа'))
        }
        await AdminChat.destroy({
            where: { id }
        })
        await MessageToAdmin.destroy({
            where: { chatId: id }
        })
        return res.json(adminChat)
    }


}

module.exports = new AdminChatController()