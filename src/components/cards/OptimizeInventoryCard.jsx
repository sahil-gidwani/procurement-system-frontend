import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxios from "../../utils/useAxios";
import Toast from "../../components/common/Toast";
import { MdOutlineLocalGroceryStore } from "react-icons/md";

const OptimizeInventoryCard = ({
  id,
  demand,
  orderingCost,
  holdingCost,
  leadTime,
  serviceLevel,
  safetyStock,
  reorderPoint,
  shelfLife,
  storageLimit,
  EOQ,
}) => {
  const baseURL = process.env.REACT_APP_API_URL;
  const api = useAxios();
  const navigate = useNavigate();

  const optimizeInventoryFields = [
    { label: "Annual Demand", value: demand },
    { label: "Ordering Cost per unit", value: orderingCost },
    { label: "Holding Cost per unit", value: holdingCost },
    { label: "Lead Time (in days)", value: leadTime },
    {
      label: "Service Level",
      value: serviceLevel !== null ? serviceLevel * 100 + "%" : null,
    },
    { label: "Safety Stock", value: safetyStock },
    { label: "Reorder Point", value: reorderPoint },
    { label: "Shelf Life (in days)", value: shelfLife },
    { label: "Storage Limit", value: storageLimit },
    { label: "Economic Order Quantity", value: EOQ },
  ].filter((field) => field.value !== null);

  const handleUpdate = () => {
    navigate(`/inventory/optimize/${id}/update/`);
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this optimize item permanently. This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
      focusCancel: true,
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`${baseURL}/inventory/optimize/${id}/delete/`);

        Toast.fire({
          icon: "success",
          title: "Optimize item deleted successfully!",
        });
      } catch (error) {
        console.error("Error deleting optimize inventory item:", error);

        Toast.fire({
          icon: "error",
          title: "Error deleting optimize item!",
        });
      }
    }
  };

  return (
    <div className="mx-auto my-12 w-full overflow-hidden rounded-lg border p-3 shadow lg:w-1/3">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex items-center justify-center">
          <MdOutlineLocalGroceryStore size={60} className="text-custom2" />
        </div>
        <h3 className="py-3 text-center text-3xl font-semibold leading-6 text-gray-900">
          Optimization Details
        </h3>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          {optimizeInventoryFields.map((field, index) => (
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

export default OptimizeInventoryCard;
