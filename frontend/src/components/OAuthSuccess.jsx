// In the new `OAuthSuccess.jsx` file:
import { setAuthUser, setIsLoggedIn } from "@/redux/authSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OAuthSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/users/me`,
          { withCredentials: true }
        );
        if (res.data?.user) {
          dispatch(setAuthUser(res.data.user));
          dispatch(setIsLoggedIn(true));
          navigate("/", { replace: true });
          return;
        }
        navigate("/auth", { replace: true });
      } catch (e) {
        navigate("/auth", { replace: true });
      }
    };
    if (!user) fetchMe();
    else navigate("/", { replace: true });
  }, [dispatch, navigate, user]);

  return null;
};

export default OAuthSuccess;