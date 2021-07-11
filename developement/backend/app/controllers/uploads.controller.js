const Patient = require("../models/patient.model.js");

exports.createSingle = async (req, res) => {
  
  let uploadedFiles = req.file.filename.split('.')[0];
  uploadedFiles = [uploadedFiles];

  let patient = parseInt(JSON.parse(req.body.data).patient);

  Patient.findOneAndUpdate(
    { _id: patient },
    {
      $push: {
        files: { $each: uploadedFiles}
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
      res.send({url: req.file.filename});

    }
  );


  // let files = [];
  // let fileIds = [];

  // for (let i = 0; i < files.length; i++) {

  //   let extension = files[i].name.split('.');
  //   extension = extension[extension.length - 1];
  //   files[i].extension = extension;

  //   try {
      
  //     let file = await File.create(files[i]);
  //     let base64Data = files[i].data.replace("data:", "").replace(/^.+,/, "");
  //     let filename = file._id + '.' + extension;
  //     fs.writeFile(envConfig.PROJECT_DIR + '/storage/' + filename, base64Data, 'base64', function(err) {
  //       if (err) {
  //         $logger.error(err);          
  //       }
  //     });
  //     fileIds.push(file._id);
  //   } catch (err) {
  //     $logger.error(err);
  //     res.status(500).send({ message: "Error creating Patient" });
  //   }

  // }

};
