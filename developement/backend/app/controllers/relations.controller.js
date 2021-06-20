const Config = require("../models/config.model.js");

// Find a single Customer with a customerId
exports.findAll = (req, res) => {

  Config.findOne({configName: 'listRelations'},{ '_id': 0, 'value': 1}, (err, relation) => {
    if (err) {
      $logger.error(err);
      res.status(500).send({message: "Error retrieving relations"})
    }
    res.send(relation.value);
  });
}