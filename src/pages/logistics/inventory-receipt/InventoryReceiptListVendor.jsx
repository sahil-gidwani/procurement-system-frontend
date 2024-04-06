import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { HiOutlineDocumentReport } from "react-icons/hi";
import useAxios from "../../../utils/useAxios";
import Table from "../../../components/tables/Table";
import Toast from "../../../components/common/Toast";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import ActionsCell from "../../../components/tables/ActionsCell";
import StatusPill from "../../../components/tables/StatusPill";

const InventoryReceiptListVendor = () => {
  const baseURL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const api = useAxios();
  const [isLoading, setIsLoading] = useState(false);
  const [receipts, setReceipts] = useState([]);

  const getActions = (value, navigate, handleDelete) => [
    {
      label: "View",
      action: () => navigate(`/logistics/inventory-receipt/vendor-view/${value}/`),
    },
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
            actions={getActions(value, navigate)}
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
          `${baseURL}/logistics/inventory-receipt/vendor/list/`,
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

export default InventoryReceiptListVendor;
