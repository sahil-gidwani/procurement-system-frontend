import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxios from "../../../utils/useAxios";
import Table from "../../../components/tables/Table";
import Toast from "../../../components/common/Toast";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import ActionsCell from "../../../components/tables/ActionsCell";
import StatusPill from "../../../components/tables/StatusPill";

const PurchaseOrderListVendor = () => {
  const baseURL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const api = useAxios();
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  const handleShipped = async (value) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to change the status to shipped. This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
      focusCancel: true,
    });

    if (result.isConfirmed) {
      try {
        await api.put(
          `${baseURL}/purchase/purchase-orders/vendor/${value}/status/`,
          {
            status: "shipped",
          },
        );

        Toast.fire({
          icon: "success",
          title: "Order status changed to shipped successfully!",
        });
      } catch (error) {
        console.error("Error changing status:", error);

        Toast.fire({
          icon: "error",
          title: "Error changing status to shipped!",
        });
      }
    }
  };

  const handleDelivered = async (value) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to change the status to delivered. This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
      focusCancel: true,
    });

    if (result.isConfirmed) {
      try {
        await api.put(
          `${baseURL}/purchase/purchase-orders/vendor/${value}/status/`,
          {
            status: "delivered",
          },
        );

        Toast.fire({
          icon: "success",
          title: "Order status changed to delivered successfully!",
        });
      } catch (error) {
        console.error("Error changing status:", error);

        Toast.fire({
          icon: "error",
          title: "Error changing status to delivered!",
        });
      }
    }
  };

  const getActions = (value, navigate, handleShipped, handleDelivered) => [
    { label: "Shipped", action: () => handleShipped(value) },
    { label: "Delivered", action: () => handleDelivered(value) },
    {
      label: "Create Invoice",
      action: () =>
        navigate(`/logistics/invoice/create/${value}/`),
    },
  ];

  const columns = useMemo(
    () => [
    {
        Header: "Order ID",
        accessor: "order_number",
    },
      {
        Header: "Quantity Ordered",
        accessor: "quantity_ordered",
      },
      {
        Header: "Unit Price",
        accessor: "unit_price",
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
        Header: "Date Ordered",
        accessor: "date_ordered",
        Cell: ({ value }) => (
          <span className="text-sm text-gray-500">
            {new Date(value).toLocaleDateString()}
          </span>
        ),
      },
      {
        Header: "Delivery Location",
        accessor: "delivery_location",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <StatusPill
            value={value}
            colorMap={{
              delivered: {
                backgroundColor: "bg-green-100",
                textColor: "text-green-800",
              },
              shipped: {
                backgroundColor: "bg-yellow-100",
                textColor: "text-yellow-800",
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
        Header: "Actions",
        accessor: "id",
        Cell: ({ value }) => (
          <ActionsCell
            value={value}
            actions={getActions(value, navigate, handleShipped, handleDelivered)}
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
          `${baseURL}/purchase/purchase-orders/vendor/list/`,
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        Toast.fire({
          icon: "error",
          title: "Error fetching orders!",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const data = orders;

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Table
          data={data}
          columns={columns}
          title="Purchase Orders Table"
        />
      )}
    </>
  );
};

export default PurchaseOrderListVendor;
