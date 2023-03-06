const ApiError = require('../error/ApiError');
const { TelegramUsers, User } = require('../models/models')
const bcrypt = require('bcrypt')
const axios = require('axios');

class TelegramController {

    async sendMessage(chatid, text) {
        try {
            if (!chatid || !text) return console.log('Введите все данные')
            const botToken = '6116692347:AAGTOsJBqS0Jn59E6XHSlOilxmLYp4FJhug';
            const data = await axios.get(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatid}&text=${text}`);
            return data;
            //sendMessage?chat_id=497357018&text=Пососи
        } catch (e) {
            return console.log('Ошибка отправки')
        }
    };

    async create(req, res, next) {
        const { name, chatid, email, password } = req.body
        if (!name || !chatid || !email || !password) {
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
        if (user.role === 'USER') {
            return next(ApiError.badRequest('Нет доступа'))
        }
        const checkName = await TelegramUsers.findOne({ where: { name } })
        if (checkName?.name) {
            return next(ApiError.badRequest('Имя занято'))
        }
        const checkId = await TelegramUsers.findAll({ where: { chatid } })
        if (checkId?.chatid) {
            return next(ApiError.badRequest('chatid уже внесен'))
        }

        const userTransfertoUser = await TelegramUsers.create({ name, chatid })

        return res.json(userTransfertoUser)
    }

    async delete(req, res, next) {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
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
        if (user.role === 'USER') {
            return next(ApiError.badRequest('Нет доступа'))
        }
        const checkName = await TelegramUsers.findAll({ where: { name } })
        if (!checkName) {
            return next(ApiError.badRequest('Имя не найдено'))
        }


        const deletedUser = await TelegramUsers.destroy({
            where: { name }
        })

        return res.json(deletedUser)
    }

    async getAll(req, res, next) {
        const telegramUsers = await TelegramUsers.findAll()
        if (!res) return telegramUsers;
        return res.json({ telegramUsers })
    }

}

module.exports = new TelegramController()