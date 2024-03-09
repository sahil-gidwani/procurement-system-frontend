import React from "react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { HiOutlineArrowCircleRight } from "react-icons/hi";
import { IoIosLogIn } from "react-icons/io";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/auth/authSlice";
import useAxios from "../../utils/useAxios";
import Toast from "../common/Toast";
import FormHeader from "../common/FormHeader";

const fields = [
  {
    label: "Old Password",
    id: "old_password",
    type: "password",
    gridCols: 2,
  },
  {
    label: "New Password",
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
    old_password: z.string().min(1, { message: "Password is required" }),
    password1: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    password2: z.string(),
  })
  .refine((data) => data.password1 === data.password2, {
    message: "Passwords do not match",
    path: ["password2"],
  });

export default function ChangePasswordForm() {
  const baseURL = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const api = useAxios();

  const form = useForm({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      old_password: "",
      password1: "",
      password2: "",
    },
  });

  const { register, handleSubmit, formState, control, setError } = form;

  const { errors, isSubmitting, isValid } = formState;

  const onSubmit = async (data) => {
    console.log(data);

    api
      .put(`${baseURL}/accounts/change-password/`, data)
      .then((response) => {
        console.log(response);
        Toast.fire({
          icon: "success",
          title: "Password changed successfully!",
        });
        dispatch(logout());
        navigate("/accounts/login/");
      })
      .catch((error) => {
        const errors = error.response.data;
        console.error("Error fetching data: ", errors);
        Toast.fire({
          icon: "error",
          title: "Password change failed!",
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
          <FormHeader icon={IoIosLogIn} title="Change Password" />
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
