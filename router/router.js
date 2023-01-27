const express = require("express");
const { append } = require("express/lib/response");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// miidelwhere auth
const auth = require("../middleware/auth");

///database
require("../config/logindtabase");
require("../config/FeedBack");

//schema (model)
const logindata = require("../model/loginschema");
const feedData = require("../model/FeedBackModel");

router.get("/", (req, res) => {
  res.render("sign");
});

router.get("/sign", (req, res) => {
  res.render("sign");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/about", auth, (req, res) => {
  res.render("about");
});

router.get("/team", auth, (req, res) => {
  res.render("team");
});

router.get("/gallery", auth, (req, res) => {
  res.render("gallery");
});

router.get("/achievement", auth, (req, res) => {
  res.render("achievement");
});

router.get("/main", auth, (req, res) => {
  res.status(200).render("main");
});

router.get("/paststudent", auth, (req, res) => {
  res.render("paststudent");
});

router.get("/presentstudent", auth, (req, res) => {
  res.render("presentstudent");
});

router.get("/userpage", auth, async (req, res) => {
  // let loginecode = jwt.decode(req.cookies.ragisteruserdata)
  const cookie = req.cookies.loginusercoockie;
  const verfyuser = jwt.verify(cookie, process.env.LOGINUSERSERCRETKEY);
  const verfyuserdata = await logindata.findOne({ _id: verfyuser.user_id });

  if (!verfyuser || !verfyuserdata) {
    res.redirect("/login");
  }

  res.status(200).render("userpage", { datas: verfyuserdata });
});

router.get("/contect", (req, res) => {
  res.render("contect");
});

router.get("/feedback", async (req, res) => {
  const cookie = req.cookies.loginusercoockie;
  const verfyuser = await jwt.verify(cookie, process.env.LOGINUSERSERCRETKEY);
  const verfyuserdata = await logindata.findOne({ _id: verfyuser.user_id });

  if (!verfyuser || !verfyuserdata) {
    res.redirect("/login");
  }

  res.status(200).render("feedback", { datas: verfyuserdata });
});

router.get("/thought", (req, res) => {
  res.render("thought");
});

// Signin

router.post("/sign", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("Body", req.body);
    if (!username || !email || !password) {
      req.session.message = {
        type: "primary",
        intro: "!",
        message: "All field required.",
      };
    }

    const oldUser = await logindata.findOne({ email: email });

    if (oldUser) {
      req.session.message = {
        type: "danger",
        intro: "user exists! ",
        message: " user already exists Login.",
      };
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const allloginuserdata = await logindata.create({
      username,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    const token = jwt.sign(
      { id: allloginuserdata._id, username, email },
      process.env.LOGINUSERSERCRETKEY
    );

    const coo = req.cookies.ragisteruserdata;
    const de = jwt.verify(coo, process.env);

    res.cookie("ragisteruserdata", token);

    allloginuserdata.token = token;

    req.session.message = {
      type: "success",
      intro: "Done! ",
      message: "user add successfully..",
    };

    res.status(201).redirect("/login");
  } catch (err) {
    console.log("er", err);
    // res.status(400).redirect("/sign");
    res.status(400).send({ message: "Not valid data" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await logindata.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.LOGINUSERSERCRETKEY
      );
      res.cookie("loginusercoockie", token);
      res.redirect("/main");
    } else {
      req.session.message = {
        type: "danger",
        intro: "! ",
        message: " data is  incorrect  plase check email or.",
      };
      res.redirect("/login");
    }
  } catch (err) {
    console.log("er", err);
    // res.redirect("/sign");
    res.status(400).send({ message: "Not valid data" });
  }
});

router.get("/logout", auth, (req, res) => {
  try {
    res.clearCookie("loginusercoockie");
    res.redirect("/login");
  } catch (err) {
    console.log("er", err);
    console.log(er);
  }
});

// FeedBack Route

router.post("/feedback", async (req, res) => {
  try {
    const { email, comment } = req.body;
    const allFeedData = new feedData({
      email,
      comment,
    });
    if (allFeedData) {
      await allFeedData.save();
      res.redirect("/feedback");
    }
  } catch (err) {
    res.status(404);
  }
});
module.exports = router;
