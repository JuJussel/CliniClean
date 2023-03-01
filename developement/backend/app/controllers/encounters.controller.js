const Encounter = require("../models/encounter.model.js");
const Orca = require("../utils/orcaApi.util");
const Doctor = require("../models/user.model");
const Settings = require("../models/setting.model");
const Order = require("../models/order.model");

exports.findOne = (req, res) => {

  let encounterId = req.params.encounterId;

  Encounter.findById(encounterId)
    .populate({
      path: 'patient',
      select: 'name'
    })
    .populate({
      path: 'karte.images'
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
  let start = new Date(req.query.start);
  let end = new Date(req.query.end);
  Encounter.find({ date: { $gte: start, $lt: end } }, '-karte -editHistory -baseCost')
    .populate({
      path: 'patient',
      select: 'name birthdate'
    })
    .exec(

      function (err, encounter) {
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

exports.create = async (req, res) => {

  let request = req.body;
  let status = 2;
  let date = new Date;

  if (request.date && request.time) {
    date = request.date + ' ' + request.time
    date = new Date(date)
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


  try {
    var encounter = await Encounter.create(request);
  } catch (err) {
    $logger.error(err)
    res.status(500).send({
      message: "Error creating Encounters"
    });
    return;
  }

  // If Kenshoushindan
  if (request.type === 6) {
    try {
      let customProceduresDb = await Settings.find({}, 'customProcedures');
      let customProceduresJson = JSON.parse(JSON.stringify(customProceduresDb[0]));
      var healthCheck = customProceduresJson?.customProcedures?.public?.find(item => item.cat.label === 'healthCheck')
      if (!healthCheck) {
        res.status(500).send({
          message: "No Custom Health Check Code found",
        });
        return;
      }
      request.karte = {
        procedures: [healthCheck]
      };

    } catch (err) {
      $logger.error(err);
      res.status(500).send({
        message: "Cannot get HealthCheck Code",
      });
      return;
    }
    try {
      let order = {
        encounterId: encounter._id,
        patient: request.patient,
        procedure: healthCheck,
        requester: req.userId
      }
      let orderDb = await Order.create(order);
      request.karte.procedures[0].order = {
        id: JSON.parse(JSON.stringify(orderDb)).id,
        done: false,
        locked: true
      };
    }
    catch (err) {
      $logger.error(err);
      res.status(500).send({
        message: "Cannot create Healt Check Order",
      });
      return;
    }

    try {
      await Encounter.findOneAndUpdate({ _id: encounter._id }, request);
    } catch (err) {
      $logger.error(err);
      res.status(500).send({
        message: "Error saving Encounter",
      });
      return;
    }
  }

  $wss.broadcast({ event: "updateEncounter", encounterId: encounter._id });
  res.send(encounter);

}

exports.edit = async (req, res) => {

  let request = req.body;

  if (request.closeEncounter) {

    delete request.closeEncounter;

    let orcaResult = await Orca.post.procedures(request);
    if (orcaResult.err) {
      res.status(500).send({
        message: orcaResult.err,
      });
      return;
    }
    Doctor.findOneAndUpdate(
      { _id: request.doctor },
      { status: 1 },
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
  Encounter.updateOne(
    { _id: req.params.encounterId },
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
