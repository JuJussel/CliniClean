const Order = require("../models/order.model.js");

exports.findAll = (req,res) => {
  Order.find({ status: 1}, function(err, orders) {
    if(err) {
      $logger.error(err)
      res.status(500).send({
        message: "Error creating Encounters"
      });
    }
    res.send(orders);
  })
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
      res.send({ok: true});
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