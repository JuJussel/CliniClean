const routes = require('express').Router();

// Root - Vue App
routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

// Import all routes
require("./user.routes")(routes);
require("./auth.routes")(routes);
require("./file.routes")(routes);
require("./asset.routes")(routes);
require("./encounter.routes")(routes);
require("./list.routes")(routes);
require("./patient.routes")(routes);
require("./doctor.routes")(routes);
require("./upload.routes")(routes);
require("./procedure.routes")(routes);
require("./medication.routes")(routes);
require("./order.routes")(routes);

module.exports = routes;