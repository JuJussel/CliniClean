//https://bezkoder.com/node-js-jwt-authentication-mysql/
const config = require("../../config/auth.config");
const User = require("../models/user.model.js");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.login = (req, res) => {
    console.log(req.body);
    User.findOne(req.body.username, (err, user) => {
        if (err) {
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
        let a = bcrypt.hashSync(req.body.password, 10);
        console.log(a);
        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );
    
        if (!passwordIsValid) {
            return res.status(401).send({
            accessToken: null,
            message: "Invalid!"
            });
        }
    
        var token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: config.lifetime
        });
    
        res.status(200).send({
            id: user.id,
            username: user.username,
            firstName: user.name_first,
            lastName: user.name_last,
            accessToken: token
        });

    })
};