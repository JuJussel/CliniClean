const Medication = require("../models/medication.model.js");


exports.findMany = (req, res) => {
  let cat = req.params.cat;
  let search = req.params.search;
  Medication.findMany(cat, search, (err, data) => {
    if (err) {
        res.status(500).send({
          message: err
        });
    } else {
      res.send(data);
    }
  })
}

