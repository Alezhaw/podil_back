const ApiError = require('../error/ApiError');
const { User, MessageToAdmin, AdminChat } = require('../models/models')
const bcrypt = require('bcrypt')
const fs = require('fs')
const telegramController = require('./telegramController')

class MessageToAdminController {
    async create(req, res, next) {
        const { nickname, email, time, message, image } = req.body
        if (!nickname || !email || !time) {
            return console.log('Введите все данные')
        }
        const user = await User.findOne({ where: { email } })
        if (!user) {
            return console.log('Пользователь не найден')
        }
        let adminChat = await AdminChat.findOne({ where: { email } })
        if (!adminChat && nickname === 'location') {
            return console.log('Чат не создан')
        }
        if (!adminChat) {
            adminChat = await AdminChat.create({ nickname, email, statusForUser: 1, newMessage: 1 })
        }
        if (!adminChat) {
            return console.log('Ошибка создания чата')
        }
        if (nickname !== 'location') {
            await AdminChat.update({ statusForUser: 1, newMessage: 1 }, { where: { id: adminChat.id } })
        }
        const messageToAdmin = await MessageToAdmin.create({ nickname, email, role: 'USER', administratorName: '', message: message || '', time, statusForUser: 1, chatId: adminChat.id })
        if (!messageToAdmin) {
            return console.log('Ошибка отправки сообщение')
        }
        if (nickname !== 'location') {
            const users = await telegramController.getAll();
            if (users[0]) {
                await Promise.all(users?.map(async (item) => await telegramController.sendMessage(`${item.chatid}`, `${nickname}: ${message || 'Гондон отправил картинку(пока не обрабатываем)'}`)));
            }
        }
        if (image && image !== 'data:') {
            const result = await MessageToAdmin.update({ image }, { where: { id: messageToAdmin.id } })
            return { ...messageToAdmin.dataValues, image }
        }
        return messageToAdmin
    }

    async createForAdmin(req, res, next) {
        const { administratorName, time, message, id, adminEmail, adminPassword } = req.body
        if (!administratorName || !time || !message || !id || !adminEmail || !adminPassword) {
            return console.log('Введите все данные')
        }

        const admin = await User.findOne({ where: { email: adminEmail } })
        if (!admin) {
            return console.log('Админ не найден')
        }
        let comparePassword = bcrypt.compareSync(adminPassword, admin.password)
        if (!comparePassword) {
            return console.log('Указан неверный пароль')
        }
        if (admin.role === 'USER') {
            return console.log('Нет доступа')
        }
        let adminChat = await AdminChat.findOne({ where: { id } })
        if (!adminChat) {
            return console.log('Чат не найден')
        }
        await AdminChat.update({ statusForUser: 1, newMessage: 2 }, { where: { id: adminChat.id } })
        const messageToAdmin = await MessageToAdmin.create({ nickname: '', email: adminChat.email, role: 'ADMIN', administratorName, message, time, statusForUser: 1, chatId: adminChat.id })
        return messageToAdmin
    }

    async getMessagesToAdmin(req, res, next) {
        const { email } = req.body
        if (!email) {
            return next(ApiError.badRequest('Введите все данные'))
        }
        const user = await User.findOne({ where: { email } })
        if (!user) {
            return next(ApiError.badRequest('Пользователь не найден'))
        }
        let adminChat = await AdminChat.findOne({ where: { email } })
        if (!adminChat) {
            return next(ApiError.badRequest('Чат не найден'))
        }
        const messages = await MessageToAdmin.findAll({ where: { chatId: adminChat.id } })
        if (!messages) {
            return next(ApiError.internal('Сообщения не найдены'))
        }
        return res.json(messages)
    }


}

module.exports = new MessageToAdminController()