const Doctor = require("../models/doctor.model.js");

// Find a single Customer with a customerId
exports.findAll = (req, res) => {
  Doctor.findAll((err, data) => {
    if (err) {
        res.status(500).send({
          message: "Error retrieving Doctors"
      })
    } else {
      res.send(data);
    }
  });
};