import React from "react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { HiOutlineArrowCircleRight } from "react-icons/hi";
import { IoIosLogIn } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Toast from "../common/Toast";
import FormHeader from "../common/FormHeader";

const fields = [
  {
    label: "Email",
    id: "email",
    type: "email",
    gridCols: 2,
  },
];

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export default function PasswordResetForm() {
  const baseURL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      email: "",
    },
  });

  const { register, handleSubmit, formState, control, setError } = form;

  const { errors, isSubmitting, isValid } = formState;

  const onSubmit = async (data) => {
    console.log(data);

    axios
      .post(`${baseURL}/accounts/password-reset/`, data)
      .then((response) => {
        console.log(response);
        Toast.fire({
          icon: "success",
          title: "Password reset link sent successfully!",
        });
        navigate("/accounts/login");
      })
      .catch((error) => {
        const errors = error.response.data;
        console.error("Error fetching data: ", errors);
        Toast.fire({
          icon: "error",
          title: "Password reset failed!",
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
        <div className="mx-auto my-12 flex w-full flex-wrap justify-center rounded-lg p-6 pb-10 pt-5 shadow-2xl lg:w-7/12">
          <FormHeader
            icon={IoIosLogIn}
            title="Password Reset"
            subTitle="Enter your registered email to receive a password reset link."
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
                  <label className="font-semibold">{field.label}</label>
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
                  {errors[field.id] && (
                    <span className="text-sm italic text-red-500">
                      {errors[field.id]?.message}
                    </span>
                  )}
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
