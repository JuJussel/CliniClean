const User = require("../models/user.model.js");

// Find a single Customer with a customerId
exports.findOne = (req, res) => {
    User.findById(req.params.userId, (err, data) => {
        if (err) {
            $logger.error(err);
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found User with id ${req.params.customerId}.`,
                });
            } else {
                res.status(500).send({
                    message:
                        "Error retrieving User with id " +
                        req.params.customerId,
                });
            }
        } else {
            res.send(data);
        }
    });
};

exports.findAll = (req, res) => {
  User.find({}, {"password": 0}, (err, data) => {
      if (err) {
        $logger.error(err);
          res.status(500).send({
              message:
                  "Error retrieving Users"
          });
      } else {
          res.send(data);
      }
  });
};

exports.findFavourites = (req, res) => {
    User.findById(req.params.userId, (err, data) => {
        if (err) {
            $logger.error(err);
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found User with id ${req.params.customerId}.`,
                });
            } else {
                res.status(500).send({
                    message:
                        "Error retrieving User with id " +
                        req.params.customerId,
                });
            }
        } else {
            if (data?.preferences?.procedures?.favourites) {
                res.send(data.preferences.procedures.favourites);
            } else {
                res.send([]);
            }
        }
    });
};

exports.updateUser = (req, res) => {
  req = req.body;
  let user = {
    username: req.username,
    nameFirst: req.nameFirst,
    nameLast: req.nameLast,
    active: req.active,
    userGroup: req.userGroup
  }
  if (req.password) {
    var bcrypt = require("bcryptjs");
    user.password = bcrypt.hashSync(req.password, 10);
  }
  User.findOneAndUpdate({id: req.id}, user, (err) => {
    if (err) {
      $logger.error(err);
          res.status(500).send({
              message:
                  "Error updating User with id " +
                  req.id
          });
    } else {
        res.send({ok: true});
    }
  })
};

exports.updateFavourites = async (req, res) => {

    let user = await User.findById(req.params.userId);
    let favourites = user.preferences?.procedures?.favourites ? user.preferences.procedures.favourites : null;
    let codeSorted = {};
    let newFavourites = [];
    let pushNew = true;

    if(favourites) {

      favourites.forEach(item => {
        
        if (item.srycd === req.body.srycd) pushNew = false;
        codeSorted[item.cat.code] ? codeSorted[item.cat.code].push(item) : codeSorted[item.cat.code] = [item];
        let codeContainer = codeSorted[item.cat.code];
        if (codeContainer.length > 9) {
          codeSorted[item.cat.code].shift();
        }
      })

      Object.values(codeSorted).forEach(item => {
        newFavourites = newFavourites.concat(item);
      })

      // For future feature to have pinned procedures
      req.body.pinned = false;
      console.log(pushNew);
      if(pushNew) newFavourites.push(req.body);

    } else {
      newFavourites = [req.body];
    }

    User.findOneAndUpdate(
      { _id: req.params.userId},
      {
        $set: {
          "preferences.procedures.favourites": newFavourites
        }
      },
      {
        runValidators: true
      },
      (err) => {
        if (err) {
          $logger.error(err);
          res.status(500).send({ message: "Error saving Encounter" });
        }
        res.send(newFavourites);

      }
    )
};
