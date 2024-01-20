import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/auth/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Dispatch the login action with the user's credentials
      await dispatch(login(credentials));
      navigate("/");
      // The login action will handle the API call and update the state
    } catch (error) {
      console.error("Login failed:", error);
      // Handle login failure (display error message, etc.)
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <label>
        Username:
        <input
          type="text"
          name="username"
          value={credentials.username}
          onChange={handleInputChange}
        />
      </label>
      <br />
      <label>
        Password:
        <input
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleInputChange}
        />
      </label>
      <br />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
