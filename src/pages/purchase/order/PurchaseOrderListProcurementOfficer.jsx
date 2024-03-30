import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import useAxios from "../../../utils/useAxios";
import Table from "../../../components/tables/Table";
import Toast from "../../../components/common/Toast";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import ActionsCell from "../../../components/tables/ActionsCell";
import StatusPill from "../../../components/tables/StatusPill";

const PurchaseOrderListProcurementOfficer = () => {
  const baseURL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const api = useAxios();
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  const getActions = (value, navigate) => [
    {
      label: "Inspection",
      action: () =>
        navigate(`/purchase/bid/procurement-officer-view/${value}/`),
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
          `${baseURL}/purchase/purchase-orders/list/`,
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

export default PurchaseOrderListProcurementOfficer;
