import React from "react";
import { NavLink } from "react-router-dom";

const FormHeader = ({
  icon: Icon,
  title,
  subTitle = "",
  linkText = "",
  navigateTo = "/",
}) => {
  return (
    <div className="pb-12 text-center">
      <Icon size={60} className="mx-auto text-custom2" />
      <h1 className="mb-3 mt-2 text-3xl font-bold">{title}</h1>
      <p className="font-semibold text-gray-500">
        {subTitle}{" "}
        <NavLink className="text-custom1" to={navigateTo}>
          {linkText}
        </NavLink>
      </p>
    </div>
  );
};

export default FormHeader;
