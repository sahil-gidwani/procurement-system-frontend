import { React, useEffect, useState } from "react";
import Plot from "react-plotly.js";
import Toast from "../../components/common/Toast";
import useAxios from "../../utils/useAxios";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const ProcurementOfficerDashboard = () => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const api = useAxios();

  useEffect(() => {
    const fetchProcurementOfficerDashboard = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/dashboard/procurement-officer/");
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        Toast.fire({
            icon: "error",
            title: "Error fetching dashboard data!",
          });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProcurementOfficerDashboard();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="container mx-auto">
          <div className="mx-auto my-12 flex w-full flex-wrap justify-center rounded-lg p-6 pb-10 pt-5 shadow-2xl lg:w-3/4">
            <div className="w-full text-center">
              <h1 className="mb-6 mt-4 text-4xl font-bold">
                Procurement Officer Dashboard
              </h1>
              <p className="mb-4 font-semibold text-gray-500">
                This dashboard provides an overview of the procurement officer's
                activities.
              </p>
            </div>
            <hr className="border border-gray-300 w-full my-6"/>
            <div className="w-full text-center">
              <h1 className="mb-6 mt-4 text-2xl font-bold">
                Total Inventory Items
              </h1>
              <div className="mx-auto flex max-w-max items-center justify-center rounded-md bg-blue-500 px-8 py-4 text-xl font-bold text-white">
                {Number(data?.total_inventory_items).toLocaleString()}{" "}
              </div>
            </div>
            <Plot
              data={JSON.parse(data?.top_items_stock_quantity)?.data}
              layout={JSON.parse(data?.top_items_stock_quantity)?.layout}
              useResizeHandler
              style={{ width: "100%" }}
            />
            <Plot
              data={JSON.parse(data.top_items_unit_price)?.data}
              layout={JSON.parse(data.top_items_unit_price)?.layout}
              useResizeHandler
              style={{ width: "100%" }}
            />
            <Plot
              data={JSON.parse(data.top_items_total_price)?.data}
              layout={JSON.parse(data.top_items_total_price)?.layout}
              useResizeHandler
              style={{ width: "100%" }}
            />
            <Plot
              data={JSON.parse(data.inventory_items_added)?.data}
              layout={JSON.parse(data.inventory_items_added)?.layout}
              useResizeHandler
              style={{ width: "100%" }}
            />
            <Plot
              data={JSON.parse(data.inventory_age)?.data}
              layout={JSON.parse(data.inventory_age)?.layout}
              useResizeHandler
              style={{ width: "100%" }}
            />
            <Plot
              data={JSON.parse(data.stock_quantity_distribution)?.data}
              layout={JSON.parse(data.stock_quantity_distribution)?.layout}
              useResizeHandler
              style={{ width: "100%" }}
            />
            <div className="w-full text-center">
              <h1 className="mb-6 mt-4 text-2xl font-bold">
                Total Purchase Requisitions
              </h1>
              <div className="mx-auto flex max-w-max items-center justify-center rounded-md bg-blue-500 px-8 py-4 text-xl font-bold text-white">
                {Number(data?.total_purchase_requisitions).toLocaleString()}{" "}
              </div>
            </div>
            <Plot
              data={JSON.parse(data.purchase_requisitions_by_status)?.data}
              layout={JSON.parse(data.purchase_requisitions_by_status)?.layout}
              useResizeHandler
              style={{ width: "100%" }}
            />
            <Plot
              data={JSON.parse(data.purchase_requisitions_over_time)?.data}
              layout={JSON.parse(data.purchase_requisitions_over_time)?.layout}
              useResizeHandler
              style={{ width: "100%" }}
            />
            <Plot
              data={JSON.parse(data.purchase_requisitions_age)?.data}
              layout={JSON.parse(data.purchase_requisitions_age)?.layout}
              useResizeHandler
              style={{ width: "100%" }}
            />
            <Plot
              data={JSON.parse(data.quantity_requested_distribution)?.data}
              layout={JSON.parse(data.quantity_requested_distribution)?.layout}
              useResizeHandler
              style={{ width: "100%" }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProcurementOfficerDashboard;
