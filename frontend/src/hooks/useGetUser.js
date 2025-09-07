import { setAuthUser, setIsLoggedIn } from "@/redux/authSlice";
import axios from "axios";
import {useEffect} from 'react';
import { useDispatch, useSelector } from "react-redux";


const useGetUser = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((store) => store.auth);
    console.log('reached api')
    useEffect(() => {
        const fetchUserData = async () => {
          try {
            console.log('calling api')
            const res = await axios.get("http://localhost:5000/api/users/me", { withCredentials: true });
            dispatch(setAuthUser(res.data.user));  // Set the user data in redux
            dispatch(setIsLoggedIn(true));  // Only set logged in after user data is fetched
            console.log('done');
          } catch (error) {
            console.log("Error fetching user data:", error);
            dispatch(setIsLoggedIn(false));  // If error, mark as not logged in
          }
        };
      
        if (!user) {
          fetchUserData();  // Fetch only if there's no user data in redux
        }
      }, [user, dispatch]);  // Run when `user` changes or is missing
};


export default useGetUser;