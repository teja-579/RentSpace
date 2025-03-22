import mongoose from "mongoose"
import dotenv from "dotenv"
import User from "../models/user.model.js"

dotenv.config()

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB")
    try {
      const user = await User.findOne({ email: "david.wilson@example.com" })
      if (user) {
        console.log("User found:", {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          hasPassword: !!user.password,
          profileImagePath: user.profileImagePath,
        })
      } else {
        console.log("User not found")
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      mongoose.connection.close()
    }
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err)
  })
