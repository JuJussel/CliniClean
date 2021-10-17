const Encounter = require("../models/encounter.model.js");
const Orca = require("../utils/orcaApi.util");
const Doctor = require("../models/user.model")

exports.findOne = (req, res) => {

  let encounterId = req.params.encounterId;

  Encounter.findById(encounterId)
  .populate({
    path: 'patient',
    select: 'name'
  })
  .exec(
    (err, data) => {
      if (err) {
        $logger.error(err)
        res.status(500).send({
          message: "Error retrieving Encounter"
        });
      } else {
        res.send(data);
      }
    })
}

exports.findRange = (req, res) => {
  let start = req.query.start;
  let end = req.query.end;
  Encounter.find({date: {$gte: start, $lt: end}}, '-karte -editHistory -baseCost')
  .populate({
    path: 'patient',
    select: 'name'
    })
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

exports.edit = async (req,res) => {

  let request = req.body;

  if(request.closeEncounter) {

    delete request.closeEncounter;

    let orcaResult = await Orca.post.procedures(request);
    if (orcaResult.err) {
        res.status(500).send({
            message: orcaResult.err,
        });
        return;
    }
    Doctor.findOneAndUpdate(
      { _id: request.doctor},
      { status: 1},
      (err) => {
        if (err) {
            $logger.error(err);
            res.status(500).send({
                message: "Error updating Doctor Status",
            });
        }
      }
    )
  }
  
  Encounter.findOneAndUpdate(
      { _id: request.id },
      request,
      { runValidators: true },
      (err) => {
          if (err) {
              $logger.error(err);
              res.status(500).send({
                  message: "Error saving Encounter",
              });
          }
          $wss.broadcast({
              event: "updateEncounter",
              data: request.id,
          });
          res.send({ ok: true });
      }
  );


}
