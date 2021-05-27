const Encounter = require("../models/encounter.model.js");
const moment = require("moment");

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
  let status = 2
  let date = moment().format('YYYY-MM-DD HH:mm:ss')

  if (request.date && request.time) {
    date = request.date + ' ' + request.time
    status = 1
  }

  console.log(date);

  request = {
    id: request.patient.id,
    type: request.encouterType,
    date: date,
    ins: request.insurance?.Insurance_Combination_Number ? request.insurance.Insurance_Combination_Number : null,
    memo: request.note !== '' ? request.note : null,
    status: status
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