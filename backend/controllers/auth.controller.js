// controllers/auth.controller.js
import jwt from "jsonwebtoken";

export const oauthSuccess = (req, res) => {
  const user = req.user;
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d", issuer: "cyberveer-website", audience: "cyberveer-users" }
  );
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 60 * 60 * 1000,
  });

  res.redirect(`${process.env.CLIENT_URL}/oauth-success`);
  
};
