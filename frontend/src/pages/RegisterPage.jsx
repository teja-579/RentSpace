import React, { useEffect, useState } from "react"
import uploadProfilePic from "../assets/upload.png"
import { Link, useNavigate } from "react-router-dom"

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [profileImage, setProfileImage] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [passwordMatch, setPasswordMatch] = useState(true)
  const [success, setSuccess] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    setPasswordMatch(
      formData.password === formData.confirmPassword ||
        formData.confirmPassword === ""
    )
  }, [formData.password, formData.confirmPassword])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    // Clear any previous errors when user starts typing
    setError(null)
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordMatch(
        name === 'password' 
          ? value === formData.confirmPassword
          : formData.password === value
      )
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("Profile image must be less than 5MB")
        return
      }
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
      if (!allowedTypes.includes(file.type)) {
        setError("Please upload a valid image file (JPEG, PNG, or GIF)")
        return
      }
      setProfileImage(file)
      setError(null)
    }
  }

  const validateForm = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.password) {
      setError("All fields are required")
      return false
    }

    const phoneRegex = /^[0-9]{10}$/
    if (!phoneRegex.test(formData.phone.trim())) {
      setError("Please enter a valid 10-digit phone number")
      return false
    }

    if (!passwordMatch) {
      setError("Passwords do not match")
      return false
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email.trim())) {
      setError("Please enter a valid email address")
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!validateForm()) {
      return
    }
    console.log("Phone Number:", formData.phone);
    setLoading(true)

    try {
      // Send the registration data
      const formDataToSend = new FormData()
      formDataToSend.append('firstName', formData.firstName.trim())
      formDataToSend.append('lastName', formData.lastName.trim())
      formDataToSend.append('email', formData.email.trim().toLowerCase())
      formDataToSend.append('phone', formData.phone.trim())
      formDataToSend.append('password', formData.password)
      if (profileImage) {
        formDataToSend.append('profileImage', profileImage)
      }

      const response = await fetch("http://localhost:9999/api/auth/register", {
        method: "POST",
        body: formDataToSend,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }

      setSuccess(true)

      // Clear form data on success
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",

      })
      setProfileImage(null)
      
      // Wait a moment to show success message before redirecting
      setTimeout(() => {
        navigate("/login")
      }, 1500)
    } catch (error) {
      setError(error.message)
      console.error("Registration error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="text-3xl text-center my-7 font-semibold">Sign Up</h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-600 p-3 rounded-lg text-center">
            Registration successful! Redirecting to login...
          </div>
        )}

        <div className="flex flex-col items-center gap-2">
          <img
            src={profileImage ? URL.createObjectURL(profileImage) : uploadProfilePic}
            alt="profile"
            className="w-24 h-24 object-cover rounded-full border-2 border-slate-200"
          />
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif"
            onChange={handleImageChange}
            className="hidden"
            id="profileImage"
          />
          <label
            htmlFor="profileImage"
            className="cursor-pointer text-slate-700 hover:underline"
          >
            Upload Profile Picture (Optional)
          </label>
        </div>

        <input
          type="text"
          placeholder="First Name"
          name="firstName"
          className="p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-slate-300"
          value={formData.firstName}
          onChange={handleChange}
          required
          minLength="2"
          maxLength="50"
          pattern="[A-Za-z\s]+"
          title="Please enter a valid first name (letters only)"
        />

        <input
          type="text"
          placeholder="Last Name"
          name="lastName"
          className="p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-slate-300"
          required
          value={formData.lastName}
          onChange={handleChange}
          minLength="2"
          maxLength="50"
          pattern="[A-Za-z\s]+"
          title="Please enter a valid last name (letters only)"
        />

        <input
          type="email"
          placeholder="Email"
          name="email"
          className="p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-slate-300"
          required
          value={formData.email}
          onChange={handleChange}
pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
          title="Please enter a valid email address"
        />

        <input
          type="tel"
          placeholder="Phone Number"
          name="phone"
          className="p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-slate-300"
          required
          value={formData.phone}
          onChange={handleChange}
          pattern="[0-9]{10}"
          title="Please enter a 10-digit phone number"
        />

        <input
          type="password"
          placeholder="Password"
          name="password"
          className="p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-slate-300"
          required
          value={formData.password}
          onChange={handleChange}
          minLength="8"
          title="Password must be at least 8 characters long"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          className="p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-slate-300"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        {!passwordMatch && (
          <p className="text-red-500 text-sm">Passwords do not match</p>
        )}

        <button
          type="submit"
          className="bg-slate-700 rounded-lg p-3 text-white uppercase hover:opacity-95 disabled:opacity-80 transition duration-200"
          disabled={!passwordMatch || loading}
        >
          {loading ? "Creating Account..." : "Register"}
        </button>
      </form>

      <div className="mt-5 flex gap-2">
        <p>Already have an account?</p>
        <Link to={"/login"}>
          <span className="text-blue-700 hover:underline">Sign in</span>
        </Link>
      </div>
    </div>
  )
}

export default RegisterPage
