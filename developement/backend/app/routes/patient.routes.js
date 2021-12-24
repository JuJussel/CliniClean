module.exports = app => {
    const { authJwt } = require("../middleware");
    const patients = require("../controllers/patients.controller.js");
    const patientsMedical = require("../controllers/patients.medical.controller.js");

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
      "/api/patients/:patientId",
      [authJwt.verifyToken],
      patients.findOne
    )
    app.get(
      "/api/patients/:patientId/medicalHistory",
      [authJwt.verifyToken],
      patients.findMedicalHistory
    )
    app.get(
      "/api/patients/:patientId/diseases",
      [authJwt.verifyToken],
      patients.findDiseases
    )
    app.get(
      "/api/patients/:patientId/payments/:date",
      [authJwt.verifyToken],
      patients.findPayments
    )
    app.get(
      "/api/patients/:patientId/encounters",
      [authJwt.verifyToken],
      patients.findEncounters
    )

    app.post(
      "/api/patients",
      [authJwt.verifyToken],
      patients.create
    )

    app.post(
      "/api/patients/:patientId/medical/vitals",
      [authJwt.verifyToken],
      patientsMedical.addMedicalVitals
    )

    app.put(
      "/api/patients/:patientId",
      [authJwt.verifyToken],
      patients.edit
    )

    app.put(
      "/api/patients/:patientId/medical/basics",
      [authJwt.verifyToken],
      patientsMedical.editMedicalBasics
    )

    app.post(
      "/api/patients/:patientId/medical/diseases",
      [authJwt.verifyToken],
      patientsMedical.editDiseases
    )

  }