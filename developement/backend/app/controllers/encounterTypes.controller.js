const ExamType = require("../models/examType.model.js");

exports.findAll = (req,res) => {



  ExamType.findAll((err, data) => {


    
    if (err) {
        res.status(500).send({
          message: err
        });
    } else {
      data = data.map(element => ({
        id: parseInt(element.id),
        name: element.name.split(' ')[0]
      }))
      res.send(data);
    }
  })
}