import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
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
    label: "Item Name",
    id: "item_name",
    type: "text",
    gridCols: 1,
  },
  {
    label: "Location of Storage",
    id: "location",
    type: "text",
    gridCols: 1,
  },
  {
    label: "Description",
    id: "description",
    type: "textarea",
    gridCols: 2,
  },
  {
    label: "Unit Price",
    id: "unit_price",
    type: "number",
    step: "0.01",
    gridCols: 1,
  },
  {
    label: "Stock Quantity",
    id: "stock_quantity",
    type: "number",
    gridCols: 1,
  },
  {
    label: "Image",
    id: "image",
    type: "file",
    gridCols: 2,
  },
];

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const schema = z.object({
  item_name: z.string().min(1, { message: "Item name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  unit_price: z
    .number()
    .min(0.00, { message: "Unit price must be greater than or equal to 0" }),
  stock_quantity: z
    .number()
    .min(0, { message: "Stock quantity must be greater than or equal to 0" })
    .int(),
  location: z.string().min(1, { message: "Location is required" }),
  image: z
    .any()
    .nullable()
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE || !files,
      `Max image size is 5MB.`,
    )
    .refine(
      (files) => !files || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported.",
    ),
});

export default function InventoryUpdateForm() {
  const baseURL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const api = useAxios();
  const { id } = useParams();

  const form = useForm({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: async () => {
        const response = await api.get(`${baseURL}/inventory/${id}/`);
        return response.data;
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

    api
      .put(`${baseURL}/inventory/${id}/update/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response);
        Toast.fire({
          icon: "success",
          title: "Inventory item updated successfully!",
        });
        navigate("/inventory/list/");
      })
      .catch((error) => {
        const errors = error.response.data;
        console.error("Error updating data: ", errors);
        Toast.fire({
          icon: "error",
          title: "Error updating inventory item!",
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
            title="Update Item"
            subTitle="Return to the List of Inventory Items"
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
