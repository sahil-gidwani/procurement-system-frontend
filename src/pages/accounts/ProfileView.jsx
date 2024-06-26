import React, { useState, useEffect } from "react";
import useAxios from "../../utils/useAxios";
import Toast from "../../components/common/Toast";
import ProfileCard from "../../components/cards/ProfileCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const ProfileView = () => {
  const baseURL = process.env.REACT_APP_API_URL;
  const api = useAxios();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get(`${baseURL}/accounts/profile/`);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        Toast.fire({
          icon: "error",
          title: "Error fetching user profile!",
        });
      }
    };

    fetchUserProfile();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {user ? (
        <ProfileCard
          firstName={user.first_name}
          lastName={user.last_name}
          userName={user.username}
          emailAddress={user.email}
          phoneNumber={user.phone_number}
          gstin={user.gstin}
          companyName={user.company_name}
          address={user.address}
          vendorInfo={user?.vendor}
        />
      ) : (
        <LoadingSpinner />
      )}
    </>
  );
};

export default ProfileView;
