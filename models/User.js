const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    uid: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: Array, requied: false },
    phone: { type: String, required: false },
    userType: {
      type: String,
      required: true,
      default: "Client",
      enum: ["Admin", "Driver", "Client", "Vendor"],
    },
    profile: {
      type: String,
      requied: true,
      default:
        "https://d326fntlu7tb1e.cloudfront.net/uploads/b5065bb8-4c6b-4eac-a0ce-86ab0f597b1e-vinci_04.jpg",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
