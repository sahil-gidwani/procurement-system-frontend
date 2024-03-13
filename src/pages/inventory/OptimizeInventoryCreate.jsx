import React from "react";
import OptimizeInventoryCreateFormClassical from "../../components/forms/OptimizeInventoryCreateFormClassical";
import OptimizeInventoryCreateFormROP from "../../components/forms/OptimizeInventoryCreateFormROP";
import OptimizeInventoryCreateFormPerishable from "../../components/forms/OptimizeInventoryCreateFormPerishable";
import OptimizeInventoryCreateFormStorage from "../../components/forms/OptimizedInventoryCreateFormStorage";
import Tabs from "../../components/common/Tabs";

const OptimizeInventoryCreate = () => {
  return (
    <Tabs>
      <OptimizeInventoryCreateFormClassical tabTitle="Classical EOQ" />
      <OptimizeInventoryCreateFormROP tabTitle="EOQ with ROP" />
      <OptimizeInventoryCreateFormPerishable tabTitle="EOQ for Perishable Items" />
      <OptimizeInventoryCreateFormStorage tabTitle="EOQ with Storage Constrains" />
    </Tabs>
  );
};

export default OptimizeInventoryCreate;
