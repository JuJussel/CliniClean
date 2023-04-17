const Patient = require("../models/patient.model.js");
const Vital = require("../models/vital.model.js");
const Encounter = require("../models/encounter.model.js");
const Order = require("../models/order.model.js");
const Orca = require("../utils/orcaApi.util");

// OLD OLD OLD OLD
// Remove
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
// Remove above

// NEW NEW NEW NEW NEW NEW NEW

exports.add = (req, res) => {
  // Get query
  let type = req.query.type || null

  // If no type is specified return error
  if (!type) {
    res.status(400).send({ message: "No type specified" })
    return
  }


  // Get request data
  let request = req.body;
  let patientId = req.params.patientId;

  // Catch special cases
  if (type === "vitals") {
    request.date = new Date
  }

  // Construct dynamic path
  let path = `medical.${type}`

  // Habits needs special case
  // Is replaced which each post, not added

  if (type === "habits") {
    Patient.findOneAndUpdate(
      { _id: patientId },
      { [path]: request },
      (err) => {
        if (err) {
          $logger.error(err);
          res.status(500).send({ message: "Error creating Item" });
          return
        }
      })
  }

  else {

    // For all other types
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

  }

  // Send final response
  res.send({ ok: true })
}


exports.get = async (req, res) => {

  // Get request data
  let patientId = req.params.patientId;

  // Get query
  let type = req.query.type || null

  //NEED TO CATCH SPECIAL CASES FOR ORCA DATA!!!!!!
  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // Diseases
  if (type === "diseases") {

    medicalData = "diseases"
    res.send({ ok: true, medicalData, type })
    return
  }

  // Build documents path
  let path = type ? [`medical.${type}`] : 'medical'

  // If no query get full data
  // If query get partial data
  try {

    let medicalData = await Patient.findOne({ _id: patientId }, [path])
    medicalData = type ? medicalData.toObject().medical?.[type] : medicalData.toObject().medical

    if (!medicalData) medicalData = {}

    if (path === "medical") {
      medicalData.encounters = await Encounter.find({ patient: patientId }) || [];
      medicalData.orders = await Order.find({ patientId: patientId }).sort({ date: -1 }) || [];
      medicalData.diseases = await Orca.get.diseases(patientId)
    }



    // Send final response
    res.send({ ok: true, medicalData, type })



  } catch (err) {
    $logger.error(err);
    res.status(500).send({ message: "Error getting Patient" });
  }





}

