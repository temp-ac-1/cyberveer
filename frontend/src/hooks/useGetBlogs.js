import axios from "axios";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  setFeaturedBlogs,
  setAllBlogs,
  setBlogsLoading,
  setBlogsError,
} from "@/redux/blogSlice";

export const useBlogs = () => {
  const dispatch = useDispatch();

  const fetchFeaturedBlogs = useCallback(async () => {
    dispatch(setBlogsLoading(true));
    try {
      const res = await axios.get("http://localhost:5000/api/blogs/featured", {
        withCredentials: true,
      });
      dispatch(setFeaturedBlogs(res.data || []));
    } catch (err) {
      console.error("fetchFeaturedBlogs", err);
      dispatch(setBlogsError(err.message || "Failed to load featured blogs"));
    } finally {
      dispatch(setBlogsLoading(false));
    }
  }, [dispatch]);

  const fetchAllBlogs = useCallback(async () => {
    dispatch(setBlogsLoading(true));
    try {
      const res = await axios.get("http://localhost:5000/api/blogs", {
        withCredentials: true,
      });
      const payload = res.data || {};
      dispatch(
        setAllBlogs({
          blogs: payload.blogs || [],
          total: payload.total || 0,
        })
      );
    } catch (err) {
      console.error("fetchAllBlogs", err);
      dispatch(setBlogsError(err.message || "Failed to load blogs"));
    } finally {
      dispatch(setBlogsLoading(false));
    }
  }, [dispatch]);

  return { fetchFeaturedBlogs, fetchAllBlogs };
};
