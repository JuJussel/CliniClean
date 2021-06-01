module.exports = app => {
    const { authJwt } = require("../middleware");
    const doctors = require("../controllers/doctors.controller.js");

    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, Content-Type, Accept"
        );
        next();
    });
    // Create a new Customer
    // app.post("/users", user.create);
  
    // // Retrieve all Customers
    // app.get("/customers", customers.findAll);
  
    // Retrieve a single Customer with customerId
    app.get(
      "/api/doctors",
      [authJwt.verifyToken],
      doctors.findAll
    );
  
    // // Update a Customer with customerId
    // app.put("/customers/:customerId", customers.update);
  
    // // Delete a Customer with customerId
    // app.delete("/customers/:customerId", customers.delete);
  
    // // Create a new Customer
    // app.delete("/customers", customers.deleteAll);
  };