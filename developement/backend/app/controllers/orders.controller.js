const Order = require("../models/order.model.js");

exports.findAll = (req,res) => {
  Order.find({ status: 1})
  .populate({
    path: 'requester',
    select: ["nameFirst","nameLast"]
  })
  .exec(
    (err, orders) => {
      if(err) {
        $logger.error(err)
        res.status(500).send({
          message: "Error creating Encounters"
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
  Order.findOneAndUpdate(
    { _id: req.params.orderId }, 
    req.body,
    { runValidators: true },
    function(err) {
      if(err) {
        $logger.error(err)
        res.status(500).send({
          message: "Error updating Order"
        });
      }
      const Encounter = require("../models/encounter.model.js");
      Encounter.findOneAndUpdate(
        {_id: req.body.encounterId, "karte.procedures.order.id": req.params.orderId},
        {
          "karte.procedures.$.order.locked": req.body.locked,
          "karte.procedures.$.order.done": req.body.status === 0 ? true : false
        },
        function(err) {
          if(err) {
            $logger.error(err)
            res.status(500).send({
              message: "Error updating Order"
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
      );        
    })
}

exports.delete = (req,res) => {
  
  Order.deleteOne({ _id: req.params.orderId}, function (err) {
      if (err) {
          $logger.error(err);
          res.status(500).send({
              message: "Error deleting Order",
          });
      }
      res.send({ok: true});
  });
}