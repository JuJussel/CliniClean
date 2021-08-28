const Setting = require("../models/setting.model.js");

// Find a single Customer with a customerId
exports.findClinicInfoPublic = (req, res) => {
    Setting.find({}, "-clinicBaseInfo.private", (err, settings) => {
        if (err) {
            $logger.error(err);
            res.status(500).send({ message: "Error retrieving Configuration" });
        }

        result = JSON.parse(JSON.stringify(settings));
        result = result[0]?.clinicBaseInfo?.public ? result[0].clinicBaseInfo.public : [];

        res.send(result);
    });
};