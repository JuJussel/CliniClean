const Files = require("../models/file.model.js");

// Find a single Customer with a customerId
exports.findMany = (req, res) => {

  Files.find({ _id: { $in: req.body } }, (err, doctor) => {
    if (err) {
      $logger.error(err);
      res.status(500).send({ message: "Error retrieving Doctors" })
    }
    res.send(doctor);
  });
}