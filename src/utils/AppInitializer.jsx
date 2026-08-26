// components/AppInitializer.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { logout, setCredentials, setInitialized } from "@/store/auth/authSlice";
import Cookies from "js-cookie";
import { getProfile } from "@/api/authServices";
import LoadingPage from "@/components/Loading/LoadingPage";

export default function AppInitializer({ children }) {
  const dispatch = useDispatch();
  const isInitialized = useSelector((s) => s.auth.isInitialized);
  const token = Cookies.get("token");

  const { data, isError, isSuccess } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getProfile,
    enabled: !!token && !isInitialized,
    retry: false,
  });

  useEffect(() => {
    if (isSuccess) {
      dispatch(setCredentials({ user: data, token }));
      dispatch(setInitialized());
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      Cookies.remove("token");
      dispatch(logout());
      dispatch(setInitialized());
    }
  }, [isError]);

  useEffect(() => {
    if (!token) dispatch(setInitialized());
  }, [token]);

  if (!isInitialized) return <LoadingPage />;

  return children;
}
