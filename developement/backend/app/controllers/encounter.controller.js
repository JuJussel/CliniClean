const Encounter = require("../models/encounter.model.js");

// Find a single Customer with a customerId
exports.findOne = (req, res) => {
    User.findById(req.params.userId, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found User with id ${req.params.customerId}.`
            });
          } else {
            res.status(500).send({
              message: "Error retrieving User with id " + req.params.customerId
            });
          }
        } else {
          res.send(data);
        }
      });
};

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