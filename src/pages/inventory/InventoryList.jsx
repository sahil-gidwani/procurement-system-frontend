import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxios from "../../utils/useAxios";
import Table from "../../components/tables/Table";
import Toast from "../../components/common/Toast";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ActionsCell from "../../components/tables/ActionsCell";

const InventoryList = () => {
  const baseURL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const api = useAxios();
  const [isLoading, setIsLoading] = useState(false);
  const [inventory, setInventory] = useState([]);

  const handleDelete = async (value) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete the item permanently. This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
      focusCancel: true,
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`${baseURL}/inventory/${value}/delete/`);

        Toast.fire({
          icon: "success",
          title: "Item deleted successfully!",
        });
        navigate("/inventory/list/");
      } catch (error) {
        console.error("Error deleting inventory item:", error);

        Toast.fire({
          icon: "error",
          title: "Error deleting item!",
        });
      }
    }
  };

  const getActions = (value, navigate, handleDelete) => [
    { label: "View", action: () => navigate(`/inventory/view/${value}/`) },
    { label: "Update", action: () => navigate(`/inventory/update/${value}/`) },
    { label: "Delete", action: () => handleDelete(value) },
    {
      label: "Historical Logs",
      action: () => navigate(`/inventory/historical/${value}/`),
    },
    {
      label: "Forecast",
      action: () => navigate(`/inventory/forecast/${value}/`),
    },
    {
      label: "Optimize",
      action: () => navigate(`/inventory/optimize/${value}/`),
    },
    {
      label: "Create Purchase Requisition",
      action: () => navigate(`/purchase/requisition/create/${value}/`),
    },
  ];

  // TODO: Fix the download of grouped columns
  //   const columns = useMemo(
  //     () => [
  //       {
  //         Header: "Item Details",
  //         columns: [
  //           {
  //             Header: "Name",
  //             accessor: "item_name",
  //           },
  //           {
  //             Header: "Description",
  //             accessor: "description",
  //           },
  //           {
  //             Header: "Location",
  //             accessor: "location",
  //           },
  //         ],
  //       },
  //       {
  //         Header: "Inventory Details",
  //         columns: [
  //           {
  //             Header: "Stock Quantity",
  //             accessor: "stock_quantity",
  //           },
  //           {
  //             Header: "Unit Price",
  //             accessor: "unit_price",
  //           },
  //         ],
  //       },
  //       {
  //         Header: "Actions",
  //         accessor: "id",
  //         Cell: ({ value }) => (
  //           <ActionsCell
  //             value={value}
  //             actions={getActions(value, navigate, handleDelete)}
  //           />
  //         ),
  //       },
  //     ],
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //     [],
  //   );

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "item_name",
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Location",
        accessor: "location",
      },
      {
        Header: "Stock Quantity",
        accessor: "stock_quantity",
      },
      {
        Header: "Unit Price",
        accessor: "unit_price",
      },
      {
        Header: "Date Added",
        accessor: "date_added",
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
    const fetchInventory = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`${baseURL}/inventory/list/`);
        setInventory(response.data);
      } catch (error) {
        console.error("Error fetching inventory:", error);
        Toast.fire({
          icon: "error",
          title: "Error fetching inventory!",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventory();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // TODO: Fix the memoization and caching issue - when I delete an item the memoization OR caching returns old data figure out which one
  // const data = useMemo(() => inventory, [inventory]);
  const data = inventory;

  const createButton = {
    label: "Add Item",
    action: () => {
      navigate("/inventory/create/");
    },
  };

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Table
          data={data}
          columns={columns}
          title="Inventory Table"
          createButton={createButton}
        />
      )}
    </>
  );
};

export default InventoryList;
