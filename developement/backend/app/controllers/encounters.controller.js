const Encounter = require("../models/encounter.model.js");

exports.findRange = (req, res) => {

  Encounter.findRange(req.query, (err, result) => {
    if (err) {
        res.status(500).send({
          message: "Error retrieving Encounters"
        });
    } else {
      res.send(result);
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

exports.create = (req,res) => {

  let request = req.body
  request = {
    id: request.patient.id,
    type: request.encouterType,
    ins: request.insurance.Insurance_Combination_Number,
    memo: request.note !== '' ? request.note : null
  }
  
  Encounter.create(request, (err, result) => {
    if (err) {
        res.status(500).send({
          message: "Error creating Encounters"
        });
    } else {
      res.send(result);
    }
  })
}