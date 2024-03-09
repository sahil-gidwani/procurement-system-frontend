import React from "react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { HiOutlineArrowCircleRight } from "react-icons/hi";
import { IoIosLogIn } from "react-icons/io";
import axios from "axios";
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
    label: "Password",
    id: "password1",
    type: "password",
    gridCols: 1,
  },
  {
    label: "Confirm Password",
    id: "password2",
    type: "password",
    gridCols: 1,
  },
];

const schema = z
  .object({
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
    password1: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    password2: z.string(),
  })
  .refine((data) => data.password1 === data.password2, {
    message: "Passwords do not match",
    path: ["password2"],
  });

export default function ProcurementOfficerRegisterForm() {
  const baseURL = process.env.REACT_APP_API_URL;

  const form = useForm({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      phone_number: "",
      gstin: "",
      password1: "",
      password2: "",
    },
  });

  const { register, handleSubmit, formState, control, reset, setError } = form;

  const { errors, isSubmitting, isValid } = formState;

  const onSubmit = (data) => {
    console.log(data);

    axios
      .post(`${baseURL}/accounts/register/procurement-officer/`, data)
      .then((response) => {
        console.log(response);
        Toast.fire({
          icon: "success",
          title: "Registered successfully!",
        });
        reset();
      })
      .catch((error) => {
        const errors = error.response.data;
        console.error("Error fetching data: ", errors);
        Toast.fire({
          icon: "error",
          title: "Registration failed!",
        });
        Object.keys(errors).forEach((key) => {
          setError(key, {
            type: "server",
            message: errors[key],
          });
        });
      });
  };

  return (
    <>
      <div className="container mx-auto">
        <div className="lg:w-7/12 pb-10 pt-5 w-full p-6 flex flex-wrap justify-center shadow-2xl my-12 rounded-lg mx-auto">
          <FormHeader
            icon={IoIosLogIn}
            title="Procurement Officer Registration"
            subTitle="Already have an account?"
            linkText="Login"
            navigateTo="/accounts/login/"
          />
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col justify-start items-center w-full m-auto"
          >
            <div className="grid grid-cols-1 mb-6 md:grid-cols-2 gap-3 w-full">
              {fields.map((field, index) => (
                <div
                  key={index}
                  className={`text-left flex flex-col gap-2 w-full ${
                    field.gridCols === 2 ? "md:col-span-2" : ""
                  }`}
                >
                  <label className="font-semibold">{field.label}</label>
                  <input
                    {...register(field.id)}
                    className={`border border-gray-300 text-sm font-semibold mb-1 max-w-full w-full outline-none rounded-md m-0 py-3 px-4 md:py-3 md:px-4 md:mb-0 focus:border-blue-500 ${
                      field.gridCols === 2 ? "md:w-full" : ""
                    }`}
                    id={field.id}
                    type={field.type}
                    placeholder={field?.placeholder || ""}
                    autoComplete={field.type === "password" ? "off" : "on"}
                    disabled={isSubmitting}
                  />
                  {errors[field.id] && (
                    <span className="text-sm text-red-500 italic">
                      {errors[field.id]?.message}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="w-full text-left my-4">
              <button
                type="submit"
                className={`flex justify-center items-center gap-2 w-full py-3 px-4 bg-blue-500 text-white text-md font-bold border border-blue-500 rounded-md ease-in-out duration-150 shadow-slate-600 hover:bg-white hover:text-blue-500 lg:m-0 md:px-6 ${
                  !isValid || isSubmitting
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                disabled={!isValid || isSubmitting}
              >
                <span>Register</span>
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
