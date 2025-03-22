import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { errorHandler } from "../utils/error.js"

export const uploadProfile = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(errorHandler(400, "No file uploaded"))
    }

    // Return the base64 encoded image
    const profileImagePath = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
    res.status(200).json({ 
      success: true,
      path: profileImagePath
    })
  } catch (error) {
    console.error("Profile upload error:", error)
    next(errorHandler(500, "Error uploading profile image"))
  }
}

export const register = async (req, res, next) => {
  try {
    console.log("=== Registration Attempt ===")
    console.log("Request body:", req.body)
    console.log("Request file:", req.file) // Log the uploaded file
    
    // Extract form data from request
    const { firstName, lastName, email, phone, password } = req.body
    const profileImage = req.file

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      console.log("Missing required fields:", { 
        hasFirstName: !!firstName, 
        hasLastName: !!lastName, 
        hasEmail: !!email, 
        hasPassword: !!password 
      })
      return next(errorHandler(400, "All fields are required"))
    }

    if (password.length < 8) {
      console.log("Password too short:", password.length)
      return next(errorHandler(400, "Password must be at least 8 characters long"))
    }

    // Log the phone number for debugging
    console.log("Phone Number:", phone);

    // Check if user already exists
    console.log("Checking for existing user with email:", email)
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      console.log("User already exists with email:", email)
      return next(errorHandler(409, "Email already registered"))
    }
    console.log("No existing user found with this email")

    // Set default profile image path
    let profileImagePath = "uploads/default-profile.png"
    
    // If a file was uploaded, use its buffer to save to database
    if (req.file) {
      profileImagePath = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
      console.log("Using uploaded profile image")
    } else {
      console.log("Using default profile image")
    }

    // Hash password
    console.log("Hashing password...")
    const hashedPassword = bcryptjs.hashSync(password, 10)
    console.log("Hashed password:", hashedPassword)

    // Create new user
    console.log("Creating new user object...")
    const newUser = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: hashedPassword,
      profileImagePath,
    })

    console.log("New user object created:", {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      phone: newUser.phone,
      profileImagePath: newUser.profileImagePath
    })

    // Save user to database
    console.log("Attempting to save user to database...")
    await newUser.save()
    console.log("User saved successfully")

    // Create JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET)

    // Return success response with user data (excluding password)
    const { password: pass, ...rest } = newUser._doc

    console.log("Sending success response...")
    res.status(201).json({ 
      success: true,
      message: "Registration successful",
      token,
      user: rest
    })
    console.log("=== Registration Complete ===")
  } catch (error) {
    console.error("Registration error details:", error)
    next(errorHandler(500, "Error during registration. Please try again."))
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return next(errorHandler(400, "Email and password are required"))
    }

    // Find user by email and log the email being searched
    console.log("Searching for user with email:", email)
    const user = await User.findOne({ email: email.toLowerCase().trim() })
    console.log("User found:", user)
    if (!user) {
      return next(errorHandler(404, "Invalid credentials"))
    }

    // Check password
    const validPassword = await bcryptjs.compare(password, user.password)
    if (!validPassword) {
      return next(errorHandler(401, "Invalid credentials"))
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

    // Return success response with user data (excluding password)
    const { password: pass, ...rest } = user._doc

    res.status(200).json({ 
      success: true,
      message: "Login successful",
      token,
      user: rest
    })
  } catch (error) {
    console.error("Login error:", error)
    next(errorHandler(500, "Error during login. Please try again."))
  }
}