const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const HttpError = require("../utils/http-error");

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    const err = new HttpError("Erreur lors du signup. Merci de réessayer", 500);
    return next(err);
  }

  if (existingUser) {
    const error = new HttpError("Utilisateur déjà existant", 422);
    return next(error);
  }

  let hashPassword;
  try {
    hashPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    const err = new HttpError("Erreur lors du signup. Merci de réessayer", 500);
    return next(err);
  }

  const createdUser = new User({
    email,
    password: hashPassword,
  });

  try {
    await createdUser.save();
  } catch (error) {
    const err = new HttpError("Erreur lors du signup. Merci de réessayer", 500);
    return next(err);
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: createdUser.id,
        email: createdUser.email,
      },
      process.env.CLEF_JWT,
      { expiresIn: "1h" }
    );
  } catch (error) {
    const err = new HttpError(
      "Erreur de login (librairie jwt). Merci de réessayer", // mot de pass invalide
      500
    );
    return next(err);
  }

  res.json({
    userId: createdUser.id,
    email: createdUser.email,
    token: token,
  });

};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    const err = new HttpError(
      "Pb réseau. Echec de login. Merci de réessayer",
      500
    );
    return next(err);
  }

  if (!existingUser) {
    const error = new HttpError("Identification impossible", 403);
    return next(error);
  }

  console.log(existingUser);

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    const err = new HttpError(
      "Pb bcrypt. Echec de login. Merci de réessayer", // mot de pass invalide
      500
    );
    return next(err);
  }

  if (!isValidPassword) {
    // mot de passe invalide
    const err = new HttpError(
      "Identifiants incorrects", // mot de pass invalide
      403
    );
    return next(err);
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
      },
      process.env.CLEF_JWT,
      { expiresIn: "1h" }
    );
  } catch (error) {
    const err = new HttpError(
      "Erreur de login (librairie jwt). Merci de réessayer", // mot de pass invalide
      500
    );
    return next(err);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};

exports.signup = signup;
exports.login = login
