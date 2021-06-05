//https://bezkoder.com/node-js-jwt-authentication-mysql/
const config = require("../../config/auth.config");
const User = require("../models/user.model.js");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.login = (req, res) => {

    let username = req.body.username

    User.findOne({username: username}, (err, user) => {

        if (err) {
            $logger.error(err);
            if (err.kind === 'not_found') {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid!"
                    });
            }
            return res.status(500).send({ message: err.message });
        }

        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }

        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );
        delete req.body.password
        
        if (!passwordIsValid) {
            $logger.error({'InvalidPassword': req})
            return res.status(401).send({
                accessToken: null,
                message: "Invalid!"
            });
        }
    
        var token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: config.lifetime
        });
    
        var now = new Date();
        now.setTime(now.getTime() + (config.lifetime * 1000));

        res
        .status(200)
        .cookie('token', token, {
            expires: now,
            secure: true,
            httpOnly: true
        })
        .send({
            id: user.id,
            username: user.username,
            nameFirst: user.nameFirst,
            nameLast: user.nameLast
        });

    })
};
exports.check = (req,res) => {
    res.status(200).send({tokenOk: true})
}
exports.logout = (req, res) => {
    res
    .status(200)
    .clearCookie("token", {
        secure: true,
        httpOnly: true
    })
    .end();

}