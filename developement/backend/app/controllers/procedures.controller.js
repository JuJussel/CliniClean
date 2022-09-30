const Procedure = require("../models/procedure.model.js");
const ExaminationProcedure = require("../models/procedureExamination.model.js")
const japUtils = require("japanese-string-utils");

exports.findMany = (req, res) => {
  let cat = req.params.cat;
  let search = String(req.params.search);
  let searchKana = japUtils.toKatakana(search);

  let query = {
    $and: [
      { srykbn: String(cat) },
      {
        $or: [
          { name: { $regex: ".*" + search + ".*" } },
          { kananame: { $regex: ".*" + searchKana + ".*" } },
          { formalname: { $regex: ".*" + search + ".*" } },
          { formalname: { $regex: ".*" + searchKana + ".*" } },
          { srycd: search }
        ]
      }
    ]
  };

  if (cat === 25) {
    query.$and.push({
      $or: [
        { ykzkbn: '1' },
        { ykzkbn: '6' }
      ]
    })
  }

  if (cat === 30) {
    query.$and.push({ ykzkbn: '4' })
  }


  Procedure.mongo.find(query,
    ('srycd name formalname taniname ten procedureClass'))
    .populate({
      path: 'procedureClass',
      select: 'name'
    })
    .exec((err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send({
          message: err
        });
      } else {
        // Using this instead of virtuals and what now to ease stress on DB and because it is just easier...
        data = JSON.parse(JSON.stringify(data));
        data = data.map(doc => ({
          srycd: doc.srycd,
          name: doc.name,
          formalname: doc.formalname,
          taniname: doc.taniname,
          cost: doc.ten,
          procedureClass: doc.procedureClass
        }))
        res.send(data);
      }
    })
}


//   ExaminationProcedure.find(cat, search, (err, data) => {
//     if (err) {
//       res.status(500).send({
//         message: err
//       });
//     } else {
//       res.send(data);
//     }
//   })
// }




exports.results = {
  findMany: (req, res) => {
    let code = req.params.code;
    ExaminationProcedure.find({ _id: { $regex: code + ".*" } }, (err, data) => {
      if (err) {
        $logger.error(err);
        res.status(500).send({ message: "Error retrieving Occupations" })
      }
      res.send(data);
    })

  }
}

exports.fetchAndImport = (req, res) => {
  Procedure.findAll((err, data) => {
    if (err) {
      res.status(500).send({
        message: err
      });
    } else {
      Procedure.mongo.deleteMany({}, (err) => {
        if (err) {
          $logger.error(err);
          res.status(500).send({ message: "Error creating Patient" });
        }
        Procedure.mongo.insertMany(data, (err) => {
          if (err) {
            $logger.error(err);
            res.status(500).send({ message: "Error creating Patient" });
          }
          res.send({ Ok: true });
        })
      })
    }
  })

}

