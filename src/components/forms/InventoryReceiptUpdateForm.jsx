import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { HiOutlineArrowCircleRight } from "react-icons/hi";
import { IoReceiptOutline } from "react-icons/io5";
import useAxios from "../../utils/useAxios";
import Toast from "../common/Toast";
import FormHeader from "../common/FormHeader";

const fields = [
  {
    label: "Receipt ID",
    id: "receipt_id",
    type: "text",
    gridCols: 1,
  },
  {
    label: "Quantity Received",
    id: "received_quantity",
    type: "number",
    gridCols: 1,
  },
  {
    label: "Received Condition",
    id: "received_condition",
    type: "select",
    options: [
      { value: "good", label: "Good" },
      { value: "damaged", label: "Damaged" },
      { value: "defective", label: "Defective" },
    ],
    gridCols: 2,
  },
  {
    label: "Inspection Notes",
    id: "inspection_notes",
    type: "textarea",
    gridCols: 2,
  },
];

const schema = z.object({
  receipt_id: z.string().min(1, { message: "Receipt ID is required" }),
  received_quantity: z
    .number()
    .int()
    .min(0, { message: "Quantity Received must be at least 0" }),
  received_condition: z
    .string()
    .min(1, { message: "Received Condition is required" }),
  inspection_notes: z.string().nullable(),
});

export default function InventoryReceiptUpdateForm() {
  const baseURL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const { id } = useParams();
  const api = useAxios();

  const form = useForm({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: async () => {
        const response = await api.get(`${baseURL}/logistics/inventory-receipt/${id}/`);
        return response.data;
      },
  });

  const { register, handleSubmit, formState, control, setError } = form;

  const { errors, isSubmitting, isValid } = formState;

  const onSubmit = async (data) => {
    console.log(data);

    api
      .put(
        `${baseURL}/logistics/inventory-receipt/${id}/update/`,
        data,
      )
      .then((response) => {
        console.log(response);
        Toast.fire({
          icon: "success",
          title: "Inventory receipt updated successfully!",
        });
        navigate("/logistics/inventory-receipt/list/");
      })
      .catch((error) => {
        const errors = error.response.data;
        console.error("Error posting data: ", errors);
        Toast.fire({
          icon: "error",
          title: "Error updating inventory receipt!",
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
            icon={IoReceiptOutline}
            title="Update Inventory Receipt"
            subTitle="Fill in the details below to update an existing inventory receipt"
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
                        valueAsDate: field.type === "date" ? true : false,
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
