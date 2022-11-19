const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const config = require('../config');

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
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(() =>
          res.status(400).json({ message: 'Something went wrong !' })
        );
    })
    .catch((error) =>
      res.status(500).json({ message: 'Something went wrong!' })
    );
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        res.status(401).json('Email ou mot de passe incorrect');
      } else {
        const payload = {
          id: user.id,
          email: user.email,
          name: user.firstName + ' ' + user.lastName,
          expire: Date.now() + 1000 * 60 * 60 * 24 * 7,
        };
        const token = jwt.encode(payload, config.secretKey);

        bcrypt
          .compare(req.body.password, user.password)

          .then((valid) => {
            if (!valid) res.status(401).json('Mot de passe incorrect');
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

exports.users = (req, res, next) => {
  User.find().then((users) => {
    if (!users) {
      res.status(401).json('Something went wrong');
    } else {
      res.status(200).json(
        users.map((user) => ({
          id: user._id,
          name: user.userName,
          lastName: user.lastName,
        }))
      );
    }
  });
};

exports.user = (req, res, next) => {
  User.findOne({ _id: req.body.userId })
    .then((user) => {
      if (!user) {
        res.status(401).json('Something went wrong');
      } else {
        res.status(200).json(user);
      }
    })
    .catch(() => res.status(401).json('Something went wrong'));
};
