const EncounterType = require("../models/encounterType.model.js");
const Config = require("../models/config.model.js");
const Orca = require("../utils/orcaApi.util");
const Address = require("../models/address.model.js");

exports.encounterTypes = {
    findAll: (req,res) => {
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

exports.occupations = {
    findAll: (req,res) => {
        Config.findOne({configName: 'listOccupations'},{ '_id': 0, 'value': 1}, (err, occupation) => {
            if (err) {
              $logger.error(err);
              res.status(500).send({message: "Error retrieving Occupations"})
            }
            res.send(occupation.value);
        });        
    }
}

exports.relations = {
    findAll: (req,res) => {
        Config.findOne({configName: 'listRelations'},{ '_id': 0, 'value': 1}, (err, relation) => {
            if (err) {
              $logger.error(err);
              res.status(500).send({message: "Error retrieving relations"})
            }
            res.send(relation.value);
        });        
    }
}

exports.insuranceProviders = {
    findOne: (req,res) => {
        Orca.get.insuranceProvider(req.params.number, (err, data) => {
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
    findOne: (req,res) => {
        let zip = req.params.zip;
        Address.findOne(zip, (err, data) => {
          if (err) {
              res.status(500).send({
                message: err
              });
          } else {
            res.send({addr: data.editadrs_name});
          }
        })       
    }
}

exports.schemas = {
    findAll: (req,res) => {
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
            res.send(schemas);
          })
    }
}

exports.shotLocations = {
    findAll: (req,res) => {
        Config.findOne({configName: 'shotLocations'},{ '_id': 0, 'value': 1}, (err, occupation) => {
            if (err) {
              $logger.error(err);
              res.status(500).send({message: "Error retrieving Occupations"})
            }
            res.send(occupation.value);
        });        
    }
}

exports.perscriptionTypes = {
    findAll: (req,res) => {
        Config.findOne({configName: 'perscriptionTypes'},{ '_id': 0, 'value': 1}, (err, occupation) => {
            if (err) {
              $logger.error(err);
              res.status(500).send({message: "Error retrieving Occupations"})
            }
            res.send(occupation.value);
        });        
    }

}

exports.perscriptionTimings = {
    findAll: (req,res) => {
        Config.findOne({configName: 'perscriptionTimings'},{ '_id': 0, 'value': 1}, (err, occupation) => {
            if (err) {
              $logger.error(err);
              res.status(500).send({message: "Error retrieving Occupations"})
            }
            res.send(occupation.value);
        });        
    }

}