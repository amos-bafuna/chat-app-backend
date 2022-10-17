const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  userName: { type: String },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String },
  profil: { type: String },
  password: { type: String },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
