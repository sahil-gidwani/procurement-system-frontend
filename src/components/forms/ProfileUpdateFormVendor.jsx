import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { HiOutlineArrowCircleRight } from "react-icons/hi";
import { PiUserCircleLight } from "react-icons/pi";
import useAxios from "../../utils/useAxios";
import Toast from "../common/Toast";
import FormHeader from "../common/FormHeader";

const fields = [
  {
    label: "First Name",
    id: "first_name",
    type: "text",
    gridCols: 1,
  },
  {
    label: "Last Name",
    id: "last_name",
    type: "text",
    gridCols: 1,
  },
  {
    label: "Username",
    id: "username",
    type: "text",
    gridCols: 1,
  },
  {
    label: "Email",
    id: "email",
    type: "email",
    gridCols: 1,
  },
  {
    label: "Phone",
    id: "phone_number",
    type: "tel",
    gridCols: 1,
  },
  {
    label: "GSTIN",
    id: "gstin",
    type: "text",
    placeholder: "70OOPJF3428W5ZK",
    gridCols: 1,
  },
  {
    label: "Company Name",
    id: "company_name",
    type: "text",
    gridCols: 1,
  },
  {
    label: "Type of Vendor",
    id: "vendor.vendor_type",
    type: "select",
    gridCols: 1,
    options: [
      { value: "supplier", label: "Supplier" },
      { value: "manufacturer", label: "Manufacturer" },
      { value: "service_provider", label: "Service Provider" },
    ],
  },
  {
    label: "Address",
    id: "address",
    type: "textarea",
    gridCols: 2,
  },
  {
    label: "Are you a certified vendor?",
    id: "vendor.vendor_certified",
    type: "checkbox",
    gridCols: 2,
  },
];

const schema = z.object({
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  username: z.string().min(1, { message: "Username is required" }),
  email: z.string().email({ message: "Invalid email format" }),
  phone_number: z.string().refine((value) => /^\d{10}$/.test(value), {
    message: "Phone number must be a 10-digit number",
  }),
  gstin: z.string().regex(/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d[Z]{1}[A-Z\d]{1}$/, {
    message: "Invalid GSTIN format",
  }),
  company_name: z.string().min(1, { message: "Company name is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  vendor: z.object({
    vendor_type: z.enum(["supplier", "manufacturer", "service_provider"]),
    vendor_certified: z.boolean("Certified vendor must be a boolean value"),
  }),
});

export default function ProfileUpdateFormVendor() {
  const baseURL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const api = useAxios();

  const form = useForm({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: async () => {
      const response = await api.get(`${baseURL}/accounts/profile/`);
      return response.data;
    },
  });

  const { register, handleSubmit, formState, control, setError } = form;

  const { errors, isSubmitting, isValid } = formState;

  const onSubmit = async (data) => {
    console.log(data);

    api
      .put(`${baseURL}/accounts/profile/update/`, data)
      .then((response) => {
        console.log(response);
        Toast.fire({
          icon: "success",
          title: "Profile updated successfully!",
        });
        navigate("/accounts/profile/");
      })
      .catch((error) => {
        const errors = error.response.data;
        console.error("Error updating data: ", errors);
        Toast.fire({
          icon: "error",
          title: "Profile update failed!",
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
          <FormHeader icon={PiUserCircleLight} title="Update Profile" />
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
                      {...register(field.id)}
                      className={`m-0 mb-1 w-full max-w-full rounded-md border border-gray-300 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 md:mb-0 md:px-4 md:py-3 ${
                        field.gridCols === 2 ? "md:w-full" : ""
                      }`}
                      id={field.id}
                      type={field.type}
                      placeholder={field?.placeholder || ""}
                      autoComplete={field.type === "password" ? "off" : "on"}
                      disabled={isSubmitting}
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
