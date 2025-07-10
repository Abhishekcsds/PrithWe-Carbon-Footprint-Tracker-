

// import express from "express";
// import bcrypt from "bcrypt";
// import passport from "passport";
// import { pool } from "./db.js";
// import { generateOTP, sendOTPEmail } from "./SentOTP.js";

// const router = express.Router();

// // Public calculator endpoint (no auth required)
// router.post("/calculate", async (req, res) => {
//   try {
//     // Process calculation without authentication
//     const result = calculateFootprint(req.body);
//     res.json(result);
//   } catch (err) {
//     console.error("Calculation error:", err);
//     res.status(500).json({ message: "Calculation error" });
//   }
// });

// // Registration with OTP
// router.post("/register", async (req, res) => {
//   const { name, email, password, type } = req.body;
//   if (!name || !email || !password) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   try {
//     // Check if user exists
//     const existing = await pool.query(
//       "SELECT * FROM users WHERE email = $1", 
//       [email.toLowerCase()]
//     );
    
//     if (existing.rows.length > 0) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Hash password
//     const hashed = await bcrypt.hash(password, 10);
    
//     // Create unverified user
//     await pool.query(
//       `INSERT INTO users (name, email, password, type, email_verified) 
//        VALUES ($1, $2, $3, $4, false)`,
//       [name, email.toLowerCase(), hashed, type]
//     );

//     // Generate and store OTP
//     const otp = generateOTP();
//     const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    
//     await pool.query(
//       "UPDATE users SET otp = $1, otp_timestamp = $2 WHERE email = $3",
//       [otp, expires, email.toLowerCase()]
//     );

//     // Send OTP email
//     await sendOTPEmail(email, otp);

//     res.status(201).json({ 
//       message: "Registration successful. OTP sent to email." 
//     });
//   } catch (err) {
//     console.error("Registration error:", err);
//     res.status(500).json({ message: "Registration failed" });
//   }
// });

// // OTP Verification
// router.post("/verify-otp", async (req, res, next) => {
//   const { email, otp } = req.body;
//   if (!email || !otp) {
//     return res.status(400).json({ message: "Email and OTP required" });
//   }

//   try {
//     const { rows } = await pool.query(
//       "SELECT * FROM users WHERE email = $1",
//       [email.toLowerCase()]
//     );
    
//     if (!rows.length) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const user = rows[0];
//     const now = new Date();

//     // Verify OTP
//     if (!user.otp || !user.otp_timestamp || 
//         user.otp !== otp || now > user.otp_timestamp) {
//       return res.status(400).json({ message: "Invalid or expired OTP" });
//     }

//     // Mark as verified
//     await pool.query(
//       `UPDATE users 
//        SET email_verified = true, otp = NULL, otp_timestamp = NULL 
//        WHERE email = $1`,
//       [email.toLowerCase()]
//     );

//     // Auto-login after verification
//     req.login(user, (err) => {
//       if (err) return next(err);
//       return res.json({ message: "Email verified and logged in" });
//     });
//   } catch (err) {
//     console.error("OTP verification error:", err);
//     res.status(500).json({ message: "Verification failed" });
//   }
// });

// // Login
// router.post("/login", (req, res, next) => {
//   passport.authenticate("local", (err, user, info) => {
//     if (err) {
//       return res.status(500).json({ message: "Internal server error" });
//     }
//     if (!user) {
//       return res.status(401).json({ 
//         message: info?.message || "Invalid credentials" 
//       });
//     }

//     // Check email verification
//     if (!user.email_verified) {
//       return res.status(403).json({ 
//         message: "Please verify your email first" 
//       });
//     }

//     // Complete login
//     req.login(user, (err) => {
//       if (err) return next(err);
//       return res.json({ 
//         message: "Login successful",
//         user: {
//           id: user.id,
//           name: user.name,
//           email: user.email,
//           type: user.type
//         }
//       });
//     });
//   })(req, res, next);
// });

// // Logout
// router.post("/logout", (req, res) => {
//   req.logout((err) => {
//     if (err) {
//       console.error("Logout error:", err);
//       return res.status(500).json({ message: "Logout failed" });
//     }
//     res.json({ message: "Logout successful" });
//   });
// });

// // Session status check
// router.get("/login/status", (req, res) => {
//   if (req.isAuthenticated()) {
//     return res.json({
//       authenticated: true,
//       user: req.user
//     });
//   }
//   res.json({ authenticated: false });
// });

// export default router;

import express from "express";
import passport from "passport";
import { pool } from "./db.js";

const router = express.Router();

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/login',
    successRedirect: '/dashboard'
  })
);

// Session check
router.get('/login/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      authenticated: true,
      user: req.user
    });
  } else {
    res.json({ authenticated: false });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.json({ message: "Logout successful" });
  });
});

export default router;