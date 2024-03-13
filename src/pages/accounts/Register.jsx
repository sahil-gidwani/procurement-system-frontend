import React from "react";
import RegisterFormProcurementOfficer from "../../components/forms/RegisterFormProcurementOfficer";
import RegisterFormVendor from "../../components/forms/RegisterFormVendor";
import Tabs from "../../components/common/Tabs";

const Register = () => {
  return (
    <Tabs>
      <RegisterFormProcurementOfficer tabTitle="Procurement Officer" />
      <RegisterFormVendor tabTitle="Vendor" />
    </Tabs>
  );
};

export default Register;
