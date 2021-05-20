const ExamType = require("../models/examType.model.js");

exports.findAll = (req,res) => {



  ExamType.findAll((err, data) => {


    
    if (err) {
        res.status(500).send({
          message: "Error retrieving Encounters"
        });
    } else {
      data = data.map(element => ({
        id: element.id.trim(),
        name: element.name.split(' ')[0]
      }))
      res.send(data);
    }
  })
}