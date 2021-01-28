const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const details = require("./details.json");
const bodyparser = require('body-parser');
const User = require("./User");
const Quest = require("./History");
const ItemData = require("./itemData");
const History = require("./History");

// const db = mongoose.connect('mongodb://localhost:27017/userData', function (err, response) {
const db = mongoose.connect('mongodb+srv://roshna:kcdonation123@cluster0-gcp8v.mongodb.net/test?retryWrites=true&w=majority', function (err, response) {
  if(err)
        console.log("Error in mongodb connection");
  else
      console.log("Mongodb connection added");
});

const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

app.listen(3000, () => {
  console.log("The server started on port 3000 !!!!!!");
});

// app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send(
    "<h1 style='text-align: center'>Wellcome to AI Chatbot <br></h1>"
  );
});

app.get("/getRequestersEmail", (req, res) => {
  // console.log("Get request for all Items");
  User.find({userType:"Requester"})
    .exec(function (err, response) {
      if(err) {
        console.log("Error in receiving Items");
      } else {
        const result = [];
        response.forEach(function(u) { result.push(u.registerEmail)});
        res.send(result);
      }
    })
});

app.get("/getUserHistory/:username/:previousState", (req, res) => {
  // console.log("Get request for all Item History: "+JSON.stringify(req.params.username));

  if (req.params.previousState ==='donar')
    History.find({donarName: req.params.username})
      .exec(function (err, itemdatas) {
        if(err) {
          console.log("Error in receiving Item History");
        } else {
          res.json(itemdatas);
        }
      })
  else
    History.find({requesterName: req.params.username})
      .exec(function (err, itemdatas) {
        if(err) {
          console.log("Error in receiving Item History");
        } else {
          res.json(itemdatas);
        }
      })

});

app.delete("/deleteItem/:id", (req, res) => {
  // ItemData.deleteOne({_id: req.params.id}, function (err, deletedItem) {
  ItemData.findByIdAndDelete(req.params.id, function (err, deletedItem) {
    if(err) {
      res.send({success: false, message: "Failed to delete an item"});
    } else {
      res.send({success: true, message: "Successfully deleted an item"});
    }
  })
})

app.get("/getItemData/:searchCat/:username", (req, res) => {
  console.log("searchCat :" + req.params.searchCat + " userName:"+req.params.username);
  if(req.params.username !== 'All')
    ItemData.find({username: req.params.username})
      .exec(function (err, itemdatas) {
        if(err) {
          console.log("Error in receiving Items");
        } else {
          res.json(itemdatas);
        }
      })
  else if(req.params.username === 'All' && req.params.searchCat === 'All')
    ItemData.find({})
      .exec(function (err, itemdatas) {
        if(err) {
          console.log("Error in receiving Items");
        } else {
          res.json(itemdatas);
        }
      })
  else
    ItemData.find({itemCategory: req.params.searchCat})
      .exec(function (err, itemdatas) {
        if(err) {
          console.log("Error in receiving Items");
        } else {
          res.json(itemdatas);
        }
      })
});
app.patch("/upDateHistory", (req, res) => {
  console.log("request came in update history - body : " + JSON.stringify(req.body.headers));
  mongoose.set('useFindAndModify', false);
  // ItemData.deleteOne({_id: req.params.id}, function (err, updatehistory) {
  History.findOneAndUpdate({referenceId: req.body.headers.Id}, {requesterName: req.body.headers.name, requesterCompDate: req.body.headers.date}, function (err, updatehistory) {
    if(err) {
      res.send({success: false, message: "Failed to update a item"});
    } else {
      res.send({success: true, message: "Successfully updated a item"});
    }
  })
})
app.patch("/upDatePassword", (req, res) => {
  console.log("request came in update password - body : " + JSON.stringify(req.body.headers));
  mongoose.set('useFindAndModify', false);
  User.findOneAndUpdate({registerEmail: req.body.headers.emailID}, {registerPassword: req.body.headers.randomNumber}, function (err, upDatePassword) {
    if(err) {
      res.send({success: false, message: "Failed to update password"});
    } else {
      res.send({success: true, message: "Successfully updated passowrd"});
    }
  })
})
app.patch("/profUpdate", async (req, res) => {
  console.log("request came in update profile - body : " + JSON.stringify(req.body.headers));
  mongoose.set('useFindAndModify', false);
  const resp = await User.findOne({registerEmail:req.body.headers.exEmail, registerPassword: req.body.headers.currPass});
  // console.log(resp);
  if(!resp) {
    console.log("incorrect details");
    res.json({
      success: false,
      message: "Incorrect user details",
      status: 500
    })
  } else {
    User.findOneAndUpdate({registerEmail: req.body.headers.exEmail, registerPassword: req.body.headers.currPass}, {registerPassword: req.body.headers.nPass}, function (err, profUpdate) {
      if(err) {
        res.json({
          success: false,
          message: "Incorrect user details",
          status: 500
        })
      } else {
        // res.send({success: true, message: "Successfully updated profile"});
        res.json({
          success: true,
          message: "Successfully updated profile",
          status: 500
        })
      }
    })
  }
})
app.post('/registration', (req, res) => {
    // console.log(req.body);
    const userType = req.body.userType;
    const registerUsername = req.body.registerUsername;
    const registerEmail = req.body.registerEmail;
    const registerPassword = req.body.registerPassword;

    const user = new User();
    user.userType = userType;
    user.registerUsername = registerUsername;
    user.registerEmail = registerEmail;
    user.registerPassword = registerPassword;

    user.save((err, result) => {
      if(err) {
        console.log("There is a error while adding in db");
        res.send({success: false, message: "Failed to add user"});
      } else {
        console.log("successfuly saved");
        res.send({success: true, message: "Successfuly added new user"});
      }
    })

});

app.post('/submitItem', (req, res) => {
  console.log(req.body);
  const itemCategory = req.body.itemCategory;
  const itemName = req.body.itemName;
  const itemAddress = req.body.itemAddress;
  const itemExpiry = req.body.itemExpdate;
  const itemWeight = req.body.itemWeight;
  const itemPrice = req.body.itemPrice;
  const userName = req.body.username;

  const itemData = new ItemData();
  itemData.itemCategory = itemCategory;
  itemData.itemName = itemName;
  itemData.itemAddress = itemAddress;
  itemData.itemExpiry = itemExpiry;
  itemData.itemWeight = itemWeight;
  itemData.itemPrice = itemPrice;
  itemData.username = userName;

  itemData.save((err, result) => {
    if(err) {
      console.log("There is a error while adding in db");
      res.send({success: false, message: "Failed to add an item"});
    } else {
      console.log("successfully saved");
      console.log("reference ID : " + result._id);
        res.send({success: true, message: "Successfully added a new Item", referenceID:result._id});
    }
  })
});

app.post('/addHistory', (req, res) => {
  console.log('body: ' + JSON.stringify(req.body) + ' headers :' + JSON.stringify(req.headers));
  mongoose.set('useFindAndModify', false);
  const itemCategory = req.body.itemCategory;
  const itemName = req.body.itemName;
  const itemAddress = req.body.itemAddress;
  const itemExpiry = req.body.itemExpdate;
  const itemWeight = req.body.itemWeight;
  const itemPrice = req.body.itemPrice;
  const donarName = req.body.username;
  const addedDate = req.body.addeddate;
  const referenceID = req.headers.refid;

  // Table to maintain history of Donars and Requesters
  const  history = new History();
  history.donarName = donarName;
  history.donarAddedDate = addedDate;
  history.itemCategory = itemCategory;
  history.itemName = itemName;
  history.itemAddress = itemAddress;
  history.itemExpiry = itemExpiry;
  history.itemWeight = itemWeight;
  history.itemPrice = itemPrice;
  history.requesterName = "";
  history.requesterCompDate = "";
  history.referenceId = referenceID;
  history.save((err, result) => {
    if(err) {
      console.log("error in adding history");
      res.send({success: false, message: "Failed to add a data in history"});
    } else {
      // console.log("reference ID : " + result.objectId);
      res.send({success: true, message: "Successfully added a new data in history"});
    }
  })
});

app.post('/loginpage', async (req, res) => {
  // console.log("Body: " + req.body);
  const username = req.body.username;
  const password = req.body.password;
  console.log("app.js " + username, password);
  const resp = await User.findOne({registerUsername:username, registerPassword:password});
  // console.log(resp);
  if(!resp) {
    console.log("incoreect details");
    res.json({
      success: false,
      message: "Incorrect user details",
      status: 500
    })
    // res.send({success: "Incorrect user details", status: 500});
  } else {
    console.log("loggin you in: " + resp.userType);
    res.json({
      success: true,
      message: "Successfuly verified the user",
      status: 200,
      userType: resp.userType
    })
    // res.send({success: "Successfuly verified the user", status: 200, userType: resp.userType});
  }
});

app.post('/custExist', async (req, res) => {
  console.log("Body: " + req.body.reminderEmail);
  const userEmail = req.body.reminderEmail;
  // console.log("app.js " + JSON.parse(req));
  const resp = await User.findOne({registerEmail:userEmail});
  // console.log(resp);
  if(!resp) {
    console.log("incoreect details");
    res.json({
      success: false,
      message: "Incorrect user details",
      status: 500
    })
    // res.send({success: "Incorrect user details", status: 500});
  } else {
    console.log("loggin you in: " + resp.userType);
    res.json({
      success: true,
      message: "Successfuly verified the user",
      status: 200,
      userType: resp.userType
    })
  }
});

app.post("/sendmail", (req, res) => {
  // console.log("request came");
  let user = req.body;
  sendMail(user, info => {
    console.log(`The mail has beed send, and the id is ${user}`);
    res.send(info);
  });
});
async function sendMail(user, callback) {
  // create reusable transporter object using the default SMTP transport
  console.log("request came in sendMail");
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: details.email,
      pass: details.password
    }
  });
  let mailOptions='';
  if(user.subject==='sendNotificationToReq')
      mailOptions = {
      from: '"Roshna"<example.gimail.com>', // sender address
      to: user.email, // list of receivers
      subject: "KC Donation", // Subject line
      html: `<h3>Hi,</h3><h3>New item has been added in the donation list.</h3><h3>Kindly, login to website to check for more information.</h3><br>
      <h3>Thanks & Regards,</h3><h3>KC Donation</h3>`
    };
  else
    mailOptions = {
      from: '"Roshna"<example.gimail.com>', // sender address
      to: user.email, // list of receivers
      subject: "KC Donation", // Subject line
      html: `<h4>Hi,</h4><h4>You new password is: <strong>${user.randomNum}</strong></h4>
      <h4>Thanks & Regards,</h4><h4>KC Donation</h4>`
    };
  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions);

  callback(info);
}
