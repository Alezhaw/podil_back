const ApiError = require("../../error/ApiError");
const Blazor = require("../../api/blazor.js");

const { instance } = Blazor;

class QueueController {
  async addCampaign(req, res, next) {
    try {
      const { campaignId, serverId, CampaignName, Date, LastAction } = req.body;
      if (!campaignId || !serverId || !CampaignName || !Date) {
        return next(ApiError.badRequest("Укажите все данные"));
      }
      const { data } = await instance.post("api/QueueItems/", { campaignId, serverId, scenarioId: -1, type: "mob", IsStoped: true, LastAction, CampaignName, Date });
      return res.json(data);
    } catch (e) {
      console.error(e);
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }
}
module.exports = new QueueController();
