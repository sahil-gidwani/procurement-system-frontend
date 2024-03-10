import React from "react";
import { useSelector } from "react-redux";
import ProfileUpdateFormProcurementOfficer from "../../components/forms/ProfileUpdateFormProcurementOfficer";
import ProfileUpdateFormVendor from "../../components/forms/ProfileUpdateFormVendor";

const ProfileUpdate = () => {
  const user = useSelector((state) => state.auth.user);
  if (user.user_role === "vendor") {
    return <ProfileUpdateFormVendor />;
  } else {
    return <ProfileUpdateFormProcurementOfficer />;
  }
};

export default ProfileUpdate;
