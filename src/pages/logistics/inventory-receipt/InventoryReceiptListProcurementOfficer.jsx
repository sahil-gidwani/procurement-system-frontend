import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { HiOutlineDocumentReport } from "react-icons/hi";
import useAxios from "../../../utils/useAxios";
import Table from "../../../components/tables/Table";
import Toast from "../../../components/common/Toast";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import ActionsCell from "../../../components/tables/ActionsCell";
import StatusPill from "../../../components/tables/StatusPill";

const InventoryReceiptListProcurementOfficer = () => {
  const baseURL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const api = useAxios();
  const [isLoading, setIsLoading] = useState(false);
  const [receipts, setReceipts] = useState([]);

  const handleDelete = async (value) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete the inventory receipt. This action cannot be undone!",
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
          `${baseURL}/logistics/inventory-receipt/${value}/delete/`,
        );

        Toast.fire({
          icon: "success",
          title: "Inventory receipt deleted successfully!",
        });
      } catch (error) {
        console.error("Error deleting receipt:", error);

        Toast.fire({
          icon: "error",
          title: "Error deleting inventory receipt!",
        });
      }
    }
  };

  const getActions = (value, navigate, handleDelete) => [
    {
      label: "View",
      action: () => navigate(`/logistics/inventory-receipt/view/${value}/`),
    },
    {
      label: "Update",
      action: () => navigate(`/logistics/inventory-receipt/update/${value}/`),
    },
    { label: "Delete", action: () => handleDelete(value) },
  ];

  const columns = useMemo(
    () => [
      {
        Header: "Receipt ID",
        accessor: "receipt_id",
      },
      {
        Header: "Receipt Date",
        accessor: "receipt_date",
        Cell: ({ value }) => (
          <span className="text-sm text-gray-500">
            {new Date(value).toLocaleDateString()}
          </span>
        ),
      },
      {
        Header: "Quantity Received",
        accessor: "received_quantity",
      },
      {
        Header: "Inspection Notes",
        accessor: "inspection_notes",
        show: false,
      },
      {
        Header: "Received Condition",
        accessor: "received_condition",
        Cell: ({ value }) => (
          <StatusPill
            value={value}
            colorMap={{
              good: {
                backgroundColor: "bg-green-100",
                textColor: "text-green-800",
              },
              damaged: {
                backgroundColor: "bg-red-100",
                textColor: "text-red-800",
              },
              defective: {
                backgroundColor: "bg-red-100",
                textColor: "text-red-800",
              },
            }}
          />
        ),
      },
      {
        Header: "Inspection Report",
        accessor: "inspection_report",
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
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(
          `${baseURL}/logistics/inventory-receipt/list/`,
        );
        setReceipts(response.data);
      } catch (error) {
        console.error("Error fetching receipts:", error);
        Toast.fire({
          icon: "error",
          title: "Error fetching receipts!",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const data = receipts;

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Table data={data} columns={columns} title="Inventory Receipts Table" />
      )}
    </>
  );
};

export default InventoryReceiptListProcurementOfficer;
