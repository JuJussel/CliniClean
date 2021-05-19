const Encounter = require("../models/encounter.model.js");

exports.findRange = (req, res) => {

  Encounter.findRange(req.query, (err, data) => {
    if (err) {
        res.status(500).send({
          message: "Error retrieving Encounters"
        });
    } else {
      res.send(data);
    }
  })
}

exports.findAll = (req,res) => {
  Encounter.findAll((err, data) => {
    if (err) {
        res.status(500).send({
          message: "Error retrieving Encounters"
        });
    } else {
      res.send(data);
    }
  })
}