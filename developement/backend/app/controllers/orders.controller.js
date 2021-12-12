const Order = require("../models/order.model.js");
const Encounter = require("../models/encounter.model.js");
const Notification = require("../models/notification.model.js");
const Vital = require("../models/vital.model.js");

exports.findAll = (req,res) => {
  Order.find({ status: 1})
  .populate({
    path: 'requester',
    select: ["nameFirst","nameLast"]
  })
  .populate({
    path: 'patient',
    select: 'name'
  })
  .exec(
    (err, orders) => {
      if(err) {
        $logger.error(err)
        res.status(500).send({
          message: "Error getting orders"
        });
      }
      res.send(orders);
    }
  )
}

exports.create = (req,res) => {
    Order.create( req.body, function(err,order) {
      if(err) {
        $logger.error(err)
        res.status(500).send({
          message: "Error creating Order"
        });
      }
      res.send(order);
    })
}

exports.update = async (req,res) => {


  // Update Order
  try {
    await Order.findOneAndUpdate(
      { _id: req.params.orderId }, 
      req.body,
      { runValidators: true }
    );
  } catch (err) {
    $logger.error(err)
    res.status(500).send({
      message: "Error updating Order"
    });
  }

  //Create Vitals if Health Check
  if (req.body.procedure.cat.code === 90) {
    let vitals = Object.values(req.body.procedure.varData).filter(item => item.code);
    vitals = {
      patientId: req.body.patient.id,
      values: vitals
    }
    try {
      await Vital.create(vitals);
    } catch (err) {
      $logger.error(err);
      res.status(500).send({ message: "Error creating Vital" });
    }
    // Update karte with Schema info
    try {
      await Encounter.findOneAndUpdate(
        {_id: req.body.encounterId, "karte.procedures.order.id": req.params.orderId},
        {
          $push: {"karte.images": req.body.procedure.varData.xRay.schema}
        }
      )
    } catch (err) {
      $logger.error(err)
      res.status(500).send({ message: "Error updating Encounter" });
    }

  }

  // Update Karte
  try {
    await Encounter.findOneAndUpdate(
      {_id: req.body.encounterId, "karte.procedures.order.id": req.params.orderId},
      {
        "karte.procedures.$.order.locked": req.body.locked,
        "karte.procedures.$.order.done": req.body.status === 0 ? true : false,
        "karte.procedures.$.varData": req.body.procedure.varData || null,
        "karte.procedures.$.comment": req.body.procedure.comment || ''
      }
    )
  } catch (err) {
    $logger.error(err)
    res.status(500).send({ message: "Error updating Encounter" });
  }

  // Create Notification
  if ((req.body.procedure.cat.code === 90 || req.body.procedure.cat.code === 60) && req.body.status < 1) {
    try {
      await Notification.create(
        {
          sender: req.userId,
          recepients: [{user: req.body.requester.id, read: false}],
          content: {
            meta: {
              type: "examResultsAvailable",
              orderId: req.body.id
            },
            text: ""
          }
        }
      )
    } catch (err) {
      $logger.error(err)
      res.status(500).send({
        message: "Error creating Notifications"
      });
    }
  }

  // Send Web Socket
  $wss.broadcast({
    event: "updateOrder",
    data: {
      encounterId: req.body.encounterId,
      id: req.body.id,
      locked: req.body.locked,
      done: req.body.status === 0 ? true : false
    }
  });
  $wss.broadcast({ event: "updateEncounter", encounterId: req.body.encounterId });

  res.send({ok: true});
}

exports.delete = (req,res) => {
  Order.deleteOne({ _id: req.params.orderId})
  .then(() => {
    res.send({ok: true});
  })
  .catch(err => {
    $logger.error(err);
    res.status(500).send({
        message: "Error deleting Order",
    });
  })
}