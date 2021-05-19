const routes = require('express').Router();

// Root - Vue App
routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

// Import all routes
require("./user.routes")(routes);
require("./auth.routes")(routes);
require("./file.routes")(routes);
require("./encounter.routes")(routes);
require("./list.routes")(routes);



module.exports = routes;