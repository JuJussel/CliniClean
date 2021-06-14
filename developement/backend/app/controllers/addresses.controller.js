const Address = require("../models/address.model.js");

exports.findOne = (req,res) => {

  let zip = req.params.zip;
  Address.findOne(zip, (err, data) => {
    if (err) {
        res.status(500).send({
          message: err
        });
    } else {
      res.send({addr: data.editadrs_name});
    }
  })
}