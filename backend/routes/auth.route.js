// routes/auth.route.js
import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

// Utility: Generate a JWT
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "1h" } // token valid for 1 hour
  );
};

// =================== GOOGLE AUTH ===================

/**
 * @route   GET /auth/google
 * @desc    Start Google OAuth
 */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], prompt: 'select_account' })
);

/**
 * @route   GET /auth/google/callback
 * @desc    Handle Google OAuth callback
 */
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  (req, res) => {
    if (!req.user) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=OAuthFailed`);
    }

    const { user, token } = req.user;

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000,
    });

    // ✅ Don't send user here, frontend will fetch it via /api/users/me
    res.redirect(`${process.env.CLIENT_URL}/oauth-success`);
  }
);

// =================== GITHUB AUTH ===================

/**
 * @route   GET /auth/github
 * @desc    Start GitHub OAuth
 */
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

/**
 * @route   GET /auth/github/callback
 * @desc    Handle GitHub OAuth callback
 */
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login", session: false }),
  (req, res) => {
    if (!req.user) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=OAuthFailed`);
    }

    const { user, token } = req.user;

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000,
    });

    // ✅ Same flow as Google
    res.redirect(`${process.env.CLIENT_URL}/oauth-success`);
  }
);

// =================== LOGOUT ===================

/**
 * @route   POST /auth/logout
 * @desc    Logout user
 */
router.post("/logout", (req, res) => {
  res.clearCookie("accessToken");
  res.status(200).json({ success: true, message: "Logged out successfully" });
});


export default router;
