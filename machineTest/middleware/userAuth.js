const jwt = require('jsonwebtoken');
const userModel = require("../models/users");

module.exports = {
    userVerify: async (req, res, next) => {
        try {

            let token = req.headers.authorization;
            if (!token) {
                return res.status(200).send({ code: 413, success: true, error: false, message: "Token not found." });
            }
            let decode = jwt.decode(token, "frw38d4ef7qh174ms");
            var user = await userModel.findOne({ _id: decode._id })
            if (!user) {
                return res.status(200).send({ code: 413, success: true, error: false, message: "Invalid Token." });
            }
            req.user = user
            next();
        } catch (error) {
            console.log(error);
            return res.status(500).send({ code: 500, success: false, error: true, message: "Something wents wrong" });
        }
    }
}