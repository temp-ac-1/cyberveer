import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthUser, setIsLoggedIn } from "@/redux/authSlice";

const useAuthCheck = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/me", {
          withCredentials: true,
        });

        // ✅ Valid token, update Redux
        dispatch(setAuthUser(res.data.user));
        dispatch(setIsLoggedIn(true));
      } catch (error) {
        // ❌ Invalid/expired token — clear Redux
        dispatch(setAuthUser(null));
        dispatch(setIsLoggedIn(false));
        // Optionally: purge redux-persist here
      }
    };

    checkAuth();
  }, [dispatch]);
};

export default useAuthCheck;
