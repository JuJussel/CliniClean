const Order = require("../models/order.model.js");

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

exports.update = (req,res) => {

  const Encounter = require("../models/encounter.model.js");
  const Notification = require("../models/notification.model.js");

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


  try {
    await Encounter.findOneAndUpdate(
      {_id: req.body.encounterId, "karte.procedures.order.id": req.params.orderId},
      {
        "karte.procedures.$.order.locked": req.body.locked,
        "karte.procedures.$.order.done": req.body.status === 0 ? true : false,
        "karte.procedures.$.varData": req.body.procedure.var || null,
        "karte.procedures.$.comment": req.body.procedure.comment || ''
      }
    )
  } catch (err) {
    $logger.error(err)
    res.status(500).send({
      message: "Error updating Encounter"
    });
  } 


  try {
    await Notification.create(
      {
        sender: req.userId,
        recepients: [req.body.requester.id],
        content: {
          meta: req.body.id,
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


  $wss.broadcast({
    event: "updateOrder",
    data: {
      encounterId: req.body.encounterId,
      id: req.body.id,
      locked: req.body.locked,
      done: req.body.status === 0 ? true : false
    },
  });

  
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