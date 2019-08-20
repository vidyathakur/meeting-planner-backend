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
const nodemailer = require("nodemailer");
const UserModel = mongoose.model('User')

let createMail = (req, res) => {
 
     return new Promise((resolve, reject) => {
             UserModel.findOne({ email: req.body.email}, (err, userDetails) => {
                    if (err) {
                        console.log(err)
                        logger.error('Failed To Retrieve User Data', 'userController: findUser()', 10)
                        let apiResponse = response.generate(true, 'This email does not exist', 500, null)
                         res.send(apiResponse)
                    } else if (check.isEmpty(userDetails)) {
                       // logger.error('No User Found', 'userController: findUser()', 7)
                        let apiResponse = response.generate(true, 'Please enter valid email', 404, null)
                         res.send(apiResponse)
                    } else {
                        let randomPassId = shortid.generate();
                         let updatePass = {
                            password: passwordLib.hashpassword(randomPassId)
                        };
                        
                         UserModel.update({'email': req.body.email }, updatePass).exec((err, result) => {
                              if (err) {
                                  console.log(err)
                                  logger.error(err.message, 'User Controller:editUser', 10)
                                  let apiResponse = response.generate(true, 'Failed to forgot password', 500, null)
                                  res.send(apiResponse)
                              } else {
                                  let apiResponse = response.generate(false, 'Password has been sent in your email .please check email and login', 200, result)
                                  //this.sendEmail(req.body.email,randomPassId);
                                  /**
                                   * Send Email Function
                                   */
                                   var transporter = nodemailer.createTransport({
                                          host:'smtp.gmail.com',
                                          port:587,
                                          secure:false,
                                          auth: {
                                            user: 'vkrani42@gmail.com', //1cb25c8e9cd1ad // f16e858e4afc3f
                                            pass: 'satyanam@123' 
                                          }
                                        });

                                        var mailOptions = {
                                          from: 'manish.raj079@gmail.com',
                                          to: req.body.email,
                                          subject: 'forgot password',
                                          html: `
                                                  <table style="width: 100%; border: none">
                                                    <thead>
                                                      <tr style="background-color: #000; color: #fff;">
                                                        <th style="padding: 10px 0">Email</th>
                                                        <th style="padding: 10px 0">password</th>
                                                      </tr>
                                                    </thead>
                                                    <tbody>
                                                      <tr>
                                                        <th style="text-align: center">${req.body.email}</th>
                                                        <td style="text-align: center">${randomPassId}</td>
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                `
                                        };

                                        transporter.sendMail(mailOptions, (error, info) => {
                                          if (error) {
                                            console.log(error);
                                          } else {
                                            console.log('Email sent: ' + info.response);
                                            res.status(200).json({
                                              message: 'successfuly sent!'
                                            })
                                            transport.close();
                                          }
                                        });
                                  /**
                                   * End Send Email function
                                   */
                                  res.send(apiResponse)
                              }
                          });
                    }
                });
        })
 
};

// let sendEmail = ((email,password) =>{
//   var transporter = nodemailer.createTransport({
//     host:'smtp.gmail.com',
//     port:587,
//     secure:false,
//     auth: {
//       user: 'vkrani42@gmail.com', //1cb25c8e9cd1ad // f16e858e4afc3f
//       pass: 'satyanam@123' 
//     }
//   });

//   var mailOptions = {
//     from: 'manish.raj079@gmail.com',
//     to: 'manish.raj079@gmail.com',
//     subject: 'forgot password',
//     html: `
//             <table style="width: 100%; border: none">
//               <thead>
//                 <tr style="background-color: #000; color: #fff;">
//                   <th style="padding: 10px 0">Email</th>
//                   <th style="padding: 10px 0">password</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <th style="text-align: center">hii</th>
//                   <td style="text-align: center">dsfsd</td>
//                 </tr>
//               </tbody>
//             </table>
//           `
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('Email sent: ' + info.response);
//       res.status(200).json({
//         message: 'successfuly sent!'
//       })
//        transport.close();
//     }
//   });
// })




module.exports = {
  createMail: createMail
}// end exports


