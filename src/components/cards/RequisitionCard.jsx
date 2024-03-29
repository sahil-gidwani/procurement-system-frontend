import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxios from "../../utils/useAxios";
import Toast from "../../components/common/Toast";
import { BiPurchaseTag } from "react-icons/bi";
import { TiAttachment } from "react-icons/ti";
import { HiOutlineDocumentReport } from "react-icons/hi";

const RequisitionCard = ({
  id,
  requisitionNumber,
  quantityRequested,
  expectedDeliveryDate,
  urgencyLevel,
  comments,
  dateCreated,
  lastUpdated,
  attachments,
  report,
}) => {
  const baseURL = process.env.REACT_APP_API_URL;
  const api = useAxios();
  const navigate = useNavigate();

  const inventoryFields = [
    { label: "Requisition ID", value: requisitionNumber },
    { label: "Quantity Requested", value: quantityRequested },
    {
      label: "Expected Date of Delivery",
      value: new Date(expectedDeliveryDate).toLocaleDateString(),
    },
    { label: "Urgency Level", value: urgencyLevel },
    { label: "Comments", value: comments },
    {
      label: "Date Created",
      value: new Date(dateCreated).toLocaleDateString(),
    },
    {
      label: "Last Updated",
      value: new Date(lastUpdated).toLocaleDateString(),
    },
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
    {
      label: "Report",
      value:
        report != null ? (
          <a
            href={report}
            target="_blank"
            rel="noreferrer"
            className="text-gray-500"
          >
            <HiOutlineDocumentReport className="text-xl" />
          </a>
        ) : null,
    },
  ].filter((field) => field.value !== null);

  const handleUpdate = () => {
    navigate(`/purchase/requisition/update/${id}/`);
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this requisition permanently. This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
      focusCancel: true,
    });

    if (result.isConfirmed) {
      try {
        await api.delete(
          `${baseURL}/purchase/purchase-requisitions/${id}/delete/`,
        );

        Toast.fire({
          icon: "success",
          title: "Requisition deleted successfully!",
        });
      } catch (error) {
        console.error("Error deleting requisition:", error);

        Toast.fire({
          icon: "error",
          title: "Error deleting requisition!",
        });
      }
    }
  };

  return (
    <div className="mx-auto my-12 w-full overflow-hidden rounded-lg border p-3 shadow lg:w-1/3">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex items-center justify-center">
          <BiPurchaseTag size={60} className="text-custom2" />
        </div>
        <h3 className="py-3 text-center text-3xl font-semibold leading-6 text-gray-900">
          Requisition Details
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

export default RequisitionCard;
