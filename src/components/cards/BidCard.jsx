import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxios from "../../utils/useAxios";
import Toast from "../../components/common/Toast";
import { BiPurchaseTag } from "react-icons/bi";
import { TiAttachment } from "react-icons/ti";

const BidCard = ({
  id,
  requisitionNumber,
  vendor,
  vendorRating,
  totalRatings,
  quantityFulfilled,
  unitPrice,
  dateSubmitted,
  daysToDeliver,
  comments,
  attachments,
  status,
}) => {
  const baseURL = process.env.REACT_APP_API_URL;
  const api = useAxios();
  const navigate = useNavigate();

  const inventoryFields = [
    {
      label: "Requisition ID",
      value: requisitionNumber ? requisitionNumber : null,
    },
    { label: "Vendor", value: vendor ? vendor : null },
    { label: "Vendor Rating", value: vendorRating ? vendorRating : null },
    { label: "Total Ratings", value: totalRatings ? totalRatings : null },
    { label: "Quantity Fulfilled", value: quantityFulfilled },
    { label: "Unit Price", value: unitPrice },
    {
      label: "Date Submitted",
      value: new Date(dateSubmitted).toLocaleDateString(),
    },
    {
      label: "Days to Deliver",
      value: daysToDeliver,
    },
    { label: "Comments", value: comments },
    {
      label: "Attachments",
      value:
        attachments != null ? (
          <a
            href={attachments}
            target="_blank"
            rel="noreferrer"
            className="text-gray-500"
          >
            <TiAttachment className="text-xl" />
          </a>
        ) : null,
    },
    { label: "Status", value: status },
  ].filter((field) => field.value !== null);

  const handleUpdate = () => {
    navigate(`/purchase/bid/update/${id}/`);
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this bid permanently. This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
      focusCancel: true,
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`${baseURL}/purchase/supplier-bids/${id}/delete/`);

        Toast.fire({
          icon: "success",
          title: "Bid deleted successfully!",
        });
      } catch (error) {
        console.error("Error deleting bid:", error);

        Toast.fire({
          icon: "error",
          title: "Error deleting bid!",
        });
      }
    }
  };

  const renderButtons = () => {
    if (requisitionNumber) {
      return (
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
      );
    }
    return null;
  };

  return (
    <div className="mx-auto my-12 w-full overflow-hidden rounded-lg border p-3 shadow lg:w-1/3">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex items-center justify-center">
          <BiPurchaseTag size={60} className="text-custom2" />
        </div>
        <h3 className="py-3 text-center text-3xl font-semibold leading-6 text-gray-900">
          Bid Details
        </h3>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          {inventoryFields.map((field, index) => (
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
      {renderButtons()}
    </div>
  );
};

export default BidCard;
