const express = require("express");
const passport = require("passport");
const router = express.Router();

// Start GitHub login
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

// Callback after login with GitHub
router.get("/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    res.json({ success: true, message: "Login sucessfully!", user: req.user });
  }
);

// Logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.json({ success: true, message: "Logout sucessfully!" });
  });
});

module.exports = router;
