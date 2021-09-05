const Setting = require("../models/setting.model.js");

// Find a single Customer with a customerId
exports.findPublic = (req, res) => {
    Setting.find({}, '-_id', (err, settings) => {
        if (err) {
            $logger.error(err);
            res.status(500).send({ message: "Error retrieving Configuration" });
        }

        result = JSON.parse(JSON.stringify(settings[0]));
        Object.values(result).forEach(value => delete value.private);
        // result.array.forEach(element => {
        //     delete element.private
        // });

        res.send(result);
    });
};



/.*(public).*/