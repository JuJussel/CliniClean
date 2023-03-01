module.exports = app => {
  const { authJwt } = require("../middleware");
  const uploads = require("../controllers/uploads.controller.js");
  const multer = require('multer');
  const envConfig = require("../../env");
  const File = require("../models/file.model.js");

  var storagePost = multer.diskStorage(
    {
      destination: envConfig.PROJECT_DIR + '/storage/',
      filename: async function (req, file, cb) {
        let extension = file.originalname.split('.');
        extension = extension[extension.length - 1];
        let meta = JSON.parse(req.body.data);
        let fileMeta = {
          extension: extension,
          patientId: meta.patientId || null,
          type: file.mimetype,
          meta: meta
        }
        delete fileMeta.meta.patientId
        let dbData = await File.create(fileMeta);
        req.dbData = dbData;
        cb(null, dbData._id + '.' + extension);
      }
    }
  );

  var storagePut = multer.diskStorage(
    {
      destination: envConfig.PROJECT_DIR + '/storage/',
      filename: function (req, file, cb) {
        let meta = JSON.parse(req.body.data);
        let filename = meta.id + "." + meta.extension;
        cb(null, filename);
      }
    }
  );


  const uploadSingle = multer({ storage: storagePost });
  const updateSingle = multer({ storage: storagePut });


  app.use(function (req, res, next) {
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

  app.put(
    "/api/uploads/single",
    [authJwt.verifyToken, updateSingle.single('file')],
    uploads.updateSingle
  )


}