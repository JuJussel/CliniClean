const Config = require("../models/config.model.js");
const Procedure = require("../models/procedure.model.js");

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

exports.search = {
  findMany: (req, res) => {
    let cat = req.params.cat;
    let search = req.params.search;
    Procedure.findMany(cat, search, (err, data) => {
      if (err) {
          res.status(500).send({
            message: err
          });
      } else {
        res.send(data);
      }
    })
  

  }
}

exports.favourites = {
  findMany: (req, res) => {

    let cat = req.params.cat;
    let search = req.params.search;


  }
}

