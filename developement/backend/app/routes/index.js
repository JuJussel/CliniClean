const routes = require('express').Router();

// Root - Vue App
routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

// Import all routes
require("./user.routes")(routes);
require("./auth.routes")(routes);


module.exports = routes;