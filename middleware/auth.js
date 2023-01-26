const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const loginuserdata = require('../model/loginschema');
const express = require('express');

const auth = (req, res, next) => {
  // const token = req.cookies.ragisteruserdata;
  const token = req.cookies.loginusercoockie;
  if (!token) {
    res.status(404).send(
           `
            <div style="height:100vh ; width:100%; display:flex; align-items: center; justify-content: center; flex-direction: column;">
            <img src="/img/error.jpg" alt="">    
            <p>you need both token for access this page...</p> 
            <h2>plase sign in agin </h2> 
            <a style="" href="/sign"> <button style="cursor: pointer;padding:15px; background:black; color:white;">Sign in</button></a>
            </div>
            `
    );
  }
  try {
    const decode = jwt.verify(token, process.env.LOGINUSERSERCRETKEY);
    req.allloginuserdata = decode;
  } catch (err) {
    res.status(400);
  }
  return next();
};

module.exports = auth;
