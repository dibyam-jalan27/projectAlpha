const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    maxLength: [30, "Your name cannot exceed 30 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: [validator.isEmail, "Please enter valid email address"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [6, "Your password must be longer than 6 characters"],
    select: false,
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  difficulty:{
    easy:{
      type: Number,
      default: 0,
    },
    medium:{
      type: Number,
      default: 0,
    },
    hard:{
      type: Number,
      default: 0,
    }
  },
  verdicts:{
    ACcount: {
      type: Number,
      default: 0,
    },
    WAcount: {
      type: Number,
      default: 0,
    },
    TLEcount: {
      type: Number,
      default: 0,
    },
    REcount: {
      type: Number,
      default: 0,
    },
    MLEcount: {
      type: Number,
      default: 0,
    },
    CEcount: {
      type: Number,
      default: 0,
    },
    RTEcount: {
      type: Number,
      default: 0,
    },
    tags:{
      "Binary Search":{
        type: Number,
        default: 0,
      },
      "Bitmasks":{
        type: Number,
        default: 0,
      },
      "Bruteforce":{
        type: Number,
        default: 0,
      },
      "Combinatorics":{
        type: Number,
        default: 0,
      },
      "Constructive Algorithms":{
        type: Number,
        default: 0,
      },
      "Data Structures":{
        type: Number,
        default: 0,
      },
      "DFS and Similar":{
        type: Number,
        default: 0,
      },
      "Divide and Conquer":{
        type: Number,
        default: 0,
      },
      "Dynamic Programming":{
        type: Number,
        default: 0,
      },
      "DSU":{
        type: Number,
        default: 0,
      },
      "Flows":{
        type: Number,
        default: 0,
      },
      "Games":{
        type: Number,
        default: 0,
      },
      "Graphs":{
        type: Number,
        default: 0,
      },
      "Greedy":{
        type: Number,
        default: 0,
      },
      "Implementation":{
        type: Number,
        default: 0,
      },
      "Math":{
        type: Number,
        default: 0,
      },
      "Number Theory":{
        type: Number,
        default: 0,
      },
      "Shortest Paths":{
        type: Number,
        default: 0,
      },
      "Sortings":{
        type: Number,
        default: 0,
      },
      "Ternary Search":{
        type: Number,
        default: 0,
      },
      "Trees":{
        type: Number,
        default: 0,
      },
      "Two Pointers":{
        type: Number,
        default: 0,
      },
    }
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//JWT Token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

//Compare user password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
  //Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  //Hash and set to resetPasswordToken
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //Set token expire time
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
