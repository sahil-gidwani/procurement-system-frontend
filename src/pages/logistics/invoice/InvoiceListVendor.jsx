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

const InvoiceListVendor = () => {
  const baseURL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const api = useAxios();
  const [isLoading, setIsLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);

  const handleDelete = async (value) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete the invoice. This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
      focusCancel: true,
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`${baseURL}/logistics/invoice/${value}/delete/`);

        Toast.fire({
          icon: "success",
          title: "Invoice deleted successfully!",
        });
      } catch (error) {
        console.error("Error deleting invoice:", error);

        Toast.fire({
          icon: "error",
          title: "Error deleting invoice!",
        });
      }
    }
  };

  const getActions = (value, navigate, handleDelete) => [
    {
      label: "View",
      action: () => navigate(`/logistics/invoice/view/${value}/`),
    },
    {
      label: "Update",
      action: () => navigate(`/logistics/invoice/update/${value}/`),
    },
    { label: "Delete", action: () => handleDelete(value) },
  ];

  const columns = useMemo(
    () => [
      {
        Header: "Invoice ID",
        accessor: "invoice_number",
      },
      {
        Header: "Invoice Date",
        accessor: "invoice_date",
        Cell: ({ value }) => (
          <span className="text-sm text-gray-500">
            {new Date(value).toLocaleDateString()}
          </span>
        ),
      },
      {
        Header: "Account Number",
        accessor: "account_number",
      },
      {
        Header: "Total Amount",
        accessor: "total_amount",
      },
      {
        Header: "Payment Due Date",
        accessor: "payment_due_date",
        Cell: ({ value }) => (
          <span className="text-sm text-gray-500">
            {new Date(value).toLocaleDateString()}
          </span>
        ),
      },
      {
        Header: "Payment Mode",
        accessor: "payment_mode",
      },
      {
        Header: "Payment Status",
        accessor: "payment_status",
        Cell: ({ value }) => (
          <StatusPill
            value={value}
            colorMap={{
              paid: {
                backgroundColor: "bg-green-100",
                textColor: "text-green-800",
              },
              pending: {
                backgroundColor: "bg-red-100",
                textColor: "text-red-800",
              },
            }}
          />
        ),
      },
      {
        Header: "Invoice Report",
        accessor: "invoice_report",
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
        const response = await api.get(`${baseURL}/logistics/invoice/list/`);
        setInvoices(response.data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
        Toast.fire({
          icon: "error",
          title: "Error fetching invoices!",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const data = invoices;

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Table data={data} columns={columns} title="Invoices Table" />
      )}
    </>
  );
};

export default InvoiceListVendor;
