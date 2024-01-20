import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { useSelector, useDispatch } from "react-redux";
import { setUser, setTokens } from "../redux/auth/authSlice";

const baseURL = process.env.REACT_APP_API_URL;

const useAxios = () => {
  const authTokens = useSelector((state) => state.auth.tokens);
  const dispatch = useDispatch();

  const axiosInstance = axios.create({
    baseURL,
    headers: { Authorization: `Bearer ${authTokens?.access}` },
  });

  axiosInstance.interceptors.request.use(async (req) => {
    const user = jwtDecode(authTokens.access);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

    if (!isExpired) return req;

    const response = await axios.post(`${baseURL}/accounts/token/refresh/`, {
      refresh: authTokens.refresh,
    });

    localStorage.setItem("tokens", JSON.stringify(response.data));

    dispatch(setTokens(response.data));
    dispatch(setUser(jwtDecode(response.data.access)));

    req.headers.Authorization = `Bearer ${response.data.access}`;
    return req;
  });

  return axiosInstance;
};

export default useAxios;
