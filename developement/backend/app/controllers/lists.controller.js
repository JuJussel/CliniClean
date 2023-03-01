const EncounterType = require("../models/encounterType.model.js");
const Orca = require("../utils/orcaApi.util");
const Disease = require("../models/disease.model.js");
const Address = require("../models/address.model.js");
const Static = require("../models/staticList.model.js");
const healthCheckExam = require("../models/healthCheckExams.model.js");
// const { results } = require("./procedures.controller.js");


exports.encounterTypes = {
  findAll: (req, res) => {
    EncounterType.findAll((err, data) => {
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
}

exports.insuranceProviders = {
  findOne: (req, res) => {
    Orca.get.insuranceProvider(req.query.number, (err, data) => {
      if (err) {
        res.status(500).send({
          message: err,
        });
      } else {
        res.send(data);
      }
    });
  }
}

exports.addresses = {
  findOne: (req, res) => {
    let zipCode = req.query.zip;
    Address.findOne(zipCode, (err, data) => {
      if (err) {
        res.status(500).send({
          message: err
        });
      } else {
        res.send({ addr: data?.editadrs_name || '' });
      }
    })
  }
}

exports.schemas = {
  findAll: (req, res) => {
    const path = require('path');
    const fs = require('fs');
    const envConfig = require("../../env");
    const schemaPath = path.join(envConfig.PROJECT_DIR, 'assets', 'schemas');

    fs.readdir(schemaPath, function (err, schemas) {

      if (err) {
        res.status(500).send({
          message: err
        });
      }
      schemas = schemas.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));
      schemas = schemas.map(item => {
        let element = {
          name: item.split('.')[0],
          url: '/assets/schemas/' + item
        }
        return element
      })
      res.send(schemas);
    })
  }
}

exports.diseases = {
  findMany: (req, res) => {
    let query = req.query.name;
    Disease.findMany(query, (err, data) => {
      if (err) {
        res.status(500).send({
          message: err
        });
      } else {
        res.send(data);
      }
    })
  }
}

exports.static = {

  findAll: (req, res) => {

    Static.find({}, '-_id', (err, staticLists) => {
      if (err) {
        $logger.error(err);
        res.status(500).send({ message: "Error retrieving Static Lists" })
      }
      EncounterType.findAll((err, data) => {
        if (err) {
          res.status(500).send({
            message: err
          });
        } else {
          data = data.map(element => ({
            id: parseInt(element.id),
            name: element.name.split(' ')[0]
          }))
          staticLists = JSON.parse(JSON.stringify(staticLists))
          staticLists[0].encounterTypes = data
          res.send(staticLists[0]);
        }
      })

    });
  }
}

exports.healthCheckExams = {
  findAll: async function (req, res) {
    let results = null;
    try {
      results = await healthCheckExam.find()
        .populate('results')
        .populate({
          path: 'procedure',
          populate: {
            path: 'procedureClass'
          },
          select: 'procedureClass name'
        })
        .exec()
    } catch (err) {
      $logger.error(err)
      res.status(500).send({
        message: "Error retrieving Health Check Exams"
      });
    }
    res.send(results);




  }
}