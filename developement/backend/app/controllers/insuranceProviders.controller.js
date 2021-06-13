const InsuranceProvider = require("../models/insuranceProvider.model.js");

exports.findOne = (req,res) => {

  let hknum = req.params.number.substr(0,2);
  InsuranceProvider.findOne(hknum, (err, data) => {
    if (err) {
        res.status(500).send({
          message: err
        });
    } else {
      res.send({name: data.seidoname});
    }
  })
}