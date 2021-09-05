module.exports = app => {
    const { authJwt } = require("../middleware");
    const patients = require("../controllers/patients.controller.js");

    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, Content-Type, Accept"
        );
        next()
    })
    
    app.get(
      "/api/patients/:patientID/insuranceSets",
      [authJwt.verifyToken],
      patients.findInsuranceSets
    )

    app.get(
      "/api/patients/search/",
      [authJwt.verifyToken],
      patients.findMany
    )
    app.get(
      "/api/patients/:patientId/details",
      [authJwt.verifyToken],
      patients.findOne
    )

    app.get(
      "/api/patients/:patientId/medical",
      [authJwt.verifyToken],
      patients.findMedicalInfo
    )
    app.get(
      "/api/patients/:patientId/payments/:date",
      [authJwt.verifyToken],
      patients.findPayments
    )

    app.post(
      "/api/patients",
      [authJwt.verifyToken],
      patients.create
    )

    app.put(
      "/api/patients/:patientId",
      [authJwt.verifyToken],
      patients.edit
    )

  }