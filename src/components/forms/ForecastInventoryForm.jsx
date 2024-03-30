import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { HiOutlineArrowCircleRight } from "react-icons/hi";
import { MdOutlineLocalGroceryStore } from "react-icons/md";
import Plot from "react-plotly.js";
import useAxios from "../../utils/useAxios";
import Toast from "../common/Toast";
import FormHeader from "../common/FormHeader";
import LoadingSpinner from "../common/LoadingSpinner";

const fields = [
  {
    label: "Upload CSV File",
    id: "file",
    type: "file",
    gridCols: 2,
  },
];

const MAX_FILE_SIZE = 50000000;
const ACCEPTED_FILE_TYPES = ["text/csv"];

const schema = z.object({
  file: z
    .any()
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE || !files,
      `Max file size is 50MB.`,
    )
    .refine(
      (files) => !files || ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      "Only csv files are accepted.",
    )
    .refine((files) => files?.length > 0, "File is required."),
});

export default function ForecastInventoryForm() {
  const baseURL = process.env.REACT_APP_API_URL;
  const api = useAxios();
  const { id } = useParams();
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    api
      .get(`${baseURL}/inventory/forecast/${id}/`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        Toast.fire({
          icon: "error",
          title: "Insufficient data for processing from historical logs!",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const form = useForm({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      file: null,
    },
  });

  const { register, handleSubmit, formState, control, setError } = form;

  const { errors, isSubmitting, isValid } = formState;

  const onSubmit = async (data) => {
    console.log(data);

    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      const field = fields.find((field) => field.id === key);
      if (field && field.type === "file") {
        formData.append(key, value[0]);
      } else {
        formData.append(key, value);
      }
    });

    setIsLoading(true);

    api
      .post(`${baseURL}/inventory/forecast/${id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response);
        setData(response.data);

        Toast.fire({
          icon: "success",
          title: "File uploaded successfully!",
        });
      })
      .catch((error) => {
        const errors = error.response.data;
        console.error("Error uploading data: ", errors);
        Toast.fire({
          icon: "error",
          title: "Error uploading file!",
        });
        setError("file", {
          type: "server",
          message: errors.error || "Please check the format of your file.",
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

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : !Object.keys(data).length ? (
        <>
          <div className="container mx-auto">
            <div className="mx-auto my-12 flex w-full flex-wrap justify-center rounded-lg p-6 pb-10 pt-5 shadow-2xl lg:w-7/12">
              <FormHeader
                icon={MdOutlineLocalGroceryStore}
                title="Upload Forecast Inventory File"
                subTitle="Upload a CSV file with two columns: 'datetime' (in YYYY-MM-DD format) and 'demand' (a number) representing item demand over time."
                linkText="Back to Inventory"
                navigateTo="/inventory/list/"
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
        <div className="container mx-auto">
          <div className="mx-auto my-12 flex w-full flex-wrap justify-center rounded-lg p-6 pb-10 pt-5 shadow-2xl lg:w-3/4">
            <div className="w-full text-center">
              <h1 className="mb-6 mt-4 text-4xl font-bold">
                Forecasted Annual Demand
              </h1>
              <p className="mb-4 font-semibold text-gray-500">
                This represents the forecasted annual demand for the selected
                item based on file input or historical logs.
              </p>
              <div className="mx-auto flex max-w-max items-center justify-center rounded-md bg-blue-500 px-8 py-4 text-xl font-bold text-white">
                {Number(data?.annual_forecast).toLocaleString()}{" "}
              </div>
            </div>
            <div className="w-full">
              <Plot
                data={JSON.parse(data?.decomposed)?.data}
                layout={JSON.parse(data?.decomposed)?.layout}
                useResizeHandler
                style={{ width: "100%" }}
              />
              <p className="mb-4 font-semibold text-gray-500">
                The plot above provides a breakdown of the time series data,
                revealing underlying patterns such as long-term trends,
                recurring seasonal fluctuations, and irregular residual
                variations.
              </p>
            </div>
            <div className="w-full">
              <Plot
                data={JSON.parse(data?.graph)?.data}
                layout={JSON.parse(data?.graph)?.layout}
                useResizeHandler
                style={{ width: "100%" }}
              />
              <p className="mb-4 font-semibold text-gray-500">
                This plot presents a forecast of future data points based on
                historical trends, offering valuable insights into potential
                future outcomes and assisting in informed decision-making and
                planning.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
