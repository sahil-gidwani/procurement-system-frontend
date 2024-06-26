import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { TiAttachment } from "react-icons/ti";
import useAxios from "../../../utils/useAxios";
import Table from "../../../components/tables/Table";
import Toast from "../../../components/common/Toast";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import ActionsCell from "../../../components/tables/ActionsCell";
import StatusPill from "../../../components/tables/StatusPill";

const SupplierBidListVendor = () => {
  const baseURL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const api = useAxios();
  const [isLoading, setIsLoading] = useState(false);
  const [bids, setBids] = useState([]);

  const handleDelete = async (value) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete the bid permanently. This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
      focusCancel: true,
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`${baseURL}/purchase/supplier-bids/${value}/delete/`);

        Toast.fire({
          icon: "success",
          title: "Bid deleted successfully!",
        });
        navigate("/purchase/bid/list/");
      } catch (error) {
        console.error("Error deleting bid:", error);

        Toast.fire({
          icon: "error",
          title: "Error deleting bid!",
        });
      }
    }
  };

  const getActions = (value, navigate, handleDelete) => [
    { label: "View", action: () => navigate(`/purchase/bid/view/${value}/`) },
    {
      label: "Update",
      action: () => navigate(`/purchase/bid/update/${value}/`),
    },
    { label: "Delete", action: () => handleDelete(value) },
  ];

  const columns = useMemo(
    () => [
      {
        Header: "Requistion ID",
        accessor: "requisition_number",
      },
      {
        Header: "Quantity Fulfilled",
        accessor: "quantity_fulfilled",
      },
      {
        Header: "Unit Price",
        accessor: "unit_price",
      },
      {
        Header: "Date Submitted",
        accessor: "date_submitted",
        Cell: ({ value }) => (
          <span className="text-sm text-gray-500">
            {new Date(value).toLocaleDateString()}
          </span>
        ),
      },
      {
        Header: "Days to Deliver",
        accessor: "days_delivery",
      },
      {
        Header: "Comments",
        accessor: "comments",
        Cell: ({ value }) => (
          <span className="overflow-hidden overflow-ellipsis text-sm text-gray-500">
            {value ? value : "N/A"}
          </span>
        ),
      },
      {
        Header: "Attachments",
        accessor: "attachments",
        Cell: ({ value }) =>
          value && (
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="text-gray-500"
            >
              <TiAttachment className="text-xl" />
            </a>
          ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <StatusPill
            value={value}
            colorMap={{
              accepted: {
                backgroundColor: "bg-green-100",
                textColor: "text-green-800",
              },
              submitted: {
                backgroundColor: "bg-yellow-100",
                textColor: "text-yellow-800",
              },
              rejected: {
                backgroundColor: "bg-red-100",
                textColor: "text-red-800",
              },
            }}
          />
        ),
      },
      {
        Header: "Actions",
        accessor: "id",
        Cell: ({ value }) => (
          <ActionsCell
            value={value}
            actions={getActions(value, navigate, handleDelete)}
          />
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    const fetchBids = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(
          `${baseURL}/purchase/supplier-bids/list/`,
        );
        setBids(response.data);
      } catch (error) {
        console.error("Error fetching bids:", error);
        Toast.fire({
          icon: "error",
          title: "Error fetching bids!",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBids();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const data = bids;

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Table data={data} columns={columns} title="Bids Table" />
      )}
    </>
  );
};

export default SupplierBidListVendor;
