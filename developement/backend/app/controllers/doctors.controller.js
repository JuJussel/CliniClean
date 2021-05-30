const Doctor = require("../models/doctor.model.js");

// Find a single Customer with a customerId
exports.findAll = (req, res) => {
    User.findall((err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found.`
            });
          } else {
            res.status(500).send({
              message: "Error retrieving Doctors"
            });s
          }
        } else {
          res.send(data);
        }
      });
};