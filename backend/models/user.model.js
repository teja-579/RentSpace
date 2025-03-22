import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^\d{10}$/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
      },
    },

    profileImagePath: {
      type: String,
      default: "",
    },

    tripList: {
      type: Array,
      default: [],
    },

    wishList: {
      type: Array,
      default: [],
    },

    propertyList: {
      type: Array,
      default: [],
    },

    reservationList: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
)

const User = mongoose.model("User", userSchema)

export default User
