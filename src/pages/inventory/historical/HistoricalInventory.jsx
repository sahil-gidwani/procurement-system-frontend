import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import useAxios from "../../../utils/useAxios";
import Table from "../../../components/tables/Table";
import Toast from "../../../components/common/Toast";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

const HistoricalInventory = () => {
  const baseURL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const api = useAxios();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [historicalInventory, setHistoricalInventory] = useState([]);

  const columns = useMemo(
    () => [
      {
        Header: "Date",
        accessor: "datetime",
        Cell: ({ value }) => (
          <span className="text-sm text-gray-500">
            {new Date(value).toLocaleDateString()}
          </span>
        ),
      },
      {
        Header: "Stock Quantity",
        accessor: "stock_quantity",
      },
      {
        Header: "Demand",
        accessor: "demand",
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    const fetchHistoricalInventory = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(
          `${baseURL}/inventory/historical/${id}/list/`,
        );
        setHistoricalInventory(response.data);
      } catch (error) {
        console.error("Error fetching historical inventory:", error);
        Toast.fire({
          icon: "error",
          title: "Error fetching historical logs!",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistoricalInventory();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const data = historicalInventory;

  const backButton = {
    label: "Inventory List",
    action: () => {
      navigate("/inventory/list/");
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
          createButton={backButton}
        />
      )}
    </>
  );
};

export default HistoricalInventory;
