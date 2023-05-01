const sequelize = require('../db')
const { DataTypes } = require('sequelize')

const SiteName = sequelize.define('site_name', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    siteName: { type: DataTypes.STRING, unique: true, },
    wallet: { type: DataTypes.STRING },
})

const Bases = sequelize.define('base', {
    id_for_base: { type: DataTypes.INTEGER },
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    base_id: { type: DataTypes.STRING, unique: true, },
    base_stat_1: { type: DataTypes.STRING },
    base_stat_2: { type: DataTypes.STRING },
    base_stat_3: { type: DataTypes.STRING },
    base_type: { type: DataTypes.STRING },
    base_sort: { type: DataTypes.STRING },
    base_sogl_1: { type: DataTypes.INTEGER },
    base_sogl_2: { type: DataTypes.INTEGER },
    base_sogl_3: { type: DataTypes.INTEGER },
    base_comment: { type: DataTypes.STRING },
})

const Cities = sequelize.define('city', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    l_p: { type: DataTypes.INTEGER },
    godzina: { type: DataTypes.STRING },
    os_poj: { type: DataTypes.STRING },
    pary: { type: DataTypes.STRING },
    wyjasnienia: { type: DataTypes.BOOLEAN },
    projekt: { type: DataTypes.STRING },
    miasto_lokal: { type: DataTypes.STRING },
    timezone: { type: DataTypes.INTEGER },
    limit: { type: DataTypes.INTEGER },
    dodawanie_rekordow: { type: DataTypes.STRING },
    scenariusze: { type: DataTypes.STRING },
    weryfikacja_dkj: { type: DataTypes.STRING },
    podpinanie_scenariuszy: { type: DataTypes.STRING },
    present: { type: DataTypes.STRING },
    rekodow_na_1_zgode: { type: DataTypes.INTEGER },
    wb_1: { type: DataTypes.STRING },
    wb_2: { type: DataTypes.INTEGER },
    ilosc_zaproszen: { type: DataTypes.INTEGER },
    dzien_1_data: { type: DataTypes.STRING },
    dzien_1_rekodow_na_1_zgode: { type: DataTypes.INTEGER },
    dzien_1_aktualna_ilosc_zaproszen: { type: DataTypes.INTEGER },
    dzien_2_data: { type: DataTypes.STRING },
    dzien_2_rekodow_na_1_zgode: { type: DataTypes.INTEGER },
    dzien_2_aktualna_ilosc_zaproszen: { type: DataTypes.INTEGER },
    dzien_3_data: { type: DataTypes.STRING },
    dzien_3_rekodow_na_1_zgode: { type: DataTypes.INTEGER },
    dzien_3_aktualna_ilosc_zaproszen: { type: DataTypes.INTEGER },
    vip_id: { type: DataTypes.STRING },
    vip_format: { type: DataTypes.STRING },
    vip_limit: { type: DataTypes.STRING },
    vip_coming: { type: DataTypes.STRING },
    vip_total_steam: { type: DataTypes.STRING },
    vip_percent_coming: { type: DataTypes.STRING },
    system: { type: DataTypes.STRING },
    zgoda_wyniki_potwierdzen: { type: DataTypes.INTEGER },
    odmowy_wyniki_potwierdzen: { type: DataTypes.INTEGER },
    kropki_wyniki_potwierdzen: { type: DataTypes.INTEGER },
    sms_umawianie: { type: DataTypes.BOOLEAN },
    sms_potwierdzen: { type: DataTypes.BOOLEAN },
    wiretap_note: { type: DataTypes.STRING },
    wiretapping_sogl: { type: DataTypes.STRING },
    base_stat_1: { type: DataTypes.STRING },
    base_stat_2: { type: DataTypes.STRING },
    base_stat_3: { type: DataTypes.STRING },
    base_stat_4: { type: DataTypes.STRING },
    base_stat_5: { type: DataTypes.STRING },
    id_for_base: { type: DataTypes.INTEGER },
    w_toku: { type: DataTypes.BOOLEAN },
    zamkniete: { type: DataTypes.BOOLEAN },
    base_stat_6: { type: DataTypes.STRING },
})

const TelegramUsers = sequelize.define('telegram_user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, },
    chatid: { type: DataTypes.STRING, unique: true, },
})

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true, },
    password: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: "USER" },
    score: { type: DataTypes.INTEGER, defaultValue: 0 },
    nickname: { type: DataTypes.STRING, unique: true },
    systemMessage: { type: DataTypes.STRING, defaultValue: "false" },
    checkRu: { type: DataTypes.STRING },
    minimumTransferAmount: { type: DataTypes.INTEGER },
    sumTransferAmoumt: { type: DataTypes.INTEGER },
    completed: { type: DataTypes.INTEGER },
})

const UserRefill = sequelize.define('userRefill', {
    id: { type: DataTypes.INTEGER },
    time: { type: DataTypes.STRING },
    score: { type: DataTypes.INTEGER },
    status: { type: DataTypes.INTEGER },
    userEmail: { type: DataTypes.STRING },
    uniqueId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userNickname: { type: DataTypes.STRING },
})

const UserTransfer = sequelize.define('user_transfers', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    paymantSystem: { type: DataTypes.STRING },
    walletNumber: { type: DataTypes.STRING },
    score: { type: DataTypes.INTEGER },
    time: { type: DataTypes.STRING },
    status: { type: DataTypes.INTEGER, defaultValue: 1 },
    userEmail: { type: DataTypes.STRING },
    userNickname: { type: DataTypes.STRING },
})

const UserTransferToUser = sequelize.define('user_transfer_to_users', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userEmail: { type: DataTypes.STRING },
    userNickname: { type: DataTypes.STRING },
    receiverEmail: { type: DataTypes.STRING },
    receiverNickname: { type: DataTypes.STRING },
    score: { type: DataTypes.INTEGER },
    time: { type: DataTypes.STRING },
    status: { type: DataTypes.INTEGER, defaultValue: 1 },
})

const Deal = sequelize.define('deal', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    buyer: { type: DataTypes.STRING },
    buyerNickname: { type: DataTypes.STRING },
    seller: { type: DataTypes.STRING },
    sellerNickname: { type: DataTypes.STRING },
    sum: { type: DataTypes.INTEGER },
    status: { type: DataTypes.INTEGER, defaultValue: 1 },
    description: { type: DataTypes.STRING },
    creator: { type: DataTypes.STRING },
})

const DealMessage = sequelize.define('deal_message', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nickname: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    message: { type: DataTypes.STRING },
    time: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING },
    dealId: { type: DataTypes.INTEGER },
})

const MessageToAdmin = sequelize.define('message_to_admin', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nickname: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    administratorName: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING },
    statusForUser: { type: DataTypes.INTEGER },
    time: { type: DataTypes.STRING },
    message: { type: DataTypes.STRING },
    image: { type: DataTypes.STRING },
    chatId: { type: DataTypes.INTEGER },
})

const AdminChat = sequelize.define('admin_chat', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nickname: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    statusForUser: { type: DataTypes.INTEGER },
    deleteChatTime: { type: DataTypes.STRING },
    rate: { type: DataTypes.INTEGER },
    newMessage: { type: DataTypes.INTEGER },
})

const Basket = sequelize.define('basket', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})

const BasketDevice = sequelize.define('basket_device', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})

const Device = sequelize.define('device', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    rating: { type: DataTypes.INTEGER, defaultValue: 0 },
    img: { type: DataTypes.STRING, allowNull: false },
})

const Type = sequelize.define('type', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
})

const Brand = sequelize.define('brand', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
})

const Rating = sequelize.define('rating', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rate: { type: DataTypes.INTEGER, allowNull: false },
})

const DeviceInfo = sequelize.define('device_info', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
})

const TypeBrand = sequelize.define('type_brand', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})

User.hasOne(Basket)
Basket.belongsTo(User)

User.hasOne(AdminChat)
AdminChat.belongsTo(User)

AdminChat.hasMany(MessageToAdmin)
MessageToAdmin.belongsTo(AdminChat)

User.hasMany(UserRefill)
UserRefill.belongsTo(User)

User.hasMany(UserTransfer)
UserTransfer.belongsTo(User)

User.hasMany(UserTransferToUser)
UserTransferToUser.belongsTo(User)

User.hasMany(Rating)
Rating.belongsTo(User)

Deal.hasOne(DealMessage)
DealMessage.belongsTo(Deal)

Basket.hasMany(BasketDevice)
BasketDevice.belongsTo(Basket)

Type.hasMany(Device)
Device.belongsTo(Type)

Brand.hasMany(Device)
Device.belongsTo(Brand)

Device.hasMany(Rating)
Rating.belongsTo(Device)

Device.hasMany(BasketDevice)
BasketDevice.belongsTo(Device)

Device.hasMany(DeviceInfo, { as: 'info' });
DeviceInfo.belongsTo(Device)

Type.belongsToMany(Brand, { through: TypeBrand })
Brand.belongsToMany(Type, { through: TypeBrand })

module.exports = {
    SiteName,
    User,
    UserRefill,
    UserTransfer,
    UserTransferToUser,
    Deal,
    DealMessage,
    MessageToAdmin,
    AdminChat,
    Basket,
    BasketDevice,
    Device,
    Type,
    Brand,
    Rating,
    TypeBrand,
    DeviceInfo,
    TelegramUsers,
    Bases,
    Cities,
}





