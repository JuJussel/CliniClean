const Patient = require("../models/patient.model.js");
const Orca = require("../utils/orcaApi.util");

exports.editMedicalBasics = (req,res) => {
  
    let request = req.body;
    let patientId = req.params.patientId;
  
    Patient.findOneAndUpdate(
      {_id: patientId},
      {
        $set: request
      },
      (err) => {
        if (err) {
          $logger.error(err);
          res.status(500).send({ message: "Error updating Patient" });
        }
        res.send({ok: true});
  
      }
    )
  }
  
  exports.addMedicalVitals = (req,res) => {
    let request = req.body;
    let patientId = req.params.patientId;
  
    Patient.findOneAndUpdate(
      {_id: patientId},
      {
        $set: request
      },
      (err) => {
        if (err) {
          $logger.error(err);
          res.status(500).send({ message: "Error updating Patient" });
        }
        res.send({ok: true});
  
      }
    )
  }