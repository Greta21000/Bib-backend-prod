const express = require("express");
const router = express.Router();

const checkAuth = require("../auth/check-auth")

const musiquesControllers = require("../controllers/musiques-controllers");

router.get("/", musiquesControllers.getMusiques);

router.use(checkAuth);
router.get("/:musiqueid", musiquesControllers.getMusiqueById);
router.post("/", musiquesControllers.createMusique);
router.patch("/:musiqueid", musiquesControllers.updateMusique )
router.delete("/:musiqueid", musiquesControllers.deleteMusique);

module.exports = router;
