import express from "express"
import passport from "passport"
import multer from "multer"
import { register, login, uploadProfile } from "../controller/auth.controller.js"

const router = express.Router()

// Configure multer for both file uploads and form data
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  preservePath: true
})

// Route to start Google authentication
router.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}))

// Callback route for Google to redirect to
router.get("/google/callback", passport.authenticate("google", {
  failureRedirect: "/login" // Redirect to login if authentication fails
}), (req, res) => {
  // Successful authentication, redirect to your desired route
  res.redirect("/") // Change this to your desired route after login
})

// Profile image upload route
router.post("/upload-profile", upload.single('profileImage'), uploadProfile)

// Registration route with form data handling
router.post("/register", upload.single('profileImage'), register)

// Login route
router.post("/login", login)

export default router
