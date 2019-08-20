const express = require('express')
const router = express.Router();
const userController = require("./../../app/controllers/userController");
const eventController = require("./../../app/controllers/eventController");
const sendmailController = require("./../../app/controllers/sendmailController");
const appConfig = require("./../../config/appConfig")
const auth = require('./../middlewares/auth');

module.exports.setRouter = (app) => {

  let baseUrl = `${appConfig.apiVersion}/users`

  // defining userController routes.
    
    app.get(`${baseUrl}/view/all/:userId`, auth.isAuthorized, userController.getAllUser);
    
    app.post(`${baseUrl}/country`, auth.isAuthorized, userController.createTable);
    
    app.get(`${baseUrl}/all/events/:userId`, auth.isAuthorized, eventController.getAllEvents)

    app.post(`${baseUrl}/newuser`, auth.isAuthorized, userController.newUserFunction);

     // params: userId.
    app.get(`${baseUrl}/:userId/details`, auth.isAuthorized, userController.getSingleUser);

    app.put(`${baseUrl}/:userId/edit`, auth.isAuthorized, userController.editUser);

    app.post(`${baseUrl}/:userId/delete`, auth.isAuthorized, userController.deleteUser);

    // params: firstName, lastName, email, mobileNumber, password
    app.post(`${baseUrl}/signup`, userController.signUpFunction);

    app.post(`${baseUrl}/login`, userController.loginFunction);

    app.post(`${baseUrl}/logout`, auth.isAuthorized, userController.logout);



     // defining eventController routes.
    
    app.post(`${baseUrl}/create`, auth.isAuthorized, eventController.createEvents);

    app.post(`${baseUrl}/editEvent`, auth.isAuthorized, eventController.editEvent);

    app.post(`${baseUrl}/:eventId/deleteEvent`, auth.isAuthorized, eventController.deleteEvent);

    // params: userId.

    app.get(`${baseUrl}/:userId/events`, auth.isAuthorized, eventController.getSingleEvents);


     // defining eventController routes.

     app.post(`${baseUrl}/sendFormData`, sendmailController.createMail);






    

    

    

   

    

    
    

    

    
}