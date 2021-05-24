const Patient = require("../models/patient.model.js")
const Orca = require("../middleware/orcaApi.middleware")

// Find a single Customer with a customerId
exports.findMany = (req, res) => {
  Patient.findMany(req.query, (err, data) => {
    if (err) {
      res.status(500).send({
        message: "Error retrieving Patient",
      });
    } else {
      res.send(data);
    }
  });
};

exports.insuranceSets = (req, res) => {
  Orca.get.insuranceSets(req.params.patientID, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err,
      });
    } else {
      // Bullshit start
      // Orca has the habit to return an Object if one element is present, but return an array if multiple items are found..
      // Need to loop and make sure both are arrays
      data.forEach((element, index) => {
        if (element.PublicInsurance_Information) {
          if (Array.isArray(element.PublicInsurance_Information.PublicInsurance_Information_child)) {
            data[index].PublicInsurance_Information = element.PublicInsurance_Information.PublicInsurance_Information_child
          } else {
            data[index].PublicInsurance_Information = [element.PublicInsurance_Information.PublicInsurance_Information_child]
          }
        }
      });
      //Bullshit end
      
      res.send(data);
    }

  })
}

exports.insurances = (req, res) => {
  Orca.get.insuranceSets(req.params.patientID, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err,
      });
    } else {
      res.send(data);
    }

  })
}
