import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setLogin } from "../redux/slice/userSlice";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          return "Email is required";
        }
        if (!emailRegex.test(value.trim())) {
          return "Please enter a valid email address";
        }
        return "";
      case "password":
        if (!value) {
          return "Password is required";
        }
        if (value.length < 8) {
          return "Password must be at least 8 characters long";
        }
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
    setSubmitError(null);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, formData[name]),
    }));
  };

  const validateForm = () => {
    const newErrors = {
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    // Mark all fields as touched
    setTouched({
      email: true,
      password: true,
    });

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:9999/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        // Extract error message from HTML response if present
        const errorMatch = text.match(/<pre>Error: ([^<]+)/);
        throw new Error(errorMatch?.[1] || "Invalid email or password");
      }

      if (!response.ok) {
        throw new Error(data?.message || "Invalid email or password");
      }

      if (data.token && data.user) {
        localStorage.setItem("token", data.token);
        dispatch(
          setLogin({
            user: data.user,
            token: data.token,
          })
        );
        navigate("/");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      setSubmitError(error.message);
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="text-3xl text-center my-7 font-semibold">Sign In</h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        {submitError && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg text-center">
            {submitError}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <input
            type="email"
            placeholder="Email"
            name="email"
            className={`p-3 rounded-lg border focus:outline-none focus:ring-2 ${
              errors.email && touched.email
                ? "border-red-500 focus:ring-red-200"
                : "focus:ring-slate-300"
            }`}
            required
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.email && touched.email && (
            <span className="text-red-500 text-sm">{errors.email}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <input
            type="password"
            placeholder="Password"
            name="password"
            className={`p-3 rounded-lg border focus:outline-none focus:ring-2 ${
              errors.password && touched.password
                ? "border-red-500 focus:ring-red-200"
                : "focus:ring-slate-300"
            }`}
            required
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.password && touched.password && (
            <span className="text-red-500 text-sm">{errors.password}</span>
          )}
        </div>

        <button
          type="submit"
          className="bg-slate-700 rounded-lg p-3 text-white uppercase hover:opacity-95 disabled:opacity-80 transition duration-200"
          disabled={loading || Object.keys(errors).some((key) => errors[key] && touched[key])}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="mt-5 flex gap-2">
        <p>Don't have an account?</p>
        <Link to={"/register"}>
          <span className="text-blue-700 hover:underline">Sign Up</span>
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
