const Doctor = require("../models/user.model.js");

// Find a single Customer with a customerId
exports.findAll = (req, res) => {

  Doctor.find(null, ['status', 'nameFirst', 'nameLast'], (err, doctor) => {
    if (err) {
      $logger.error(err);
      res.status(500).send({message: "Error retrieving Doctors"})
    }
    res.send(doctor);
  });
}