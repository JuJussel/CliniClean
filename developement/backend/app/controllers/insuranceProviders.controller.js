// const InsuranceProvider = require("../models/insuranceProvider.model.js");
const Orca = require("../utils/orcaApi.util");

exports.findOne = (req,res) => {

  Orca.get.insuranceProvider(req.params.number, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err,
      });
    } else {
      res.send(data);
    }
  });


  // InsuranceProvider.findOne(hknum, (err, data) => {
  //   if (err) {
  //       res.status(500).send({
  //         message: err
  //       });
  //   } else {
  //     if (data) {
  //       res.send({name: data.seidoname});
  //     } else {
  //       res.send({name: ""});
  //     }
      
  //   }
  // })
}