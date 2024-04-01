import { React, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Swal from "sweetalert2";
import { HiOutlineArrowCircleRight } from "react-icons/hi";
import { BiPurchaseTag } from "react-icons/bi";
import Plot from "react-plotly.js";
import useAxios from "../../utils/useAxios";
import Toast from "../common/Toast";
import FormHeader from "../common/FormHeader";
import Table from "../tables/Table";
import StatusPill from "../tables/StatusPill";
import ActionsCell from "../tables/ActionsCell";
import LoadingSpinner from "../common/LoadingSpinner";

const fields = [
  {
    label: "Unit Price Weight",
    id: "weight_unit_price",
    type: "number",
    step: "0.01",
    gridCols: 1,
  },
  {
    label: "Total Cost Weight",
    id: "weight_total_cost",
    type: "number",
    step: "0.01",
    gridCols: 1,
  },
  {
    label: "Delivery Days Weight",
    id: "weight_days_delivery",
    type: "number",
    step: "0.01",
    gridCols: 2,
  },
  {
    label: "Vendor Rating Weight",
    id: "weight_supplier_rating",
    type: "number",
    step: "0.01",
    gridCols: 1,
  },
  {
    label: "Total Ratings Weight",
    id: "weight_total_ratings",
    type: "number",
    step: "0.01",
    gridCols: 1,
  },
];

const schema = z
  .object({
    weight_unit_price: z
      .number()
      .min(0.01, { message: "Unit price weight must be at least 0.01" })
      .max(1, { message: "Unit price weight must be at most 1" }),
    weight_total_cost: z
      .number()
      .min(0.01, { message: "Total cost weight must be at least 0.01" })
      .max(1, { message: "Total cost weight must be at most 1" }),
    weight_days_delivery: z
      .number()
      .min(0.01, { message: "Delivery days weight must be at least 0.01" })
      .max(1, { message: "Delivery days weight must be at most 1" }),
    weight_supplier_rating: z
      .number()
      .min(0.01, { message: "Vendor rating weight must be at least 0.01" })
      .max(1, { message: "Vendor rating weight must be at most 1" }),
    weight_total_ratings: z
      .number()
      .min(0.01, { message: "Total ratings weight must be at least 0.01" })
      .max(1, { message: "Total ratings weight must be at most 1" }),
  })
  .refine((data) => {
    const totalWeight =
      data.weight_unit_price +
      data.weight_total_cost +
      data.weight_days_delivery +
      data.weight_supplier_rating +
      data.weight_total_ratings;
    console.log(totalWeight);
    // Check if total weight equals 1
    if (Math.abs(totalWeight - 1) > Number.EPSILON) {
      throw new z.ZodError([
        { path: [], message: "The sum of weights must be exactly 1" },
      ]);
    }
    return true;
  });

export default function SupplierBidRankForm() {
  const baseURL = process.env.REACT_APP_API_URL;
  const { requisition_id } = useParams();
  const navigate = useNavigate();
  const api = useAxios();
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      weight_unit_price: 0.2,
      weight_total_cost: 0.2,
      weight_days_delivery: 0.2,
      weight_supplier_rating: 0.2,
      weight_total_ratings: 0.2,
    },
  });

  const { register, handleSubmit, formState, control, setError } = form;

  const { errors, isSubmitting, isValid } = formState;

  const onSubmit = async (data) => {
    console.log(data);
    setIsLoading(true);

    api
      .post(
        `${baseURL}/purchase/supplier-bids/procurement-officer/list/${requisition_id}/ranking/`,
        data,
      )
      .then((response) => {
        console.log(response);
        setData(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        const errors = error.response.data;
        console.error("Error posting data: ", errors);
        Toast.fire({
          icon: "error",
          title: "Error submitting weights!",
        });
        Object.keys(errors).forEach((key) => {
          setError(key, {
            type: "server",
            message: errors[key],
          });
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const renderErrors = (id) => {
    const keys = id.split(".");
    let currentError = errors;
    for (const key of keys) {
      if (currentError[key] === undefined) {
        return null;
      }
      currentError = currentError[key];
    }
    if (currentError) {
      return (
        <span className="text-sm italic text-red-500">
          {currentError.message}
        </span>
      );
    }
    return null;
  };

  const handleAccept = async (value) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to accept the bid which will automatically reject all other submitted bids. This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, accept it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
      focusCancel: true,
    });

    if (result.isConfirmed) {
      try {
        await api.put(
          `${baseURL}/purchase/supplier-bids/procurement-officer/${value}/status/`,
          {
            status: "accepted",
          },
        );

        Toast.fire({
          icon: "success",
          title: "Bid accepted successfully!",
        });
        navigate("/purchase/bid/list/");
      } catch (error) {
        console.error("Error accepting bid:", error);

        Toast.fire({
          icon: "error",
          title: "Error accepting bid!",
        });
      }
    }
  };

  const handleReject = async (value) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to reject the bid. This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reject it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
      focusCancel: true,
    });

    if (result.isConfirmed) {
      try {
        await api.put(
          `${baseURL}/purchase/supplier-bids/procurement-officer/${value}/status/`,
          {
            status: "rejected",
          },
        );

        Toast.fire({
          icon: "success",
          title: "Bid rejected successfully!",
        });
        navigate("/purchase/bid/list/");
      } catch (error) {
        console.error("Error rejecting bid:", error);

        Toast.fire({
          icon: "error",
          title: "Error rejecting bid!",
        });
      }
    }
  };

  const getActions = (value, navigate, handleAccept, handleReject) => [
    {
      label: "View",
      action: () =>
        navigate(`/purchase/bid/procurement-officer-view/${value}/`),
    },
    { label: "Accept", action: () => handleAccept(value) },
    { label: "Reject", action: () => handleReject(value) },
  ];

  const columns = useMemo(
    () => [
      {
        Header: "Rank",
        accessor: "rank",
      },
      {
        Header: "Closeness",
        accessor: "closeness",
        Cell: ({ value }) => (
          <span className="text-sm text-gray-500">{value?.toFixed(2)}</span>
        ),
      },
      {
        Header: "Supplier Company Name",
        accessor: "supplier_company_name",
      },
      {
        Header: "Supplier Rating",
        accessor: "supplier_rating",
      },
      {
        Header: "Total Ratings",
        accessor: "total_ratings",
      },
      {
        Header: "Quantity Fulfilled",
        accessor: "quantity_fulfilled",
      },
      {
        Header: "Unit Price",
        accessor: "unit_price",
      },
      {
        Header: "Days Delivery",
        accessor: "days_delivery",
      },
      {
        Header: "Total Cost",
        accessor: "total_cost",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <StatusPill
            value={value}
            colorMap={{
              accepted: {
                backgroundColor: "bg-green-100",
                textColor: "text-green-800",
              },
              submitted: {
                backgroundColor: "bg-yellow-100",
                textColor: "text-yellow-800",
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
        Header: "Date Submitted",
        accessor: "date_submitted",
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
            actions={getActions(value, navigate, handleAccept, handleReject)}
          />
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const tableData = useMemo(() => {
    if (data && data.dataframe) {
      const parsedDataframe = JSON.parse(data.dataframe);
      return parsedDataframe;
    }
    return [];
  }, [data]);

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : !Object.keys(data).length ? (
        <>
          <div className="container mx-auto">
            <div className="mx-auto my-12 flex w-full flex-wrap justify-center rounded-lg p-6 pb-10 pt-5 shadow-2xl lg:w-7/12">
              <FormHeader
                icon={BiPurchaseTag}
                title="Rank Bids"
                subTitle="Please enter the weights for each criterion to rank the bids. The sum of all weights must be exactly 1."
              />
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="m-auto flex w-full flex-col items-center justify-start"
              >
                <div className="mb-6 grid w-full grid-cols-1 gap-3 md:grid-cols-2">
                  {fields.map((field, index) => (
                    <div
                      key={index}
                      className={`flex w-full flex-col gap-2 text-left ${
                        field.gridCols === 2 ? "md:col-span-2" : ""
                      }`}
                    >
                      {field.type !== "checkbox" && (
                        <label className="font-semibold">{field.label}</label>
                      )}
                      {field.type === "checkbox" ? (
                        <div className="flex items-center">
                          <input
                            {...register(field.id)}
                            type="checkbox"
                            className="mr-2"
                            disabled={isSubmitting}
                          />
                          <label className="font-semibold">{field.label}</label>
                        </div>
                      ) : field.type === "textarea" ? (
                        <textarea
                          {...register(field.id)}
                          className={`m-0 mb-1 w-full max-w-full rounded-md border border-gray-300 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 md:mb-0 md:px-4 md:py-3 ${
                            field.gridCols === 2 ? "md:w-full" : ""
                          }`}
                          id={field.id}
                          placeholder={field?.placeholder || ""}
                          autoComplete={
                            field.type === "password" ? "off" : "on"
                          }
                          disabled={isSubmitting}
                        />
                      ) : field.type === "select" ? (
                        <select
                          {...register(field.id)}
                          className={`m-0 mb-1 w-full max-w-full rounded-md border border-gray-300 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 md:mb-0 md:px-4 md:py-3 ${
                            field.gridCols === 2 ? "md:w-full" : ""
                          }`}
                          id={field.id}
                          disabled={isSubmitting}
                        >
                          {field.options.map((option, index) => (
                            <option key={index} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          {...register(field.id, {
                            valueAsNumber:
                              field.type === "number" ? true : false,
                            valueAsDate: field.type === "date" ? true : false,
                          })}
                          className={`m-0 mb-1 w-full max-w-full rounded-md border border-gray-300 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 md:mb-0 md:px-4 md:py-3 ${
                            field.gridCols === 2 ? "md:w-full" : ""
                          }`}
                          id={field.id}
                          type={field.type}
                          placeholder={field?.placeholder || ""}
                          autoComplete={
                            field.type === "password" ? "off" : "on"
                          }
                          disabled={isSubmitting}
                          step={field.step || null}
                        />
                      )}
                      {renderErrors(field.id)}
                    </div>
                  ))}
                </div>
                <div className="my-4 w-full text-left">
                  <button
                    type="submit"
                    className={`text-md flex w-full items-center justify-center gap-2 rounded-md border border-blue-500 bg-blue-500 px-4 py-3 font-bold text-white shadow-slate-600 duration-150 ease-in-out hover:bg-white hover:text-blue-500 md:px-6 lg:m-0 ${
                      !isValid || isSubmitting
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                    disabled={!isValid || isSubmitting}
                  >
                    <span>Submit</span>
                    <HiOutlineArrowCircleRight size={20} />
                  </button>
                </div>
              </form>
            </div>
          </div>
          <DevTool control={control} />
        </>
      ) : (
        <>
          <Table data={tableData} columns={columns} title="Bids Ranked"/>
          <div className="container mx-auto">
            <div className="mx-auto my-12 flex w-full flex-wrap justify-center rounded-lg p-6 pb-10 pt-5 shadow-2xl lg:w-3/4">
              <div className="w-full text-center">
                <h1 className="mb-6 mt-4 text-4xl font-bold">
                  Multicriteria Ranking Results
                </h1>
                <p className="mb-4 font-semibold text-gray-500">
                  The bids have been ranked based on the weights provided. The
                  following plots provide a visual representation of the ranking
                  results.
                </p>
              </div>
              <div className="mb-8">
                <Plot
                  data={JSON.parse(data?.radar_plot)?.data}
                  layout={JSON.parse(data?.radar_plot)?.layout}
                  useResizeHandler
                  style={{ width: "100%" }}
                />
                <p className="mt-4 font-semibold text-gray-500">
                  The radar plot visually represents the performance of
                  alternatives across multiple criteria, showcasing each
                  alternative's strengths and weaknesses relative to others.
                </p>
              </div>
              <div>
                <Plot
                  data={JSON.parse(data?.parallel_plot)?.data}
                  layout={JSON.parse(data?.parallel_plot)?.layout}
                  useResizeHandler
                  style={{ width: "100%" }}
                />
                <p className="mt-4 font-semibold text-gray-500">
                  The parallel plot provides a visual comparison of alternatives
                  across multiple variables, allowing for the identification of
                  patterns and relationships between them.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
