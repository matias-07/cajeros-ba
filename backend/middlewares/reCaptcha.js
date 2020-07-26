const request = require("request");
const reCaptchaSecret = "6LeKN7YZAAAAAEF48bsqj70Zy58cQfLaTPyjm0oB";

module.exports = (req, res, next) => {
    request.post("https://www.google.com/recaptcha/api/siteverify", {
        form: {
            secret: reCaptchaSecret,
            response: req.query.captcha
        }
    }, (error, response, body) => {
        if (error || body["score"] < 0.4) {
            res.status(400).json({
                "error": "Falló la verificación de captcha"
            });
        } else {
            next();
        }
    });
};
