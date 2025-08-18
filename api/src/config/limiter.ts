import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: parseInt(process.env.TIME_LIMIT) * 60 * 1000,
  max: parseInt(process.env.LIMIT),
  message: "Too many requests, please try again later."
})