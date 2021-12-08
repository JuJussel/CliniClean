const Notification = require("../models/notification.model.js");
const Order = require("../models/order.model");

exports.create = (req,res) => {

  Notification.create( req.body)
  .then(() => {
    res.send({ok: true});
  })
  .catch(err => {
    $logger.error(err)
    res.status(500).send({
      message: "Error creating Notifications"
    });
  })
}



exports.find = async (req, res) => {
  let user = req.userId;
  try {
    let notifications = await Notification.find({ "recepients.user": user });

    notifications = await Promise.all(notifications.map(async item => {
      item.recepients = item.recepients.filter(rec => rec.user == user);
      if (item.content?.meta?.type === "examResultsAvailable") {
        let order = await Order.findById(item.content.meta.orderId, ['patient', 'procedure.name'] )
        .populate({
          path: 'patient',
          select: 'name'
        })
        .exec();
        if (order) item.content.meta.order = order;
      }
      return item
    }))
    res.send(notifications);
  } catch (err) {
    $logger.error(err);
    res.status(500).send({message: "Error retrieving Notifications"})
  }
}

exports.update = (req, res) => {
  let read = req.body.read;
  let user = req.userId;
  let id = req.params.id

  Notification.findOneAndUpdate(

    { _id: id, "recepients.user": user},
    { 'recepients.$.read': read},
    (err) => {
      if (err) {
          $logger.error(err);
          res.status(500).send({
              message: "Error updating Notification",
          });
      }
      res.send({pk: true});
    }
  )
}