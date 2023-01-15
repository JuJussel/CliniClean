const Patient = require("../models/patient.model.js");
const Vital = require("../models/vital.model.js");
const Orca = require("../utils/orcaApi.util");

const addVital = function (req, res) {
  let request = req.body;

  Vital.create(request, (err) => {
    if (err) {
      $logger.error(err);
      res.status(500).send({ message: "Error creating Vital" });
      return
    }
    res.send({ ok: true });
  })
}

exports.editMedicalBasics = (req, res) => {

  let request = req.body;
  let patientId = req.params.patientId;

  Patient.findOneAndUpdate(
    { _id: patientId },
    {
      $set: request
    },
    (err) => {
      if (err) {
        $logger.error(err);
        res.status(500).send({ message: "Error updating Patient" });
      }
      res.send({ ok: true });

    }
  )
};

exports.editDiseases = (req, res) => {
  let request = req.body;

  Orca.post.diseases(request, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err,
      });
    } else {
      res.send({ ok: true });
    }
  });
};

exports.add = (req, res) => {
  // Get query
  let type = req.query.type || null

  // If no type is specified return error
  if (!type) {
    res.status(400).send({ message: "No type specified" })
    return
  }

  // Catch special cases
  if (type === "vitals") {
    addVital(req, res)
    return
  }

  // Get request data
  let request = req.body;
  let patientId = req.params.patientId;

  // Construct dynamic path
  let path = `medical.${type}`

  // Insert new Item
  Patient.findOneAndUpdate(
    { _id: patientId },
    {
      $push: { [path]: request }
    },
    (err) => {
      if (err) {
        $logger.error(err);
        res.status(500).send({ message: "Error creating Item" });
        return
      }
    })

  // Send final response
  res.send({ ok: true })
}

