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
            if (data.preferences?.procedures?.favourites) {
                res.send(data.preferences.procedures.favourites);
            } else {
                res.send([]);
            }
        }
    });
};

exports.updateFavourites = async (req, res) => {

    let user = await User.findById(req.params.userId);
    let favourites = user.preferences?.procedures?.favourites ? user.preferences.procedures.favourites : null;
    let codeSorted = {};
    let newFavourites = [];

    if(favourites) {

      favourites.forEach(item => {
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

      newFavourites.push(req.body);

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
