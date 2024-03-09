import React from "react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { HiOutlineArrowCircleRight } from "react-icons/hi";
import { IoIosLogIn } from "react-icons/io";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../redux/auth/authSlice";
import Toast from "../common/Toast";
import FormHeader from "../common/FormHeader";
import FormExtra from "../common/FormExtra";

const fields = [
  {
    label: "Username",
    id: "username",
    type: "text",
    gridCols: 2,
  },
  {
    label: "Password",
    id: "password",
    type: "password",
    gridCols: 2,
  },
];

const schema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { register, handleSubmit, formState, control, setError } = form;

  const { errors, isSubmitting, isValid } = formState;

  const onSubmit = async (data) => {
    console.log(data);

    try {
      await dispatch(login(data)).unwrap();
      Toast.fire({
        icon: "success",
        title: "Logged in successfully!",
      });
      navigate("/");
    } catch (error) {
      const errors = error.detail;
      console.error("Login failed: ", errors);
      Toast.fire({
        icon: "error",
        title: "Login failed!",
      });
      setError("password", {
        type: "server",
        message: errors,
      });
    }
  };

  return (
    <>
      <div className="container mx-auto">
        <div className="lg:w-7/12 pb-10 pt-5 w-full p-6 flex flex-wrap justify-center shadow-2xl my-12 rounded-lg mx-auto">
          <FormHeader
            icon={IoIosLogIn}
            title="Login"
            subTitle="Don't have an account yet?"
            linkText="Register"
            navigateTo="/accounts/register/"
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
            <FormExtra
              linkText="Forgot Password?"
              navigateTo="/accounts/password-reset/"
            />
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
                <span>Login</span>
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
