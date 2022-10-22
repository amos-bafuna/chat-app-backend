const passport = require("passport");

const restrictor = passport.authenticate("jwt", { session: false });

module.exports = restrictor;
