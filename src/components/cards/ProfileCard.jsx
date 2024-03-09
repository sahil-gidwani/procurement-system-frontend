import React from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "../../utils/useAxios";
import Toast from "../../components/common/Toast";
import { PiUserCircleLight } from "react-icons/pi";

const ProfileCard = ({
  firstName,
  lastName,
  userName,
  emailAddress,
  phoneNumber,
  gstin,
}) => {
  const fullName = `${firstName} ${lastName}`;
  const baseURL = process.env.REACT_APP_API_URL;
  const api = useAxios();
  const navigate = useNavigate();

  const profileFields = [
    { label: "Full name", value: fullName },
    { label: "Username", value: userName },
    { label: "Email address", value: emailAddress },
    { label: "Phone number", value: phoneNumber },
    { label: "GSTIN", value: gstin },
  ];

  const handleUpdate = () => {
    navigate("/accounts/profile/update/");
  };

  const handleDelete = async () => {
    try {
      await api.delete(`${baseURL}/accounts/profile/delete/`);
      Toast.fire({
        icon: "success",
        title: "User profile deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting user profile:", error);
      Toast.fire({
        icon: "error",
        title: "Error deleting user profile!",
      });
    }
  };

  return (
    <div className="overflow-hidden shadow rounded-lg border my-12 mx-auto lg:w-1/3 w-full p-3">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex justify-center items-center">
          <PiUserCircleLight size={60} className="text-custom2" />
        </div>
        <h3 className="text-3xl leading-6 font-semibold text-gray-900 text-center py-3">
          User Profile
        </h3>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          {profileFields.map((field, index) => (
            <div
              key={index}
              className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt className="text-sm font-semibold text-gray-600">
                {field.label}
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {field.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0 flex justify-evenly">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mt-4"
          onClick={handleUpdate}
        >
          Update
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded mt-4"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
