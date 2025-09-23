import User  from '../models/user.js';
// import {Counselor} from '../models/Counselor.model.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import {json} from "express";
import { asyncHandler } from '../utils/asyncHandler.js'
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import UserProfile from '../models/UserProfile.js';

// import { Counselor } from '../models/Counselor.model.js';
const generateAccessAndRefereshTokens = async(userId) =>{
    try{
        const user = await User.findById(userId)    
        const accessToken = user.generateAccessToken() // see function in user.model
        console.log(accessToken)
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken   // save refresh token on the server but not save access token on server
        await user.save({ validateBeforeSave: false })   // save on server without any validation or any field which is required but not send due to this it will save any how
     return {accessToken, refreshToken}  // retrunr tokens to client with containing the proper document from server
    }

    catch(error) {
        console.log(error);
        throw new ApiError(500, "something went wrong while generating access token & refresh token",error) 
    }
}

export const registerUser = asyncHandler(async (req, res) => {
    // UNCOMMENT THIS BLOCK TO FIX THE ERROR
    const { name, email, password, role } = req.body; // <-- ADDED 'role' HERE
    
    if([name, email, password, role].some(field => field?.trim() === "")) { // <-- ADDED 'role' HERE
        throw new ApiError(400, "All fields are required");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'This email is already registered. Please use a different email or try logging in.' });
    }
    
    // The rest of your code is correct, assuming you've incorporated the fixes from the previous response.
    const user = await User.create({ name, email, password, role }); // <-- ADDED 'role' HERE
    
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user");
    }
    
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200, {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                }
            )
        );
});



// export const createOrUpdateProfile = asyncHandler(async (req, res) => {
//   try {
//     const { userId, ...profileData } = req.body;
//     
//     const newProfile = new UserProfile({
//       userId,
//       ...profileData
//     });
//     
//     await newProfile.save();
//     res.status(201).json({ message: 'Profile completed', profile: newProfile });
//   } catch (error) {
//     console.error('Profile completion error:', error);
//     res.status(500).json({ error: 'Failed to save profile' });
//   }
// });


export const createOrUpdateProfile = asyncHandler(async (req, res) => {
    const {  ...profileData } = req.body;
    const userId = req.user._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized: No user ID provided.");
    }

    // Find the user and update their profile fields
    const updatedUser = await UserProfile.findByIdAndUpdate(
        userId,
        {
            ...profileData
        },
        { new: true, upsert: true,  runValidators: true } // `new: true` returns the updated document
    ).select('-password -refreshToken');

    if (!updatedUser) {
        throw new ApiError(404, "User not found.");
    }

    res.status(200).json(new ApiResponse(200, updatedUser, "Profile updated successfully."));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
    if(!email){
    throw new ApiError(400, "email is required")
  }
  
    let user = await User.findOne({ email });
    // if (user && (await user.matchPassword(password))) {
    //   res.json({
    //     _id: user._id,
    //     name: user.name,
    //     email: user.email,
    //     token: generateToken(user._id),
    //   });
    // } else {
    //   res.status(401).json({ error: 'Invalid email or password' });
    // }

        if (!user) {
       throw  new ApiError(404,"User does not exist")
    }
      const isPasswordValid = await user.matchPassword(password)
    if(!isPasswordValid){   
        throw new ApiError(401, "Invalid credentials")
    }
    
        const {accessToken,refreshToken}= await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        const options = {  //Instead of repeating attributes for each cookie() call, you define them once in the options object, making the code DRY (Don't Repeat Yourself). // reusability adds also.
        httpOnly: true, //This is a crucial security feature to mitigate cross-site scripting (XSS) attacks.
        secure: true,  //The secure attribute ensures the cookie is only sent over HTTPS, never over unencrypted HTTP connections.// This protects the cookie from being intercepted by attackers via man-in-the-middle (MITM) attacks on unencrypted connections.
        sameSite: "none"
    }


     return res
     .status(200)
     .cookie("accessToken", accessToken, options)
     .cookie( "refreshToken", refreshToken, options)
     .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,accessToken, refreshToken
            }
        )
     )




});


 export const registerCounselor = asyncHandler(async (req, res) => {
  const { name, email, password, role, specializations, bio, availability } = req.body;
        if([name,email, password ].some((field)=>
    field?.trim() === "")) {
        throw new ApiError(400, "all fields are required")
    }
    let existedUser = await User.findOne({ email });
    if(existedUser){
        throw new ApiError(409, " user with this email or userName  already exists")
    }

  const user = await User.create({ name, email, password, role: "counselor" });
  const createdUser = await User.findById(user._id).select("-password -refreshToken")

      if(!createdUser){
        throw new ApiError(500, "something went wrong while registering user")
      }

  const counselor = await Counselor.create({
    user: user._id,
    specializations,
    bio,
    availability
  });

  res.status(201).json(new ApiResponse(201, { user, counselor }, "Counselor registered successfully"));
});

export const logoutUser = asyncHandler(async (req, res) => {
    // Update refresh token to undefined in the database
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: { 
                 refreshToken: 1   // this removes the field from document
            },
        },
        {
            new: true, // Return the updated document
        }
    );

    // Define cookie options
    const options = {
        httpOnly: true,
        secure: true, // Set true if using HTTPS
        sameSite: "none"
    };

    // Clear cookies and send a success response
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export const getProfile = asyncHandler(  async (req, res) => {
  try {
    const { userId } = req.params;

    const profile = await UserProfile.findOne({ userId: new mongoose.Types.ObjectId(userId) });

    if (!profile) {
      console.log("No profile found for userId:", userId);
      return res.status(404).json({ message: 'Profile not found' });
    }

    console.log("Fetched profile from DB:", profile);
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

export const refreshAccessToken = asyncHandler(async(req, res) => {
const incomingRefreshToken = req.cookies.
refreshToken || req.body.refreshToken // last part  after || is for mobile users 

if(!incomingRefreshToken){
    throw new ApiError(401, "unauthorized request")
}
try {
    const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    )


    const user = await User.findById(decodedToken?._id)
    if(!user){
        throw new ApiError(401, "Invalid refresh token")
    }
    
    if(incomingRefreshToken !== user?.refreshToken){
        throw new ApiError(401, "Refresh token is expired or used")
    }
    
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none"
         }
    
         const {accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)
    
         return res.status(200)
         .cookie("accessToken", accessToken, options)
         .cookie("refreshToken", newRefreshToken, options)
         .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken: newRefreshToken},
                "Access token is refreshed"
            )
         )
} catch (error) {
    throw new ApiError(401, error?.message || 
        "Invalid refresh token"
    )
}
})


































































































// import User  from '../models/user.js';
// // import {Counselor} from '../models/Counselor.model.js'
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import mongoose from 'mongoose';
// import {json} from "express";
// import { asyncHandler } from '../utils/asyncHandler.js'
// import {ApiError} from "../utils/ApiError.js"
// import { ApiResponse } from "../utils/ApiResponse.js";

// // import { Counselor } from '../models/Counselor.model.js';
// const generateAccessAndRefereshTokens = async(userId) =>{
//     try{
//         const user = await User.findById(userId)    
//         const accessToken = user.generateAccessToken() // see function in user.model
//         console.log(accessToken)
//         const refreshToken = user.generateRefreshToken()
//         user.refreshToken = refreshToken   // save refresh token on the server but not save access token on server
//         await user.save({ validateBeforeSave: false })   // save on server without any validation or any field which is required but not send due to this it will save any how
//      return {accessToken, refreshToken}  // retrunr tokens to client with containing the proper document from server
//     }

//     catch(error) {
//         console.log(error);
//         throw new ApiError(500, "something went wrong while generating access token & refresh token",error) 
//     }
// }

// // export const registerUser = asyncHandler(async (req, res) => {
// //   const { name, email, password } = req.body;
// //   if([name,email, password].some((field)=>
// //     field?.trim() === "")) {
// //         throw new ApiError(400, "all fields are required")
// //     }
  
// //     const userExists = await User.findOne({ email });
// //     if (userExists) {
// //       return res.status(400).json({ error: 'User already exists' });
// //     }
// //     const user = await User.create({ name, email, password });
// //       const createdUser = await User.findById(user._id).select("-password -refreshToken")

// //       if(!createdUser){
// //         throw new ApiError(500, "something went wrong while registering user")
// //       }
      
// //       return res.status(201).json(
// //         new ApiResponse(200, createdUser, "User registered succesfully")
// //     )
 
// // });

// export const registerUser = asyncHandler(async (req, res) => {
//     // **UNCOMMENT THIS BLOCK TO FIX THE ERROR**
//     const { name, email, password } = req.body;
    
//     if([name, email, password].some(field => field?.trim() === "")) {
//         throw new ApiError(400, "All fields are required");
//     }

//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ error: 'This email is already registered. Please use a different email or try logging in.' });
//     }
    
//     // The rest of your code is correct, assuming you've incorporated the fixes from the previous response.
//     const user = await User.create({ name, email, password });
    
//     const createdUser = await User.findById(user._id).select("-password -refreshToken");
    
//     if (!createdUser) {
//         throw new ApiError(500, "Something went wrong while registering user");
//     }
    
//     const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

//     const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

//     const options = {
//         httpOnly: true,
//         secure: true,
//         sameSite: "none"
//     };

//     return res
//         .status(200)
//         .cookie("accessToken", accessToken, options)
//         .cookie("refreshToken", refreshToken, options)
//         .json(
//             new ApiResponse(
//                 200, {
//                     user: loggedInUser,
//                     accessToken,
//                     refreshToken
//                 }
//             )
//         );
// });



// export const createOrUpdateProfile = asyncHandler(async (req, res) => {
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


// export const loginUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;
//     if(!email){
//     throw new ApiError(400, "email is required")
//   }
  
//     let user = await User.findOne({ email });
//     // if (user && (await user.matchPassword(password))) {
//     //   res.json({
//     //     _id: user._id,
//     //     name: user.name,
//     //     email: user.email,
//     //     token: generateToken(user._id),
//     //   });
//     // } else {
//     //   res.status(401).json({ error: 'Invalid email or password' });
//     // }

//         if (!user) {
//        throw  new ApiError(404,"User does not exist")
//     }
//       const isPasswordValid = await user.matchPassword(password)
//     if(!isPasswordValid){   
//         throw new ApiError(401, "Invalid credentials")
//     }
    
//         const {accessToken,refreshToken}= await generateAccessAndRefereshTokens(user._id)

//     const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

//         const options = {  //Instead of repeating attributes for each cookie() call, you define them once in the options object, making the code DRY (Don't Repeat Yourself). // reusability adds also.
//         httpOnly: true, //This is a crucial security feature to mitigate cross-site scripting (XSS) attacks.
//         secure: true,  //The secure attribute ensures the cookie is only sent over HTTPS, never over unencrypted HTTP connections.// This protects the cookie from being intercepted by attackers via man-in-the-middle (MITM) attacks on unencrypted connections.
//         sameSite: "none"
//     }


//      return res
//      .status(200)
//      .cookie("accessToken", accessToken, options)
//      .cookie( "refreshToken", refreshToken, options)
//      .json(
//         new ApiResponse(
//             200,
//             {
//                 user: loggedInUser,accessToken, refreshToken
//             }
//         )
//      )




// });


//  export const registerCounselor = asyncHandler(async (req, res) => {
//   const { name, email, password, role, specializations, bio, availability } = req.body;
//         if([name,email, password ].some((field)=>
//     field?.trim() === "")) {
//         throw new ApiError(400, "all fields are required")
//     }
//     let existedUser = await User.findOne({ email });
//     if(existedUser){
//         throw new ApiError(409, " user with this email or userName  already exists")
//     }

//   const user = await User.create({ name, email, password, role: "counselor" });
//   const createdUser = await User.findById(user._id).select("-password -refreshToken")

//       if(!createdUser){
//         throw new ApiError(500, "something went wrong while registering user")
//       }

//   const counselor = await Counselor.create({
//     user: user._id,
//     specializations,
//     bio,
//     availability
//   });

//   res.status(201).json(new ApiResponse(201, { user, counselor }, "Counselor registered successfully"));
// });

// export const logoutUser = asyncHandler(async (req, res) => {
//     // Update refresh token to undefined in the database
//     await User.findByIdAndUpdate(
//         req.user._id,
//         {
//             $unset: { 
//                  refreshToken: 1   // this removes the field from document
//             },
//         },
//         {
//             new: true, // Return the updated document
//         }
//     );

//     // Define cookie options
//     const options = {
//         httpOnly: true,
//         secure: true, // Set true if using HTTPS
//         sameSite: "none"
//     };

//     // Clear cookies and send a success response
//     return res
//         .status(200)
//         .clearCookie("accessToken", options)
//         .clearCookie("refreshToken", options)
//         .json(new ApiResponse(200, {}, "User logged out successfully"));
// });

// export const getProfile = asyncHandler(  async (req, res) => {
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

// export const refreshAccessToken = asyncHandler(async(req, res) => {
// const incomingRefreshToken = req.cookies.
// refreshToken || req.body.refreshToken // last part  after || is for mobile users 

// if(!incomingRefreshToken){
//     throw new ApiError(401, "unauthorized request")
// }
// try {
//     const decodedToken = jwt.verify(
//         incomingRefreshToken,
//         process.env.REFRESH_TOKEN_SECRET
//     )


//     const user = await User.findById(decodedToken?._id)
//     if(!user){
//         throw new ApiError(401, "Invalid refresh token")
//     }
    
//     if(incomingRefreshToken !== user?.refreshToken){
//         throw new ApiError(401, "Refresh token is expired or used")
//     }
    
//         const options = {
//             httpOnly: true,
//             secure: true,
//             sameSite: "none"
//          }
    
//          const {accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)
    
//          return res.status(200)
//          .cookie("accessToken", accessToken, options)
//          .cookie("refreshToken", newRefreshToken, options)
//          .json(
//             new ApiResponse(
//                 200,
//                 {accessToken, refreshToken: newRefreshToken},
//                 "Access token is refreshed"
//             )
//          )
// } catch (error) {
//     throw new ApiError(401, error?.message || 
//         "Invalid refresh token"
//     )
// }
// })

































































// // import User from '../models/user.js';
// // import { asyncHandler } from '../utils/asyncHandler.js';
// // import { ApiError } from '../utils/ApiError.js';
// // import { ApiResponse } from '../utils/ApiResponse.js';
// // import UserProfile from "../models/UserProfile.js"; 
// // // @desc    Create or update user profile
// // // @route   PATCH /api/users/profile
// // // @access  Private
// // const generateAccessAndRefereshTokens = async(userId) =>{
// //     try{
// //         const user = await User.findById(userId)    
// //         const accessToken = user.generateAccessToken() // see function in user.model
// //         console.log(accessToken)
// //         const refreshToken = user.generateRefreshToken()
// //         user.refreshToken = refreshToken   // save refresh token on the server but not save access token on server
// //         await user.save({ validateBeforeSave: false })   // save on server without any validation or any field which is required but not send due to this it will save any how
// //      return {accessToken, refreshToken}  // retrunr tokens to client with containing the proper document from server
// //     }

// //     catch(error) {
// //         console.log(error);
// //         throw new ApiError(500, "something went wrong while generating access token & refresh token",error) 
// //     }
// // }
// // export const registerUser = asyncHandler(async (req, res) => {
// //     // **UNCOMMENT THIS BLOCK TO FIX THE ERROR**
// //     const { name, email, password } = req.body;
    
// //     if([name, email, password].some(field => field?.trim() === "")) {
// //         throw new ApiError(400, "All fields are required");
// //     }

// //     const userExists = await User.findOne({ email });
// //     if (userExists) {
// //       return res.status(400).json({ error: 'This email is already registered. Please use a different email or try logging in.' });
// //     }
    
// //     // The rest of your code is correct, assuming you've incorporated the fixes from the previous response.
// //     const user = await User.create({ name, email, password });
    
// //     const createdUser = await User.findById(user._id).select("-password -refreshToken");
    
// //     if (!createdUser) {
// //         throw new ApiError(500, "Something went wrong while registering user");
// //     }
    
// //     const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

// //     const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

// //     const options = {
// //         httpOnly: true,
// //         secure: true,
// //         sameSite: "none"
// //     };

// //     return res
// //         .status(200)
// //         .cookie("accessToken", accessToken, options)
// //         .cookie("refreshToken", refreshToken, options)
// //         .json(
// //             new ApiResponse(
// //                 200, {
// //                     user: loggedInUser,
// //                     accessToken,
// //                     refreshToken
// //                 }
// //             )
// //         );
// // });
// // export const createOrUpdateProfile = asyncHandler(async (req, res) => {
// //   try {
// //     const { userId, ...profileData } = req.body;
    
// //     const newProfile = new UserProfile({
// //       userId,
// //       ...profileData
// //     });
    
// //     await newProfile.save();
// //     res.status(201).json({ message: 'Profile completed', profile: newProfile });
// //   } catch (error) {
// //     console.error('Profile completion error:', error);
// //     res.status(500).json({ error: 'Failed to save profile' });
// //   }
// // });

// // // @desc    Get user profile
// // // @route   GET /api/users/profile
// // // @access  Private
// // export const getProfile = asyncHandler(async (req, res) => {
// //   try {
// //     const { userId } = req.params;

// //     const profile = await UserProfile.findOne({ userId: new mongoose.Types.ObjectId(userId) });

// //     if (!profile) {
// //       console.log("No profile found for userId:", userId);
// //       return res.status(404).json({ message: 'Profile not found' });
// //     }

// //     console.log("Fetched profile from DB:", profile);
// //     res.json(profile);
// //   } catch (error) {
// //     console.error('Error fetching profile:', error);
// //     res.status(500).json({ error: 'Failed to fetch profile' });
// //   }
// // });
