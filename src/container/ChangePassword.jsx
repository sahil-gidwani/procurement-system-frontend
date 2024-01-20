import React, { useState } from "react";
import { useSelector } from "react-redux";
import useAxios from "../utils/useAxios";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const baseURL = process.env.REACT_APP_API_URL;
  const user_id = useSelector((state) => state.auth.user.user_id);
  const api = useAxios();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    // TODO: Add logic to send a request to change the password

    api
      .put(`${baseURL}/accounts/change-password/${user_id}/`, {
        old_password: oldPassword,
        password1: newPassword,
        password2: confirmPassword,
      })
      .then((response) => {
        console.log(response);
        setError(null);
      })
      .catch((error) => {
        console.log(error);
        setError(error.response.data.detail);
      });

    // Clear form and errors after successful password change
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
  };

  return (
    <div>
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <label>
          Old Password:
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </label>
        <br />
        <label>
          New Password:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
        <br />
        <label>
          Confirm New Password:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;
