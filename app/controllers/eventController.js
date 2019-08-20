const mongoose = require('mongoose');
const logger = require('./../libs/loggerLib');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib');
//const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib');
const check = require('../libs/checkLib');
const passwordLib = require('./../libs/generatePasswordLib');
const token = require('../libs/tokenLib');
const AuthModel = mongoose.model('Auth');
const nodemailer = require('nodemailer');

/* Models */
const EventsModel = mongoose.model('Events')
/* Get all event Details */

let getAllEvents = (req, res) => {
    EventsModel.find({userId:req.params.userId})
        .select(' -__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'Event Controller: getAllEvents', 10)
                let apiResponse = response.generate(true, 'Failed To Find Events ', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No Event Found', 'Event Controller: getAllEvents')
                let apiResponse = response.generate(true, 'No Events Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'All Event  Found', 200, result)
                
                res.send(apiResponse)
            }
        })
}// end get all users

let createEvents = (req, res) => {
   
    let eventsCreationFunction = () => {
        return new Promise((resolve, reject) => {
            console.log(req.body)
            if (check.isEmpty(req.body.title)  || check.isEmpty(req.body.description) || check.isEmpty(req.body.meetingWith) || check.isEmpty(req.body.meetingPlace) || check.isEmpty(req.body.startTime) || check.isEmpty(req.body.endTime)) {

                console.log("403, forbidden request");
                let apiResponse = response.generate(true, 'required parameters are missing', 403, null)
                reject(apiResponse)
            } else {

                var today = Date.now()
                let newEvents = new EventsModel({
                    userId: req.body.userId,
                    meetId: shortid.generate(),
                    title: req.body.title,
                     description: req.body.description,
                    meetingWith: req.body.meetingWith,
                    meetingPlace: req.body.meetingPlace,
                   isPublished: true,
                    startTime: req.body.startTime,
                    endTime: req.body.endTime,
                    created: today,
                    lastModified: today
                }) // end new events model

                let tags = (req.body.tags != undefined && req.body.tags != null && req.body.tags != '') ? req.body.tags.split(',') : []
                newEvents.tags = tags
               
                newEvents.save((err, result) => {
                    if (err) {
                        console.log('Error Occured.')
                        logger.error(`Error Occured : ${err}`, 'Database', 10)
                        let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                        reject(apiResponse)
                    } else {
                         var transporter = nodemailer.createTransport({
								host: 'smtp.gmail.com',
								port: 587,
								secure: false,
								auth: {
									user: 'vkrani42@gmail.com',
									pass: 'satyanam@123'
								}
							});

							var mailOptions = {
                                 from: req.body.from, 
                                 to: req.body.email,
                                 subject: 'Meeting Schedule',
                                 html: `
                                                  <table style="width: 100%; border: none">
                                                    <thead>
                                                      <tr style="background-color: #000; color: #fff;">
                                                        <th style="padding: 10px 0">Title</th>
                                                        <th style="padding: 10px 0">Description</th>
                                                        <th style="padding: 10px 0">MeetingWith</th>
                                                        <th style="padding: 10px 0">MeetingPlace</th>
                                                        <th style="padding: 10px 0">StartTime</th>
                                                        <th style="padding: 10px 0">EndTime</th>
                                                      </tr>
                                                    </thead>
                                                    <tbody>
                                                      <tr>
                                                        <th style="text-align: center">${req.body.title}</th>
                                                        <th style="text-align: center">${req.body.description}</th>
                                                        <th style="text-align: center">${req.body.meetingWith}</th>
                                                        <th style="text-align: center">${req.body.meetingPlace}</th>
                                                        <th style="text-align: center">${req.body.startTime}</th>
                                                         <th style="text-align: center">${req.body.endTime}</th>
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                ` };

							transporter.sendMail(mailOptions, (error, info) => {
								if (error) {
									console.log(error);
								} else {
									console.log('Email sent: ' + info.response);
									res.status(200).json({ message: 'successfuly sent!' });
									transport.close();
								}
							});
                        console.log('Success in events creation')
                        resolve(result)
                    }
                }) // end new events save


            }
        }) // end new events promise
    } // end create events function

    // making promise call.
    eventsCreationFunction()
        .then((result) => {
            let apiResponse = response.generate(false, 'Events Created successfully', 200, result)
            res.send(apiResponse)
        })
        .catch((error) => {
            console.log(error)
            res.send(error)
        })
}
    // end create event  function

    let editEvent = (req, res) => {
			let options = req.body.eventItem;
			EventsModel.update({ meetId: req.body.meetId }, options).exec((err, result) => {
				if (err) {
					console.log(err);
					logger.error(err.message, 'Event Controller:editEvent', 10);
					let apiResponse = response.generate(true, 'Failed To edit events details', 500, null);
					res.send(apiResponse);
				} else if (check.isEmpty(result)) {
					logger.info('No events Found', 'Event Controller: editEvent');
					let apiResponse = response.generate(true, 'No events Found', 404, null);
					res.send(apiResponse);
				} else {
                    var transporter = nodemailer.createTransport({
						host: 'smtp.gmail.com',
						port: 587,
						secure: false,
						auth: {
							user: 'vkrani42@gmail.com',
							pass: 'satyanam@123'
						}
					});

					var mailOptions = { from: req.body.email, to: req.body.email, subject: 'Meeting Schedule', html: `
                                                  <table style="width: 100%; border: none">
                                                    <thead>
                                                      <tr style="background-color: #000; color: #fff;">
                                                        <th style="padding: 10px 0">Title</th>
                                                        <th style="padding: 10px 0">Description</th>
                                                        <th style="padding: 10px 0">MeetingWith</th>
                                                        <th style="padding: 10px 0">MeetingPlace</th>
                                                        <th style="padding: 10px 0">StartTime</th>
                                                        <th style="padding: 10px 0">EndTime</th>
                                                      </tr>
                                                    </thead>
                                                    <tbody>
                                                      <tr>
                                                        <th style="text-align: center">${req.body.title}</th>
                                                        <th style="text-align: center">${req.body.description}</th>
                                                        <th style="text-align: center">${req.body.meetingWith}</th>
                                                        <th style="text-align: center">${req.body.meetingPlace}</th>
                                                        <th style="text-align: center">${req.body.startTime}</th>
                                                         <th style="text-align: center">${req.body.endTime}</th>
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                ` };

                            transporter.sendMail(mailOptions, (error, info) => {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log('Email sent: ' + info.response);
                                    res.status(200).json({ message: 'successfuly sent!' });
                                    transport.close();
                                }
                            });
					let apiResponse = response.generate(false, 'events details edited', 200, result);
					res.send(apiResponse);
				}
			}); // end events model update
		};// end edit events

/**
 * function to find single event.
 */

let getSingleEvents = (req, res) => {

    EventsModel.findOne({ 'userId': req.params.userId })
        .select('-password -__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'Event Controller: getSingleEvents', 10)
                let apiResponse = response.generate(true, 'Failed To Find Event Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No Event Found', 'Event Controller:getSingleEvents')
                let apiResponse = response.generate(true, 'No Event Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'Event Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}

let deleteEvent = (req, res) => {
  
    EventsModel.findOneAndRemove({ meetId: req.params.eventId }).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'Event Controller: deleteEvent', 10)
            let apiResponse = response.generate(true, 'Failed To delete Event', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No Event Found', 'Event Controller: deleteEvent')
            let apiResponse = response.generate(true, 'No Event Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Deleted the Event successfully', 200, result)
            res.send(apiResponse)
        }
    });// end Event model find and remove

}



    // end create event  function



module.exports = {
    createEvents:createEvents,
    editEvent: editEvent,
    getSingleEvents:getSingleEvents,
    deleteEvent: deleteEvent,
    getAllEvents: getAllEvents
}// end exports


