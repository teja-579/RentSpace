import express from "express"
import { createBooking } from "../controller/bookingDisabled.controller.js"

const router = express.Router()

router.post("/create", createBooking)

export default router
