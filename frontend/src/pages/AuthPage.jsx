import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Github,
  Mail,
  Lock,
  Shield,
  ArrowRight,
  User,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../components/ui/input-otp";
import { toast } from "sonner";
import {
  validateEmail,
  validatePassword,
  validateOTP,
  sanitizeInput,
  sanitizePassword,
  sanitizeOTP,
  preventClipboard,
} from "../../src/lib/validation";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser, setIsLoggedIn } from "@/redux/authSlice";

// Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  withCredentials: true,
});

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [signUpStep, setSignUpStep] = useState("details");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [pendingToken, setPendingToken] = useState("");
  const [errors, setErrors] = useState({});
  const [validationStatus, setValidationStatus] = useState({
    email: false,
    userName: false,
    fullName: false,
    password: false,
    otp: false,
  });
  const [userNameChecking, setuserNameChecking] = useState(false);
  const [userNameSuggestions, setuserNameSuggestions] = useState([]);
  const dispatch = useDispatch();

  const { isLoggedIn } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    userName: "",
    fullName: "",
    password: "",
    otp: "",
    rememberMe: false,
  });

  // check session
  // useEffect(() => {
  //   let mounted = true;
  //   (async () => {
  //     try {
  //       const res = await api.get("/api/users/me");
  //       if (mounted && res.data?.user) {
  //         dispatch(setAuthUser(res.data.user));
  //       }
  //     } catch {
  //       if (mounted) dispatch(logout());
  //     }
  //   })();
  //   return () => {
  //     mounted = false;
  //   };
  // }, [dispatch]);

  // otp timer
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  // toggle
  const toggleAuthMode = useCallback(() => {
    setIsSignUp((prev) => !prev);
    setSignUpStep("details");
    setErrors({});
    setPendingToken("");
    setFormData({
      email: "",
      userName: "",
      fullName: "",
      password: "",
      otp: "",
      rememberMe: false,
    });
    setValidationStatus({
      email: false,
      userName: false,
      fullName: false,
      password: false,
      otp: false,
    });
  }, []);

  // check username
  const checkuserNameAvailability = useCallback(async (userName) => {
    if (!userName || userName.length < 3) return false;
    setuserNameChecking(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    const takenuserNames = ["admin", "user", "test", "demo", "example"];
    const isAvailable = !takenuserNames.includes(userName.toLowerCase());
    setuserNameSuggestions(
      isAvailable
        ? []
        : [
            `${userName}123`,
            `${userName}_2025`,
            `${userName}_dev`,
            `the_${userName}`,
            `${userName}_official`,
          ]
    );
    setuserNameChecking(false);
    return isAvailable;
  }, []);

  // input change
  const handleInputChange = useCallback(
    (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }

      if (field === "email" && typeof value === "string") {
        const { isValid } = validateEmail(value);
        setValidationStatus((prev) => ({
          ...prev,
          email: isValid && value.length > 0,
        }));
      }

      if (field === "password" && typeof value === "string") {
        const { isValid } = validatePassword(value);
        setValidationStatus((prev) => ({ ...prev, password: isValid }));
      }

      if (field === "userName" && typeof value === "string") {
        if (value.length >= 3) {
          checkuserNameAvailability(value).then((isAvailable) => {
            setValidationStatus((prev) => ({ ...prev, userName: isAvailable }));
          });
        }
      }

      if (field === "fullName" && typeof value === "string") {
        const ok = value.trim().length >= 2;
        setValidationStatus((prev) => ({ ...prev, fullName: ok }));
      }

      if (field === "otp" && typeof value === "string") {
        const { isValid } = validateOTP(value);
        setValidationStatus((prev) => ({ ...prev, otp: isValid }));
      }
    },
    [errors, checkuserNameAvailability]
  );

  const handleEmailChange = useCallback(
    (e) => handleInputChange("email", sanitizeInput(e.target.value)),
    [handleInputChange]
  );

  const handleuserNameChange = useCallback(
    (e) => {
      const sanitized = sanitizeInput(e.target.value)
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "");
      handleInputChange("userName", sanitized);
    },
    [handleInputChange]
  );

  const handleFullNameChange = useCallback(
    (e) => handleInputChange("fullName", sanitizeInput(e.target.value)),
    [handleInputChange]
  );

  const handlePasswordChange = useCallback(
    (e) => handleInputChange("password", sanitizePassword(e.target.value)),
    [handleInputChange]
  );

  const handleOTPChange = useCallback(
    (value) => handleInputChange("otp", sanitizeOTP(value)),
    [handleInputChange]
  );

  // sign up step 1
  const handleSendOTP = useCallback(async () => {
    if (
      !validationStatus.userName ||
      !validationStatus.fullName ||
      !validationStatus.email ||
      !validationStatus.password
    ) {
      toast.error("Please fill all fields correctly");
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.post("/api/users/register", {
        userName: formData.userName,
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });
      setPendingToken(res.data?.pendingToken);
      setSignUpStep("otp");
      setOtpTimer(60);
      toast.success("OTP sent to your email");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  }, [formData, validationStatus]);

  // sign up step 2
  const handleVerifyOTP = useCallback(async () => {
    if (!validationStatus.otp) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    if (!pendingToken) {
      toast.error("Missing pending token, please restart signup");
      setSignUpStep("details");
      return;
    }
    setIsLoading(true);
    try {
      await api.post("/api/users/verify-otp", {
        otp: formData.otp,
        pendingToken,
      });
      toast.success("Account created successfully!");
      setIsSignUp(false);
      setSignUpStep("details");
    } catch (err) {
      toast.error(err?.response?.data?.message || "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  }, [formData.otp, pendingToken, validationStatus.otp]);

  const handleResendOTP = useCallback(async () => {
    await handleSendOTP();
  }, [handleSendOTP]);

  // sign in
  const handleSignIn = useCallback(async () => {
    if (!validationStatus.email || !formData.password) {
      toast.error("Please enter your email and password");
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.post("/api/users/login", {
        email: formData.email,
        password: formData.password,
      });
      if (res.data?.user) {
        dispatch(setAuthUser(res.data.user));
        dispatch(setIsLoggedIn(true));
      }
      toast.success("Signed in successfully!");
    } catch (err) {
      console.log(err)
      toast.error(err?.response?.data?.message || "Sign in failed");
    } finally {
      setIsLoading(false);
    }
  }, [formData.email, formData.password, validationStatus.email, dispatch]);

  // submit
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (isSignUp) {
        if (signUpStep === "details") return handleSendOTP();
        if (signUpStep === "otp") return handleVerifyOTP();
      } else {
        return handleSignIn();
      }
    },
    [isSignUp, signUpStep, handleSendOTP, handleVerifyOTP, handleSignIn]
  );

  // oauth
  const handleOAuthSignIn = useCallback((provider) => {
    const baseBackendUrl =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
    window.location.href =
      provider === "google"
        ? `${baseBackendUrl}/auth/google`
        : `${baseBackendUrl}/auth/github`;
  }, []);

  const useSuggestion = useCallback(
    (suggestion) => {
      handleInputChange("userName", suggestion);
      setuserNameSuggestions([]);
    },
    [handleInputChange]
  );
  
  useEffect(()=>{
    if (isLoggedIn) return navigate('/')
  },[isLoggedIn])

  // 🔹 UI
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0 circuit-bg opacity-5"></div>
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />

<Card className="w-full max-w-md bg-card/80 backdrop-blur-xl border-primary/20 shadow-2xl relative">
        <CardHeader className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Shield className="w-12 h-12 text-primary mx-auto glow-primary" />
          </motion.div>
          
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Secure Access
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {isSignUp ? 'Create your secure account' : 'Sign in to your account'}
            </CardDescription>
          </div>
  
          {/* Toggle Switch */}
          <div className="flex bg-muted/50 rounded-lg p-1 relative">
            <motion.div
              className="absolute top-1 bottom-1 bg-primary/20 border border-primary/50 rounded-md"
              layout
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ left: isSignUp ? '50%' : '4px', right: isSignUp ? '4px' : '50%' }}
            />
            <button
              onClick={toggleAuthMode}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors relative z-10 ${
                !isSignUp ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={toggleAuthMode}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors relative z-10 ${
                isSignUp ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign Up
            </button>
          </div>
        </CardHeader>
  
        <CardContent className="space-y-6">
          {/* OAuth Buttons */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full btn-cyber"
              onClick={() => handleOAuthSignIn('google')}
            >
              <Mail className="w-4 h-4 mr-2" />
              Continue with Google
            </Button>
            <Button
              variant="outline"
              className="w-full btn-cyber"
              onClick={() => handleOAuthSignIn('github')}
            >
              <Github className="w-4 h-4 mr-2" />
              Continue with GitHub
            </Button>
          </div>
  
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-primary/20"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>
  
          {/* Main Form - Fixed Height Container */}
          <div className="min-h-[320px]">
            <AnimatePresence mode="wait">
              <motion.form
                key={isSignUp ? `signup-${signUpStep}` : 'signin'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {/* Sign In Form */}
                {!isSignUp && (
                  <>
                    {/* Email Field */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={handleEmailChange}
                          placeholder="user@example.com"
                          className="input-cyber pr-10"
                          autoComplete="off"
                          required
                        />
                        {formData.email && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            {validationStatus.email ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                        )}
                      </div>
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email}</p>
                      )}
                    </div>
  
                    {/* Password Field */}
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={handlePasswordChange}
                          placeholder="Enter password"
                          className="input-cyber pr-10"
                          autoComplete="off"
                          onPaste={preventClipboard}
                          onCopy={preventClipboard}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
  
                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember"
                          checked={formData.rememberMe}
                          onCheckedChange={(checked) => handleInputChange('rememberMe', !!checked)}
                        />
                        <Label htmlFor="remember" className="text-sm text-muted-foreground">
                          Remember me
                        </Label>
                      </div>
                      <button
                        type="button"
                        className="text-sm text-primary hover:text-primary/80 transition-colors"
                        onClick={() => toast.info('Password reset coming soon!')}
                      >
                        Forgot password?
                      </button>
                    </div>
                  </>
                )}
  
                {/* Sign Up Form */}
                {isSignUp && (
                  <>
                    {/* DETAILS STEP */}
                    {signUpStep === 'details' && (
                      <div className="space-y-4">
                        {/* userName */}
                        <div className="space-y-2">
                          <Label htmlFor="userName" className="text-sm font-medium">
                            Username
                          </Label>
                          <div className="relative">
                            <Input
                              id="userName"
                              type="text"
                              value={formData.userName}
                              onChange={handleuserNameChange}
                              placeholder="Choose username"
                              className="input-cyber pr-10 pl-10"
                              autoComplete="off"
                              required
                            />
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            {formData.userName && (
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                {userNameChecking ? (
                                  <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                                ) : validationStatus.userName ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-500" />
                                )}
                              </div>
                            )}
                          </div>
                          {errors.userName && (
                            <p className="text-sm text-destructive">{errors.userName}</p>
                          )}
  
                          {/* Suggestions */}
                          {userNameSuggestions.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs text-muted-foreground">Suggestions:</p>
                              <div className="flex flex-wrap gap-2">
                                {userNameSuggestions.map((s, i) => (
                                  <button
                                    key={i}
                                    type="button"
                                    onClick={() => useSuggestion(s)}
                                    className="px-2 py-1 text-xs bg-primary/10 text-primary rounded border border-primary/20 hover:bg-primary/20 transition-colors"
                                  >
                                    {s}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
  
                        {/* Full Name */}
                        <div className="space-y-2">
                          <Label htmlFor="fullName" className="text-sm font-medium">
                            Full Name
                          </Label>
                          <Input
                            id="fullName"
                            type="text"
                            value={formData.fullName}
                            onChange={handleFullNameChange}
                            placeholder="Your full name"
                            className="input-cyber"
                            autoComplete="off"
                            required
                          />
                          {errors.fullName && (
                            <p className="text-sm text-destructive">{errors.fullName}</p>
                          )}
                        </div>
  
                        {/* Email */}
                        <div className="space-y-2">
                          <Label htmlFor="signup-email" className="text-sm font-medium">
                            Email Address
                          </Label>
                          <div className="relative">
                            <Input
                              id="signup-email"
                              type="email"
                              value={formData.email}
                              onChange={handleEmailChange}
                              placeholder="user@example.com"
                              className="input-cyber pr-10"
                              autoComplete="off"
                              required
                            />
                            {formData.email && (
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                {validationStatus.email ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-500" />
                                )}
                              </div>
                            )}
                          </div>
                          {errors.email && (
                            <p className="text-sm text-destructive">{errors.email}</p>
                          )}
                        </div>
  
                        {/* Password */}
                        <div className="space-y-2">
                          <Label htmlFor="signup-password" className="text-sm font-medium">
                            Password
                          </Label>
                          <div className="relative">
                            <Input
                              id="signup-password"
                              type={showPassword ? 'text' : 'password'}
                              value={formData.password}
                              onChange={handlePasswordChange}
                              placeholder="Create strong password"
                              className="input-cyber pr-20"
                              autoComplete="off"
                              onPaste={preventClipboard}
                              onCopy={preventClipboard}
                              required
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                              {formData.password && (
                                validationStatus.password ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-500" />
                                )
                              )}
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-muted-foreground hover:text-primary transition-colors"
                              >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                          {errors.password && (
                            <p className="text-sm text-destructive">{errors.password}</p>
                          )}
                        </div>
                      </div>
                    )}
  
                    {/* OTP STEP */}
                    {signUpStep === 'otp' && (
                      <div className="space-y-4">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-4">
                            Enter the 6-digit code sent to <br />
                            <span className="font-medium text-foreground">{formData.email}</span>
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-center block">
                            Verification Code
                          </Label>
                          <div className="flex justify-center">
                            <InputOTP
                              maxLength={6}
                              value={formData.otp}
                              onChange={handleOTPChange}
                              onPaste={preventClipboard}
                              onCopy={preventClipboard}
                            >
                              <InputOTPGroup>
                                {[...Array(6)].map((_, i) => (
                                  <InputOTPSlot 
                                    key={i} 
                                    index={i} 
                                    className="input-cyber w-10 h-12" 
                                  />
                                ))}
                              </InputOTPGroup>
                            </InputOTP>
                          </div>
                          {errors.otp && (
                            <p className="text-sm text-destructive text-center">{errors.otp}</p>
                          )}
                        </div>
  
                        {/* Resend OTP */}
                        <div className="text-center">
                          {otpTimer > 0 ? (
                            <div className="flex items-center justify-center text-sm text-muted-foreground">
                              <Clock className="w-4 h-4 mr-1" />
                              Resend code in {otpTimer}s
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={handleResendOTP}
                              className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center justify-center mx-auto"
                            >
                              <RefreshCw className="w-4 h-4 mr-1" />
                              Resend Code
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
  
                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full btn-cyber group"
                    disabled={
                      isLoading ||
                      (isSignUp && signUpStep === 'details' && !(validationStatus.userName && validationStatus.fullName && validationStatus.email && validationStatus.password)) ||
                      (isSignUp && signUpStep === 'otp' && !validationStatus.otp)
                    }
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Lock className="w-4 h-4 mr-2" />
                        {isSignUp 
                          ? (signUpStep === 'details' ? 'Send OTP' : 'Verify & Create Account')
                          : 'Sign In'
                        }
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </Button>
                </div>
              </motion.form>
            </AnimatePresence>
          </div>
  
          {/* Security Notice */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              🔐 Your data is encrypted and secure
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
