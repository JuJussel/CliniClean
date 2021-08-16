const Order = require("../models/order.model.js");

exports.create = (req,res) => {
    Order.create( req.body, function(err,order) {
      if(err) {
        $logger.error(err)
        res.status(500).send({
          message: "Error creating Encounters"
        });
      }
      res.send(order);
    })
}

exports.delete = (req,res) => {
  
  Order.deleteOne({ _id: req.params.orderId}, function (err) {
      if (err) {
          $logger.error(err);
          res.status(500).send({
              message: "Error creating Encounters",
          });
      }
      res.send({ok: true});
  });
}