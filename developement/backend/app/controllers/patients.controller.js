const Patient = require("../models/patient.model.js");
const Orca = require("../utils/orcaApi.util");
const japUtils = require("japanese-string-utils");
const File = require("../models/file.model.js");

exports.findMany = (req, res) => {
  let name = req.query.id;
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

exports.findPayments = (req,res) => {
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
}

exports.findOne = (req, res) => {
  let id = req.params.patientId;

  Orca.get.patient(id, (err, data) => {
    if (err) {
      $logger.error(err);
      res.status(500).send({
        message: err,
      });
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
      res.send({patientData: responseData});
    }
  });

  // let name = req.query.id;
  // let id = isNaN(parseInt(name)) ? null : name;
  // Patient.find(
  //   {
  //     $or: [{ _id: id }, { name: new RegExp("^" + name, "i") }],
  //   },
  //   (err, patient) => {
  //     if (err) {
  //       $logger.error(err);
  //       res.status(500).send({message: "Error retrieving Doctors"})
  //     }
  //     res.send(patient);
  //   }
  // );
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
exports.findMedicalHistory = (req,res) => {

  // Get Patient from Mongo
  // Get other stuff from Orca
  //// Diseases


}
exports.findDiseases = (req, res) => {
  Orca.get.diseases(req.params.patientId, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err,
      });
    } else {
      if (data.Api_Result === '21') {
        res.send([]);
      } else {
        data = data.Disease_Information.Disease_Information_child;
        if (data.Department_Code) {
          data = [data];
        }
        res.send(data);
      }
    }
  });
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
      fs.writeFile(envConfig.PROJECT_DIR + '/storage/' + filename, base64Data, 'base64', function(err) {
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
        res.send({patientId: data});
      })
    }
  });

};

exports.edit = async (req, res) => {
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
      fs.writeFile(envConfig.PROJECT_DIR + '/storage/' + filename, base64Data, 'base64', function(err) {
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
          $push: {
            files: { $each: request.files}
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
          res.send({patientId: data});

        }
      );
    }
  });




};
