import express from "express";
import mongoose from "mongoose";

import User from "../models/user.js";
import UserProfile from "../models/UserProfile.js"; // for profile completion
import { createOrUpdateProfile, getProfile, loginUser, registerCounselor, registerUser } from "../controller/authController.js";
import verifyJWT from "../middleware/authMiddleware.js";


const router = express.Router();

// Create user (signup)


router.post("/signup",registerUser);
// router.post("/signup", async (req, res) => {
//   const { email, password, role } = req.body;
//   try {
//     const newUser = new User({ email, password, role });
//     await newUser.save();
//     res.status(201).json({ message: "User created", user: newUser }); // <-- here
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Signup failed" });
//   }
// });


// Complete profile
router.post('/login',loginUser)

// router.patch('/completeProfile',createOrUpdateProfile)
router.route('/completeProfile').patch(verifyJWT, createOrUpdateProfile).get(verifyJWT, getProfile);









// router.post('/complete-profile', async (req, res) => {
//   try {
//     const { userId, ...profileData } = req.body;
    
//     const newProfile = new UserProfile({
//       userId,
//       ...profileData
//     });
    
//     await newProfile.save();
//     res.status(201).json({ message: 'Profile completed', profile: newProfile });
//   } catch (error) {
//     console.error('Profile completion error:', error);
//     res.status(500).json({ error: 'Failed to save profile' });
//   }
// });

// Get user profile by userId
// GET profile by userId
// GET user profile by userId

// GET user profile by userId

 router.get('/profile/:userId',getProfile)
// router.get('/profile/:userId', async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const profile = await UserProfile.findOne({ userId: new mongoose.Types.ObjectId(userId) });

//     if (!profile) {
//       console.log("No profile found for userId:", userId);
//       return res.status(404).json({ message: 'Profile not found' });
//     }

//     console.log("Fetched profile from DB:", profile);
//     res.json(profile);
//   } catch (error) {
//     console.error('Error fetching profile:', error);
//     res.status(500).json({ error: 'Failed to fetch profile' });
//   }
// });






export default router;
