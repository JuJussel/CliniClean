const Config = require("../models/config.model.js");

exports.categories = {
  findOne: (req,res) => {
  
    Config.findOne({configName: 'listProcedureCategories'},{ '_id': 0, 'value': 1}, (err, occupation) => {
      if (err) {
        $logger.error(err);
        res.status(500).send({message: "Error retrieving Occupations"})
      }
      res.send(occupation.value);
    });  
  }
}
