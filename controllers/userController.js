const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jwt-simple");
const config = require("../config");

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        userName: req.body.name,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        profil: req.body.profil,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) =>
          res.status(400).json({ message: "Something went wrong !" })
        );
    })
    .catch((error) =>
      res.status(500).json({ message: "Something went wrong!" })
    );
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        res.status(401).json("mail or username incorect");
      } else {
        const payload = {
          id: user.id,
          name: user.firstName + " " + user.lastName,
          expire: Date.now() + 1000 * 60 * 60 * 24 * 7,
        };
        const token = jwt.encode(payload, config.secretKey);

        bcrypt
          .compare(req.body.password, user.password)

          .then((valid) => {
            if (!valid) res.status(401).json("invalid password or username");
            else {
              delete user.password;
              res.status(200).json({
                userId: user.id,
                token: `Bearer ${token}`,
              });
            }
          });
      }
    })
    .catch((err) => res.status(500).json(err));
};
