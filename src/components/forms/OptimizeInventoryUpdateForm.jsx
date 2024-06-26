import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { HiOutlineArrowCircleRight } from "react-icons/hi";
import { MdOutlineLocalGroceryStore } from "react-icons/md";
import useAxios from "../../utils/useAxios";
import Toast from "../common/Toast";
import FormHeader from "../common/FormHeader";

const fields = [
  {
    label: "Annual Demand",
    id: "demand",
    type: "number",
    step: "0.01",
    gridCols: 2,
  },
  {
    label: "Ordering Cost per unit",
    id: "ordering_cost",
    type: "number",
    step: "0.01",
    gridCols: 1,
  },
  {
    label: "Holding Cost per unit",
    id: "holding_cost",
    type: "number",
    step: "0.01",
    gridCols: 1,
  },
  {
    label: "Lead Time (in days)",
    id: "lead_time",
    type: "number",
    gridCols: 1,
  },
  {
    label: "Service Level (0 to 1)",
    id: "service_level",
    type: "number",
    step: "0.01",
    gridCols: 1,
  },
  {
    label: "Shelf Life (in days)",
    id: "shelf_life",
    type: "number",
    gridCols: 1,
  },
  {
    label: "Storage Limit",
    id: "storage_limit",
    type: "number",
    gridCols: 1,
  },
];

const schema = z.object({
  demand: z
    .number()
    .min(0.01, { message: "Annual demand must be greater than 0" }),
  ordering_cost: z
    .number()
    .min(0.01, { message: "Ordering cost must be greater than 0" }),
  holding_cost: z
    .number()
    .min(0.01, { message: "Holding cost must be greater than 0" }),
  lead_time: z
    .number()
    .min(1, { message: "Lead time must be greater than 0" })
    .optional(),
  service_level: z
    .number()
    .min(0.01, { message: "Service level must be greater than 0" })
    .max(1, { message: "Service level must be less than 1" })
    .optional(),
  shelf_life: z
    .number()
    .min(1, { message: "Shelf life must be greater than 0" })
    .optional(),
  storage_limit: z
    .number()
    .min(1, { message: "Storage limit must be greater than 0" })
    .optional(),
});

export default function OptimizeInventoryUpdateForm() {
  const baseURL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const { id } = useParams();
  const api = useAxios();

  const form = useForm({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: async () => {
      const response = await api.get(`${baseURL}/inventory/optimize/${id}/`);
      return response.data;
    },
  });

  const { register, handleSubmit, formState, control, setError } = form;

  const { errors, isSubmitting, isValid } = formState;

  const onSubmit = async (data) => {
    console.log(data);

    api
      .put(`${baseURL}/inventory/optimize/${id}/update/`, data)
      .then((response) => {
        console.log(response);
        Toast.fire({
          icon: "success",
          title: "Optimize inventory item updated successfully!",
        });
        navigate("/inventory/list/");
      })
      .catch((error) => {
        const errors = error.response.data;
        console.error("Error updating data: ", errors);
        Toast.fire({
          icon: "error",
          title: "Error updating optimize inventory item!",
        });
        Object.keys(errors).forEach((key) => {
          setError(key, {
            type: "server",
            message: errors[key],
          });
        });
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
      <div className="container mx-auto">
        <div className="mx-auto my-12 flex w-full flex-wrap justify-center rounded-lg p-6 pb-10 pt-5 shadow-2xl lg:w-7/12">
          <FormHeader
            icon={MdOutlineLocalGroceryStore}
            title="Update Optimize Inventory Item"
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
                      autoComplete={field.type === "password" ? "off" : "on"}
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
                        valueAsNumber: field.type === "number" ? true : false,
                      })}
                      className={`m-0 mb-1 w-full max-w-full rounded-md border border-gray-300 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 md:mb-0 md:px-4 md:py-3 ${
                        field.gridCols === 2 ? "md:w-full" : ""
                      }`}
                      id={field.id}
                      type={field.type}
                      placeholder={field?.placeholder || ""}
                      autoComplete={field.type === "password" ? "off" : "on"}
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
  );
}
