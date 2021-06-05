const Patient = require("../models/patient.model.js");
const Orca = require("../utils/orcaApi.util");

// Find a single Customer with a customerId
exports.findMany = (req, res) => {
  let name = req.query.id;
  let id = isNaN(parseInt(name)) ? null : name;
  Patient.find(
    {
      $or: [{ _id: id }, { name: new RegExp("^" + name, "i") }],
    },
    (err, patient) => {
      if (err) {
        $logger.error(err);
        res.status(500).send({message: "Error retrieving Doctors"})
      }
      res.send(patient);
    }
  );
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
          if (
            Array.isArray(
              element.PublicInsurance_Information
                .PublicInsurance_Information_child
            )
          ) {
            data[index].PublicInsurance_Information =
              element.PublicInsurance_Information.PublicInsurance_Information_child;
          } else {
            data[index].PublicInsurance_Information = [
              element.PublicInsurance_Information
                .PublicInsurance_Information_child,
            ];
          }
        }
      });
      //Bullshit end

      res.send(data);
    }
  });
};

exports.insurances = (req, res) => {
  Orca.get.insuranceSets(req.params.patientID, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err,
      });
    } else {
      res.send(data);
    }
  });
};
