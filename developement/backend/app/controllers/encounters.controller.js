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
    let date = Date.now()

    if (request.date && request.time) {
      date = request.date + ' ' + request.time
      status = 1
    }

    request = {
      patientId: request.patient.id,
      type: request.encouterType,
      date: date,
      ins: request.insurance?.Insurance_Combination_Number ? request.insurance.Insurance_Combination_Number : null,
      note: request.note,
      status: status
    }

    Encounter.create( request, function(err,encounter) {
      if(err) {
        $logger.error(err)
        res.status(500).send({
          message: "Error creating Encounters"
        });
      }
      res.send(encounter);
    })
}

// exports.create = (req,res) => {

//   let request = req.body
//   let status = 2
//   let date = moment().format('YYYY-MM-DD HH:mm:ss')

//   if (request.date && request.time) {
//     date = request.date + ' ' + request.time
//     status = 1
//   }

//   request = {
//     id: request.patient.id,
//     type: request.encouterType,
//     date: date,
//     ins: request.insurance?.Insurance_Combination_Number ? request.insurance.Insurance_Combination_Number : null,
//     memo: request.note !== '' ? request.note : null,
//     status: status
//   }
  
//   Encounter.create(request, (err, result) => {
//     if (err) {
//         res.status(500).send({
//           message: "Error creating Encounters"
//         });
//     } else {
//       res.send(result);
//     }
//   })
// }