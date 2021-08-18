const Config = require("../models/config.model.js");

// Find a single Customer with a customerId
exports.findAll = (req, res) => {

  Config.find({}, '-_id', (err, configs) => {
    if (err) {
      $logger.error(err);
      res.status(500).send({message: "Error retrieving Configuration"})
    }
    
    res.send(configs[0]);
  });
}