const File = require("../models/file.model.js");





exports.create = async (req, res) => {

  // console.log(req);
  res.status(500).send({ message: "Error creating Patient" });

  // const fs = require('fs');
  // const envConfig = require("../../env");

  // let request = req.body;

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
