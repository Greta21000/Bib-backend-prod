const express = require("express");
const router = express.Router();
const { check } = require('express-validator');

const usersControllers = require("../controllers/users-controllers");

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .notEmpty(),
    check("password")
        .notEmpty()
        .isLength({ min: 6 })
  ],
  usersControllers.signup
);

router.post("/login", usersControllers.login)

module.exports = router;
