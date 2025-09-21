# WIP

Work on changing data to FHIR

Will need som data in FHIR, plus some collections that are only for the app.

Then also get some data from Orca as per below

### Current data sources:

Need to separate what data is generic (like lists, zip codes,..) and which is
specific medical info. EG. specific info is needed for the system to work. Others is just lists and no issue if lost or changed.

Need to think about if some things are better moved form Orca to FHIR or Mongo

| File                       | Info                                 | Source               | Type    |
| -------------------------- | ------------------------------------ | -------------------- | ------- |
| address.model.js           | get address by zip code              | Orca                 | List    |
| disease.model.js           | search for diseases                  | Orca                 | List    |
| encounter.model.js         | Get all info from Encounter          | Mongo > FHIR         | Patient |
| encounterType.model.js     | Get available encounter types        | Orca                 | List    |
| file.model.js              | Files for a patient, still used???   | Mongo > FHIR?        | Patient |
| healthCheckExams.model.js  | Get exams done during healthcheck    | Mongo                | List    |
| insuranceProvider.model.js | Get insurance name from number       | Orca                 | List    |
| medication.model.js        | Get list of availabe medications     | Orca                 | List    |
| notification.model.js      | Notifications for users              | Mongo                | User    |
| order.model.js             | Orders                               | Mongo > FHIR ?       | Patient |
| patient.model.js           | Patient basic data                   | Mongo > FHIR         | Patient |
| procedure.model.js         | Availabe procedures                  | Mongo/Orca > FHIR ?? | List    |
| procedureClass.model.js    | Procedure classes                    | Mongo                | List    |
| procedureExamination       | Not sure...                          | Mongo > FHIR ?       | List    |
| settings.model.js          | settings for system                  | Mongo                | System  |
| staticList.model.js        | All kinds of lists... Need to review | Mongo > FHIR???      | List    |
| user.model.js              | user data                            | Mongo > FHIR ?       | User    |
| vital.model.js             | Vitals for a patient                 | Mongo > FHIR         | Patient |
