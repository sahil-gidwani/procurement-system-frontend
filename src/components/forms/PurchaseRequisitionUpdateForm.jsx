import { React, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { HiOutlineArrowCircleRight } from "react-icons/hi";
import { BiPurchaseTag } from "react-icons/bi";
import useAxios from "../../utils/useAxios";
import Toast from "../common/Toast";
import FormHeader from "../common/FormHeader";

const fields = [
  {
    label: "Requisition ID",
    id: "requisition_number",
    type: "text",
    gridCols: 1,
  },
  {
    label: "Quantity Requested",
    id: "quantity_requested",
    type: "number",
    gridCols: 1,
  },
  {
    label: "Expected Date of Delivery",
    id: "expected_delivery_date",
    type: "date",
    gridCols: 1,
  },
  {
    label: "Urgency Level",
    id: "urgency_level",
    type: "select",
    options: [
      { value: "low", label: "Low" },
      { value: "medium", label: "Medium" },
      { value: "high", label: "High" },
    ],
    gridCols: 1,
  },
  {
    label: "Comments",
    id: "comments",
    type: "textarea",
    gridCols: 2,
  },
  {
    label: "Attachments",
    id: "attachments",
    type: "file",
    gridCols: 2,
  },
  {
    label: "Report",
    id: "report",
    type: "file",
    gridCols: 2,
  },
];

const schema = z.object({
  requisition_number: z
    .string()
    .min(1, { message: "Requisition ID is required" }),
  quantity_requested: z
    .number()
    .int()
    .min(1, { message: "Quantity requested must be at least 1" }),
  expected_delivery_date: z.date().refine(
    (date) => {
      const today = new Date();
      return date >= today;
    },
    { message: "Expected delivery date must be at least today's date" },
  ),
  urgency_level: z.string().min(1, { message: "Urgency level is required" }),
  comments: z.string().nullable(),
  attachments: z.any().nullable(),
  report: z.any().nullable(),
});

export default function PurchaseRequisitionUpdateForm() {
  const baseURL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const { id } = useParams();
  const api = useAxios();

  const form = useForm({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      attachments: null,
      report: null,
    },
  });

  const { register, handleSubmit, formState, control, setError, setValue } =
    form;

  const { errors, isSubmitting, isValid } = formState;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          `${baseURL}/purchase/purchase-requisitions/${id}/`,
        );
        const data = response.data;
        // Set default values for all fields except the attachments and report fields
        for (const field of fields) {
          if (field.id !== "attachments" && field.id !== "report") {
            setValue(field.id, data[field.id]);
          }
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data) => {
    console.log(data);

    data.expected_delivery_date = new Date(data.expected_delivery_date)
      .toISOString()
      .split("T")[0];
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      const field = fields.find((field) => field.id === key);
      if (field && field.type === "file") {
        if (value === null) {
          return;
        }
        formData.append(key, value[0]);
      } else {
        formData.append(key, value);
      }
    });

    api
      .put(
        `${baseURL}/purchase/purchase-requisitions/${id}/update/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      )
      .then((response) => {
        console.log(response);
        Toast.fire({
          icon: "success",
          title: "Purchase requisition updated successfully!",
        });
        navigate("/purchase/requisition/list/");
      })
      .catch((error) => {
        const errors = error.response.data;
        console.error("Error updating data: ", errors);
        Toast.fire({
          icon: "error",
          title: "Error updating purchase requisition!",
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
            icon={BiPurchaseTag}
            title="Update Purchase Requisition"
            subTitle="Fill in the form below to update a purchase requisition"
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
