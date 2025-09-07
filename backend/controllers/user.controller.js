import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../models/User.model.js";
dotenv.config();
// Setup mail transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
      issuer: "cyberveer-website",
      audience: "cyberveer-users"
    }
  );
};

//jwt verify
// jwt.verify(token, process.env.JWT_SECRET, {
//   issuer: "cybersec-website",
//   audience: "cybersec-users"
// });



// 📌 Register User
export const registerUser = async (req, res, next) => {
  try {
    const { userName, fullName, email, password } = req.body;
    
    const emailExist = await User.findOne({ email });
    if (emailExist) return res.status(400).json({ message: "this email is already in use" });


    const usernameExist = await User.findOne({ username: userName });
    if (usernameExist) return res.status(400).json({ message: "this username is already taken" });
    // validate password strength
    const strongRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongRegex.test(password)) {
      return res.status(400).json({ message: "Password not strong enough" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // create a short-lived token that carries signup info
    const pendingToken = jwt.sign(
      { userName, fullName, email, password: hashedPassword, otp },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // send OTP via email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your account",
      text: `Your OTP is ${otp}. It expires in 15 minutes.`,
    });

    res.status(200).json({
      message: "OTP sent to email. Verify to complete registration.",
      pendingToken, // ⚠️ send to client (frontend must store it temporarily)
    });
  } catch (error) {
    next(error);
  }
};

// 📌 Step 2: Verify OTP & Create Account
export const verifyOtp = async (req, res, next) => {
  try {
    const { otp, pendingToken } = req.body;

    if (!pendingToken) return res.status(400).json({ message: "Missing pending token" });

    // verify pending token
    let decoded;

    try {
      decoded = jwt.verify(pendingToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    // check otp
    if (decoded.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // create user now
    const user = await User.create({
      username: decoded.userName,
      fullname: decoded.fullName,
      email: decoded.email,
      password: decoded.password,
      isVerified: true,
      provider: "local",
    });

    res.status(201).json({ success: true, message: "Account created successfully", user });
  } catch (error) {
    next(error);
  }
};


// 📌 Login User
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ message: "Invalid email or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: "Verify your email before login" });
    }

    const token = generateToken(user._id);

    // ✅ Set token in HttpOnly cookie
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // use HTTPS in prod
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    // ✅ Send user object back (but remove password)
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};



export const getMe = async (req, res) => {
  try {
    const userId = req.userId; // if using passport or JWT middleware
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

export const logoutUser = async (req, res) => {
  try {
    // Clear the access token cookie
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Make sure it's only set to true in production
      sameSite: 'Strict', // SameSite option to prevent CSRF
      maxAge: 0, // Expire the cookie immediately
    });

    // Send a success response
    res.status(200).json({
      success: true,
      message: 'Successfully logged out',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong during logout',
    });
  }
};