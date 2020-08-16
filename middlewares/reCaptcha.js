const request = require("request");
const reCaptchaSecret = process.env.RECAPTCHA_SECRET;

module.exports = (req, res, next) => {
    if (!reCaptchaSecret) {
        return next();
    }
    request.post("https://www.google.com/recaptcha/api/siteverify", {
        form: {
            secret: reCaptchaSecret,
            response: req.query.captcha
        }
    }, (error, response, body) => {
        if (error || body["score"] < 0.4) {
            res.status(400).json({
                captcha: "Falló la verificación de captcha"
            });
        } else {
            next();
        }
    });
};
