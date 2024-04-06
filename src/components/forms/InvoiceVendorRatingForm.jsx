import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { HiOutlineArrowCircleRight } from "react-icons/hi";
import { FaRegStar } from "react-icons/fa";
import useAxios from "../../utils/useAxios";
import Toast from "../common/Toast";
import FormHeader from "../common/FormHeader";

const fields = [
  {
    label: "Timeliness of Delivery",
    id: "timeliness_of_delivery",
    type: "number",
    gridCols: 1,
  },
  {
    label: "Quality of Goods",
    id: "quality_of_goods",
    type: "number",
    gridCols: 1,
  },
  {
    label: "Compliance with Order",
    id: "compliance_with_order",
    type: "number",
    gridCols: 1,
  },
  {
    label: "Customer Service",
    id: "customer_service",
    type: "number",
    gridCols: 1,
  },
  {
    label: "Value for Money",
    id: "value_for_money",
    type: "number",
    gridCols: 1,
  },
  {
    label: "Communication & Collaboration",
    id: "communication_and_collaboration",
    type: "number",
    gridCols: 1,
  },
];

const schema = z.object({
  timeliness_of_delivery: z
    .number()
    .int()
    .min(0, { message: "This must be at least 0" })
    .max(5, { message: "This must be at most 5" }),
  quality_of_goods: z
    .number()
    .int()
    .min(0, { message: "This must be at least 0" })
    .max(5, { message: "This must be at most 5" }),
  compliance_with_order: z
    .number()
    .int()
    .min(0, { message: "This must be at least 0" })
    .max(5, { message: "This must be at most 5" }),
  customer_service: z
    .number()
    .int()
    .min(0, { message: "This must be at least 0" })
    .max(5, { message: "This must be at most 5" }),
  value_for_money: z
    .number()
    .int()
    .min(0, { message: "This must be at least 0" })
    .max(5, { message: "This must be at most 5" }),
  communication_and_collaboration: z
    .number()
    .int()
    .min(0, { message: "This must be at least 0" })
    .max(5, { message: "This must be at most 5" }),
});

export default function InvoiceVendorRatingForm() {
  const baseURL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const { id } = useParams();
  const api = useAxios();

  const form = useForm({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      timeliness_of_delivery: 0,
      quality_of_goods: 0,
      compliance_with_order: 0,
      customer_service: 0,
      value_for_money: 0,
      communication_and_collaboration: 0,
    },
  });

  const { register, handleSubmit, formState, control, setError } = form;

  const { errors, isSubmitting, isValid } = formState;

  // Calculate the average vendor rating
  const calculateVendorRating = (data) => {
    const criteriaValues = Object.values(data);
    const sumOfCriteria = criteriaValues.reduce(
      (total, value) => total + value,
      0,
    );
    return sumOfCriteria / criteriaValues.length;
  };

  const onSubmit = async (data) => {
    console.log(data);

    const vendor_rating = calculateVendorRating(data);

    api
      .put(`${baseURL}/logistics/invoice/${id}/vendor-rating/`, {
        vendor_rating: vendor_rating,
      })
      .then((response) => {
        console.log(response);
        Toast.fire({
          icon: "success",
          title: "Vendor rated successfully!",
        });
        navigate("/logistics/invoice/procurement-officer-list/");
      })
      .catch((error) => {
        const errors = error.response.data;
        console.error("Error posting data: ", errors);
        Toast.fire({
          icon: "error",
          title: "Error rating vendor!",
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
            icon={FaRegStar}
            title="Submit Vendor Rating"
            subTitle="Rate the vendor based on the following criteria from 0 to 5"
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
