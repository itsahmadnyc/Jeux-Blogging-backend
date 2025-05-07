// controllers/newsletterController.js
const { Op } = require("sequelize");
const { User, Blog, Category } = require("../models");
const Subscriber = require("../models/Subscriber");
const { sendEmail } = require("../services/emailService");
const response = require("../utils/responseHandler");

exports.subscriber = async (req, res) => {
    try {
        const userId = req.user.id;
        const { email } = req.body;

        if (!email) {
            return response.notFound(res, "Valid Email is required");
        }

        if (!userId) {
            return response.notFound(res, "Token is missing or invalid");
        }

        const [subscriber, created] = await Subscriber.findOrCreate({ where: { email } });

        if (!created) {
            return response.badRequest(res, "Already subscribed");
        }
        await sendEmail(
            email,
            "Thanks for Subscribing to Jeux developers Newsletter!",
            "You will now receive updates whenever new blogs are published."
        );

        return response.ok(res, "Subscribed successfully and confirmation email sent");
    } catch (error) {
        console.error("Error in subscriber controller:", error);
        return response.internalServerError(res, "Subscription failed");
    }
};


