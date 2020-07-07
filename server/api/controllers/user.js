const User = require('../../models/user');
const userMail = require('./mail');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pass_generator = require('generate-password');
// const passport = require('passport');
const crypto = require('crypto');


function tbStoreImage({ image, path }) {
  image = image.replace(new RegExp(' ', 'g'), '+');
  var data = image.replace(/^data:image\/\w+;base64,/, "");
  var buf = new Buffer(data, 'base64');
  fs.writeFile(path, buf, function (err) {
    if (err) throw err;
  });
}

function tbGetImage(path) {
  fs.readFile(path, (err, image) => {
    if (err)
      return null;
    console.log(image);
    return image;
  });
}

class UserController {

  static login(req, res) {
    var data = {
      email: req.user['_json'].email,
      firstName: req.user['_json'].given_name,
      lastName: req.user['_json'].family_name,
      picture: req.user['_json'].picture
    };
    User.find(data, (err, user) => {
      if (err) {
        return res.json({
          status: 404,
          message: err
        });
      } else if (user && user.length != 0) {
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
            firstName: user.first_name
          },
          process.env.JWT_KEY
        );
        res.redirect(`${process.env.DEV_WEBSITE}/auth/google/redirect?token=${token}`);
      } else {
        User.add(data, (err, newUser) => {
          if (err)
            return res.json({
              status: 404,
              message: err,
            });
          const token = jwt.sign(
            {
              id: newUser.id,
              email: newUser.email,
              firstName: newUser.first_name
            },
            process.env.JWT_KEY,
          );
          res.redirect(`${process.env.DEV_WEBSITE}/auth/google/redirect?token=${token}`);
        });
      }
    });
  }
}

module.exports = UserController;