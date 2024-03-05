const { GillieProfile } = require("../../models/trails/gillieProfileModels");

class GillieProfileService {
  async create(profile) {
    return await GillieProfile.create({ ...profile });
  }

  async update(profile) {
    return await GillieProfile.update({ ...profile }, { where: { id: profile.id } });
  }

  async delete(id) {
    return await GillieProfile.destroy({
      where: { id },
    });
  }

  async remove(relevance_status, id) {
    return await GillieProfile.update({ relevance_status }, { where: { id } });
  }

  async getAll() {
    return await GillieProfile.findAll({
      where: { relevance_status: true },
      order: [["id", "ASC"]],
    });
  }

  async getByWhere(where) {
    return await GillieProfile.findAll({ where });
  }

  async getById(id) {
    return await GillieProfile.findOne({ where: { id } });
  }

  async getByIds(where) {
    return await GillieProfile.findAll({ where });
  }
}

module.exports = new GillieProfileService();
