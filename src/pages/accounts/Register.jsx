import React from "react";
import ProcurementOfficerRegisterForm from "../../components/forms/ProcurementOfficerRegisterForm";
import VendorRegisterForm from "../../components/forms/VendorRegisterForm";
import Tabs from "../../components/common/Tabs";

const Register = () => {
  return (
      <Tabs>
        <ProcurementOfficerRegisterForm tabTitle="Procurement Officer" />
        <VendorRegisterForm tabTitle="Vendor" />
      </Tabs>
  );
};

export default Register;
