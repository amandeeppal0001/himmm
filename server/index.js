import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js"; // Updated
import cookieParser from "cookie-parser";
import { GoogleGenAI } from "@google/genai";

// import {exploreCollegeRoutes} from "./routes/exploreCollegeRoutes.js";
dotenv.config();
const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // React dev server
  methods: ["GET","POST","PUT","DELETE","OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type","Authorization"]
}));
app.use(express.json());
app.use(cookieParser());
// Handle preflight requests
app.options("*", cors());

// Routes
app.use("/api/users", userRoutes); // All user routes now in users.js

// app.use('/api/colleges', interviewRoutes);
// app.use('/api/colleges', exploreCollegeRoutes);
// if (!process.env.GEMINI_API_KEY) {
//   throw new Error("GEMINI_API_KEY is not defined in the .env file.");
// }

// const ai = new GoogleGenAI({});

// // async function main() {
// //      const main = async (prompt) => {
// //   const response = await ai.models.generateContent({
// //     model: "gemini-2.5-flash",
// //     contents: `${prompt}`,
// //     config: {
// //       thinkingConfig: {
// //         thinkingBudget: 0, // Disables thinking
// //       },
// //     }
// //   });
// //   console.log(response.text);
// //   return(response.text);
  
// // }
// // export default main;
// // const ai = new GoogleGenAI({
// //   apiKey: import.meta.env.VITE_GEMINI_KEY, // Your Gemini key
// // });
//      const main = async (prompt) => {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: `${prompt}`,
//     config: {
//       thinkingConfig: {
//         thinkingBudget: 0, // Disables thinking
//       },
//     }
//   });
//   console.log(response.text);
//   return(response.text);
  
// }
// export default main;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Start server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running   ooon port ${PORT}`));
