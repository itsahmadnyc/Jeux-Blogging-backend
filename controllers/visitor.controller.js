const { UserVisit } = require("../models");
const response  = require("../utils/responseHandler");


exports.trackVisitor = async (req, res) => {
  try {
    const { visitorId } = req.body;

    if (!visitorId) {
      return response.notFound(res, "Visitor ID is required!");
    }

    const ipAddress = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim();

    const visitData = {
      visitorId,
      ipAddress
    };

    await UserVisit.create(visitData);

    return response.ok(res, "Visit logged successfully!");
  } catch (error) {
    console.error("Error tracking visitor:", error);
    return response.internalServerError(res, "Server Error.! Failed to track visitor", { error: error.message });
  }
};

