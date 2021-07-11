module.exports = app => {
    const { authJwt } = require("../middleware");
    const uploads = require("../controllers/uploads.controller.js");
    const multer  = require('multer');
    const envConfig = require("../../env");
    const File = require("../models/file.model.js");  

    var storage = multer.diskStorage(
      {
          destination: envConfig.PROJECT_DIR + '/storage/',
          filename: async function ( req, file, cb ) {
              let extension = file.originalname.split('.');
              extension = extension[extension.length - 1];
              let meta = JSON.parse(req.body.data);
              let fileMeta = {
                extension: extension,
                type: file.mimetype,
                meta: meta
              }
              let dbfilename = await File.create(fileMeta);
              cb( null, dbfilename._id + '.' + extension);
          }
      }
  );

  const uploadSingle = multer( { storage: storage } );

  app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
      );
      next()
  })
  
  app.post(
    "/api/uploads/single",
    [authJwt.verifyToken, uploadSingle.single('file')],
    uploads.createSingle
  )

}