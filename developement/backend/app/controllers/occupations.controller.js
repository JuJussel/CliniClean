const Config = require("../models/config.model.js");

// Find a single Customer with a customerId
exports.findAll = (req, res) => {

  Config.findOne({configName: 'listOccupations'},{ '_id': 0, 'value': 1}, (err, occupation) => {
    if (err) {
      $logger.error(err);
      res.status(500).send({message: "Error retrieving Occupations"})
    }
    res.send(occupation.value);
  });
}