const Encounter = require("../models/encounter.model.js");
const Orca = require("../utils/orcaApi.util");

exports.findRange = (req, res) => {
  let start = req.query.start;
  let end = req.query.end;
  Encounter.find({date: {$gte: start, $lt: end}})
  .populate('patient')
    .exec(
    
    function(err,encounter) {
    if (err) {
      $logger.error(err)
      res.status(500).send({
        message: "Error retrieving Encounters"
      });
    } else {
      res.send(encounter);
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
      patient: request.patient.id,
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

exports.edit = (req,res) => {

  let request = req.body;

  if(request.pushNotification) {
    $wss.broadcast({event: 'updateEncounter', data: request.id});
    delete request.pushNotification;
  }

  Orca.post.procedures(request, (err, data) => {

    





    Encounter.findOneAndUpdate(
  
      { _id: request.id }, request, {runValidators: true,}, (err) => {
          if (err) {
              $logger.error(err);
              res.status(500).send({ message: "Error saving Encounter" });
          }
          res.send({ ok: true });
      }
    );
  });

}
