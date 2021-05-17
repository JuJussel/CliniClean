const express = require('express');

module.exports = app => {
  const { authJwt } = require("../middleware");

  app.use('/files/*', function(req,res,next){
    return express.static(__dirname + '/storage');
    // if(authJwt.verifyToken){
    // } else {
    //   res.render(403, 'login', {message:'Please, login!'});
    // }
    });     
};