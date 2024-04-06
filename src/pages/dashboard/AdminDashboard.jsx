import { React, useEffect, useState } from "react";
import Plot from "react-plotly.js";
import Toast from "../../components/common/Toast";
import useAxios from "../../utils/useAxios";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const AdminDashboard = () => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const api = useAxios();

  useEffect(() => {
    const fetchAdminDashboard = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/dashboard/admin/");
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

    fetchAdminDashboard();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="container mx-auto">
          <div className="mx-auto my-12 flex w-full flex-wrap justify-center rounded-lg p-6 pb-10 pt-5 shadow-2xl lg:w-3/4">
            <div className="w-full text-center">
              <h1 className="mb-6 mt-4 text-4xl font-bold">Admin Dashboard</h1>
              <p className="mb-4 font-semibold text-gray-500">
                This dashboard provides an overview of the admin's activities.
              </p>
            </div>
            <hr className="my-6 w-full border border-gray-300" />
            <div className="w-full text-center">
              <h1 className="mb-6 mt-4 text-2xl font-bold">Total Users</h1>
              <div className="mx-auto flex max-w-max items-center justify-center rounded-md bg-blue-500 px-8 py-4 text-xl font-bold text-white">
                {Number(data?.total_users).toLocaleString()}{" "}
              </div>
            </div>
            <Plot
              data={JSON.parse(data?.users_by_role)?.data}
              layout={JSON.parse(data?.users_by_role)?.layout}
              useResizeHandler
              style={{ width: "100%" }}
            />
            <Plot
              data={JSON.parse(data.user_registration_over_time)?.data}
              layout={JSON.parse(data.user_registration_over_time)?.layout}
              useResizeHandler
              style={{ width: "100%" }}
            />
            <Plot
              data={JSON.parse(data.vendors_by_vendor_type)?.data}
              layout={JSON.parse(data.vendors_by_vendor_type)?.layout}
              useResizeHandler
              style={{ width: "100%" }}
            />
            <Plot
              data={JSON.parse(data.vendor_rating_distribution)?.data}
              layout={JSON.parse(data.vendor_rating_distribution)?.layout}
              useResizeHandler
              style={{ width: "100%" }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
