import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
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
  companyName,
  address,
  vendorInfo,
}) => {
  const fullName = `${firstName} ${lastName}`;
  const baseURL = process.env.REACT_APP_API_URL;
  const api = useAxios();
  const navigate = useNavigate();

  const vendorTypeMap = {
    supplier: "Supplier",
    manufacturer: "Manufacturer",
    service_provider: "Service Provider",
  };

  const profileFields = [
    { label: "Full name", value: fullName },
    { label: "Username", value: userName },
    { label: "Email address", value: emailAddress },
    { label: "Phone number", value: phoneNumber },
    { label: "GSTIN", value: gstin },
    { label: "Company name", value: companyName },
    { label: "Address", value: address },
    // Conditionally rendered fields
    ...(vendorInfo
      ? [
          {
            label: "Certified vendor",
            value: vendorInfo.vendor_certified ? "Yes" : "No",
          },
          {
            label: "Type of vendor",
            value: vendorInfo?.vendor_type
              ? vendorTypeMap[vendorInfo.vendor_type]
              : "N/A",
          },
          {
            label: "Vendor Rating",
            value:
              vendorInfo?.vendor_rating !== undefined
                ? `${vendorInfo.vendor_rating}/5`
                : "N/A",
          },
          {
            label: "Contract Expiry Date",
            value: vendorInfo?.contract_expiry_date || "N/A",
          },
        ]
      : []),
  ];

  const handleUpdate = () => {
    navigate("/accounts/profile/update/");
  };

const handleDelete = async () => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'You are about to delete your account permanently. This action cannot be undone!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, cancel',
    reverseButtons: true,
    focusCancel: true
  });

  if (result.isConfirmed) {
    try {
      await api.delete(`${baseURL}/accounts/profile/delete/`);
      
      Toast.fire({
        icon: 'success',
        title: 'User profile deleted successfully!'
      });
    } catch (error) {
      console.error('Error deleting user profile:', error);
      
      Toast.fire({
        icon: 'error',
        title: 'Error deleting user profile!'
      });
    }
  } 
};

  return (
    <div className="mx-auto my-12 w-full overflow-hidden rounded-lg border p-3 shadow lg:w-1/3">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex items-center justify-center">
          <PiUserCircleLight size={60} className="text-custom2" />
        </div>
        <h3 className="py-3 text-center text-3xl font-semibold leading-6 text-gray-900">
          User Profile
        </h3>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          {profileFields.map((field, index) => (
            <div
              key={index}
              className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5"
            >
              <dt className="text-sm font-semibold text-gray-600">
                {field.label}
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {field.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="flex justify-evenly border-t border-gray-200 px-4 py-5 sm:p-0">
        <button
          className="mt-4 rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-700"
          onClick={handleUpdate}
        >
          Update
        </button>
        <button
          className="mt-4 rounded bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-700"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
