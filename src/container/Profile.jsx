import React from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  console.log(user);

  return (
    <div>
      <h1>Profile</h1>
      <p>Username: {user?.username}</p>
      <p>Email: {user?.email}</p>
    </div>
  );
};

export default Profile;
