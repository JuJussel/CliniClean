const Patient = require("../models/patient.model.js");
const Orca = require("../utils/orcaApi.util");
const japUtils = require("japanese-string-utils");
const File = require("../models/file.model.js");
const Encounter = require("../models/encounter.model.js");
const Vital = require("../models/vital.model.js");
const Order = require("../models/order.model.js");
// const { relativeTimeRounding } = require("moment");
// const { isNull } = require("util");

//Shared Functions

const getOrcaPatientData = (id, result) => {
  Orca.get.patient(id, (err, data) => {
    if (err) {
      result(err, null);
    } else {
      let responseData = {
        id: parseInt(data.Patient_ID),
        name: data.WholeName,
        nameKana: data.WholeName_inKana,
        birthdate: data.BirthDate,
        gender: parseInt(data.Sex),
        householderName: data.HouseHolder_WholeName,
        relation: data.Relationship,
        occupation: data.Occupation,
        phone: data.CellularNumber,
        mail: data.EmailAddress,
        address: {
          zip: data.Home_Address_Information?.Address_ZipCode,
          addr: data.Home_Address_Information?.WholeAddress1,
        },
        company: {
          name: data.WorkPlace_Information?.WholeName,
          zip: data.WorkPlace_Information?.Address_ZipCode,
          addr: data.WorkPlace_Information?.WholeAddress1,
          phone: data.WorkPlace_Information?.PhoneNumber,
        },
        insurance: [
          data.HealthInsurance_Information?.HealthInsurance_Information_child
        ]
      }
      result(null, responseData);
    }
  });
}

// Exports

exports.findMany = (req, res) => {
  let name = req.query.query;
  let id = isNaN(parseInt(name)) ? null : name;
  name = japUtils.toFullwidth(name);
  Patient.find(
    {
      $or: [{ _id: id }, { name: new RegExp("^" + name, "i") }]
    },
    ['name', 'doctor', 'birthdate'],
    (err, patient) => {
      if (err) {
        $logger.error(err);
        res.status(500).send({ message: "Error retrieving Patients" });
      }
      res.send(patient);
    }
  );
};

exports.findPayments = (req, res) => {
  Orca.get.payments(req.params, (err, payments) => {
    if (err) {
      $logger.error(err);
      res.status(500).send({
        message: err,
      });
    } else {
      if (payments.Perform_Date) {
        payments = [payments];
      }
      res.send(payments);
    }
  })
};

exports.findEncounters = (req, res) => {

  let patientId = req.params.patientId;

  Encounter.find({ patient: patientId }, 'date type doctor payment')
    .exec(
      (err, data) => {
        if (err) {
          $logger.error(err)
          res.status(500).send({
            message: "Error retrieving Encounter"
          });
        } else {
          res.send(data);
        }
      })

}

exports.findOrders = (req, res) => {

  let patientId = req.params.patientId;

  Order.find({ patient: patientId })
    .exec(
      (err, data) => {
        if (err) {
          $logger.error(err)
          res.status(500).send({
            message: "Error retrieving Encounter"
          });
        } else {
          res.send(data);
        }
      })

}

exports.findOne = async (req, res) => {
  let id = req.params.patientId;

  try {
    let orcaData = await Orca.get.patientAsync(id)
    orcaData = {
      id: parseInt(orcaData.Patient_ID),
      name: orcaData.WholeName,
      nameKana: orcaData.WholeName_inKana,
      birthdate: orcaData.BirthDate,
      gender: parseInt(orcaData.Sex),
      householderName: orcaData.HouseHolder_WholeName,
      relation: orcaData.Relationship,
      occupation: orcaData.Occupation,
      phone: orcaData.CellularNumber,
      mail: orcaData.EmailAddress,
      address: {
        zip: orcaData.Home_Address_Information?.Address_ZipCode,
        addr: orcaData.Home_Address_Information?.WholeAddress1,
      },
      company: {
        name: orcaData.WorkPlace_Information?.WholeName,
        zip: orcaData.WorkPlace_Information?.Address_ZipCode,
        addr: orcaData.WorkPlace_Information?.WholeAddress1,
        phone: orcaData.WorkPlace_Information?.PhoneNumber,
      },
      insurance: [
        orcaData.HealthInsurance_Information?.HealthInsurance_Information_child
      ]
    }

    let files = await Patient.findById(id, 'files')
    files = JSON.parse(JSON.stringify(files))
    orcaData.files = files.files || []

    res.send(orcaData);

  } catch (err) {
    $logger.error(err);
    res.status(500).send({ message: "Error getting Patient" });
  }




};

exports.findInsuranceSets = (req, res) => {
  Orca.get.insuranceSets(req.params.patientID, (err, data) => {
    if (err) {
      $logger.error(err);
      res.status(500).send({
        message: err,
      });
    } else {
      // Bullshit start
      // Orca has the habit to return an Object if one element is present, but return an array if multiple items are found..
      // Need to loop and make sure both are arrays
      if (data.Insurance_Combination_Number) {
        data = [data];
      }
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

exports.findMedicalHistory = async (req, res) => {

  // Get Patient from Mongo
  // Get other stuff from Orca
  //// Diseases
  const id = req.params.patientId;

  try {
    let patientData = await Patient.findById(id).lean().exec();
    if (!patientData) res.status(500).send({ message: "Patient not found" });

    patientData.encounters = await Encounter.find({ patient: id }) || [];
    patientData.vitals = await Vital.find({ patientId: id }).sort({ date: -1 }) || [];
    patientData.orders = await Order.find({ patientId: id }).sort({ date: -1 }) || [];
    res.send(patientData);

    // getOrcaPatientData(id, (err, data) => {
    //   if (err) {
    //     $logger.error(err);
    //     res.status(500).send({
    //       message: err,
    //     });
    //   } else {
    //     patientData = Object.assign(data, patientData);

    //     // Welcome to callback hell ... this should really be done with await...
    //     Orca.get.diseases(req.params.patientId, (err, diseases) => {

    //       if (err) {
    //         res.status(500).send({
    //           message: err,
    //         });
    //       } else {
    //         // if (diseases.Api_Result === '21') {
    //         //   patientData.diseases = [];
    //         // } else {
    //         //   diseases = diseases.Disease_Information.Disease_Information_child;
    //         //   if (diseases.Department_Code) {
    //         //     diseases = [diseases];
    //         //   }
    //         //   patientData.diseases = diseases;
    //         // }
    //         patientData.diseases = diseases
    //         res.send(patientData);
    //       }
    //     });

    //   }
    // })

  } catch (err) {
    $logger.error(err);
    res.status(500).send({ message: "Error getting Patient" });
  }

};

exports.findDiseases = async (req, res) => {

  try {
    let diseases = await Orca.get.diseases(req.params.patientId)
    if (diseases.Api_Result === '21') {
      res.send([]);
    } else {
      res.send(diseases);
    }

  } catch (err) {
    res.status(500).send({
      message: err,
    });
  }

};

exports.create = async (req, res) => {
  const fs = require('fs');
  const envConfig = require("../../env");

  let request = req.body;

  let files = [];
  let fileIds = [];

  request.insurance.forEach(item => {
    files.push(...item.files);
  })

  for (let i = 0; i < files.length; i++) {

    let extension = files[i].name.split('.');
    extension = extension[extension.length - 1];
    files[i].extension = extension;

    try {

      let file = await File.create(files[i]);
      let base64Data = files[i].data.replace("data:", "").replace(/^.+,/, "");
      let filename = file._id + '.' + extension;
      fs.writeFile(envConfig.PROJECT_DIR + '/storage/' + filename, base64Data, 'base64', function (err) {
        if (err) {
          $logger.error(err);
        }
      });
      fileIds.push(file._id);
    } catch (err) {
      $logger.error(err);
      res.status(500).send({ message: "Error creating Patient" });
    }

  }

  request.files = fileIds;

  Orca.post.patient(request, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err,
      });
    } else {
      request._id = data;

      Patient.create(request, (err, patient) => {
        if (err) {
          $logger.error(err);
          res.status(500).send({ message: "Error creating Patient" });
        }
        res.send({ patientId: data });
      })
    }
  });

};

exports.edit = async (req, res) => {
  const envConfig = require("../../env");

  let request = req.body;
  request.edit = true;

  Orca.post.patient(request, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err,
      });
    } else {

      Patient.findOneAndUpdate(
        { _id: request.id },
        {
          $set: {
            name: request.name,
            birthdate: request.birthdate
          },
        },
        {
          runValidators: true
        },
        (err) => {
          if (err) {
            $logger.error(err);
            res.status(500).send({ message: "Error creating Patient" });
          }
          $wss.broadcast({ event: "updatePatient", patientId: data });
          res.send({ patientId: data });

        }
      );
    }
  });
};

exports.addInsurance = async (req, res) => {
  const fs = require('fs');
  const envConfig = require("../../env");

  let request = req.body;

  let files = [];
  let fileIds = [];

  request.forEach(item => {
    files.push(...item.files);
  })

  for (let i = 0; i < files.length; i++) {

    let extension = files[i].name.split('.');
    extension = extension[extension.length - 1];
    files[i].extension = extension;

    try {

      let file = await File.create(files[i]);
      let base64Data = files[i].data.replace("data:", "").replace(/^.+,/, "");
      let filename = file._id + '.' + extension;
      fs.writeFile(envConfig.PROJECT_DIR + '/storage/' + filename, base64Data, 'base64', function (err) {
        if (err) {
          $logger.error(err);
        }
      });
      fileIds.push(file._id);
    } catch (err) {
      $logger.error(err);
      res.status(500).send({ message: "Error editing Patient" });
    }

  }

  request.files = fileIds;
  request.edit = true;

  Orca.post.insurance(request, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err,
      });
    } else {

      Patient.findOneAndUpdate(
        { _id: request.id },
        {
          $set: {
            name: request.name,
            birthdate: request.birthdate
          },
          $push: {
            files: { $each: request.files }
          }
        },
        {
          runValidators: true
        },
        (err) => {
          if (err) {
            $logger.error(err);
            res.status(500).send({ message: "Error creating Patient" });
          }
          res.send("Success");

        }
      );
    }
  });
};
