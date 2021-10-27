const Notification = require("../models/user.model.js");

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



exports.find = (req, res) => {

  Notification.find({userGroup: 2}, ['status', 'nameFirst', 'nameLast'], (err, doctor) => {
    if (err) {
      $logger.error(err);
      res.status(500).send({message: "Error retrieving Doctors"})
    }
    res.send(doctor);
  });
}


