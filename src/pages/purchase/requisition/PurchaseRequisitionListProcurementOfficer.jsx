import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { TiAttachment } from "react-icons/ti";
import { HiOutlineDocumentReport } from "react-icons/hi";
import useAxios from "../../../utils/useAxios";
import Table from "../../../components/tables/Table";
import Toast from "../../../components/common/Toast";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import ActionsCell from "../../../components/tables/ActionsCell";
import StatusPill from "../../../components/tables/StatusPill";

const PurchaseRequisitionListProcurementOfficer = () => {
  const baseURL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const api = useAxios();
  const [isLoading, setIsLoading] = useState(false);
  const [requsitions, setRequisitions] = useState([]);

  const handleDelete = async (value) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete the requisition permanently. This action cannot be undone!",
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
          `${baseURL}/purchase/purchase-requisitions/${value}/delete/`,
        );

        Toast.fire({
          icon: "success",
          title: "Requisition deleted successfully!",
        });
        navigate("/purchase/requisition/list/");
      } catch (error) {
        console.error("Error deleting requisition:", error);

        Toast.fire({
          icon: "error",
          title: "Error deleting requisition!",
        });
      }
    }
  };

  const getActions = (value, navigate) => [
    {
      label: "View",
      action: () => navigate(`/purchase/requisition/view/${value}/`),
    },
    {
      label: "Update",
      action: () => navigate(`/purchase/requisition/update/${value}/`),
    },
    {
      label: "Delete",
      action: () => handleDelete(value),
    },
    {
      label: "View Bids",
      action: () => navigate(`/purchase/bid/procurement-officer-list/${value}`),
    },
    {
      label: "Rank Bids",
      action: () => navigate(`/purchase/bid/rank/${value}`),
    }
  ];

  const columns = useMemo(
    () => [
      {
        Header: "Requisition ID",
        accessor: "requisition_number",
      },
      {
        Header: "Date Created",
        accessor: "date_created",
        Cell: ({ value }) => (
          <span className="text-sm text-gray-500">
            {new Date(value).toLocaleDateString()}
          </span>
        ),
        show: false,
      },
      {
        Header: "Last Updated",
        accessor: "last_updated",
        Cell: ({ value }) => (
          <span className="text-sm text-gray-500">
            {new Date(value).toLocaleDateString()}
          </span>
        ),
        show: false,
      },
      {
        Header: "Quantity Requested",
        accessor: "quantity_requested",
      },
      {
        Header: "Expected Date of Delivery",
        accessor: "expected_delivery_date",
        Cell: ({ value }) => (
          <span className="text-sm text-gray-500">
            {new Date(value).toLocaleDateString()}
          </span>
        ),
      },
      {
        Header: "Urgency Level",
        accessor: "urgency_level",
        Cell: ({ value }) => (
          <StatusPill
            value={value}
            colorMap={{
              low: {
                backgroundColor: "bg-green-100",
                textColor: "text-green-800",
              },
              medium: {
                backgroundColor: "bg-yellow-100",
                textColor: "text-yellow-800",
              },
              high: {
                backgroundColor: "bg-red-100",
                textColor: "text-red-800",
              },
            }}
          />
        ),
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
        Header: "Report",
        accessor: "report",
        Cell: ({ value }) =>
          value && (
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="text-gray-500"
            >
              <HiOutlineDocumentReport className="text-xl" />
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
              pending: {
                backgroundColor: "bg-yellow-100",
                textColor: "text-yellow-800",
              },
              approved: {
                backgroundColor: "bg-green-100",
                textColor: "text-green-800",
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
          <ActionsCell value={value} actions={getActions(value, navigate)} />
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    const fetchRequisitions = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(
          `${baseURL}/purchase/purchase-requisitions/list/`,
        );
        setRequisitions(response.data);
      } catch (error) {
        console.error("Error fetching purchase requisitions:", error);
        Toast.fire({
          icon: "error",
          title: "Error fetching purchase requisitions!",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequisitions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const data = requsitions;

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Table
          data={data}
          columns={columns}
          title="Purchase Requisitions"
        />
      )}
    </>
  );
};

export default PurchaseRequisitionListProcurementOfficer;
