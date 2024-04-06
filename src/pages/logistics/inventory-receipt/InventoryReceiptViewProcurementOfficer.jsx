import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import useAxios from "../../../utils/useAxios";
import Toast from "../../../components/common/Toast";
import InventoryReceiptCard from "../../../components/cards/InventoryReceiptCard";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

const InventoryReceiptViewProcurementOfficer = () => {
  const baseURL = process.env.REACT_APP_API_URL;
  const { id } = useParams();
  const api = useAxios();
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const response = await api.get(`${baseURL}/logistics/inventory-receipt/${id}/`);
        setReceipt(response.data);
      } catch (error) {
        console.error("Error fetching receipt:", error);
        Toast.fire({
          icon: "error",
          title: "Error fetching receipt!",
        });
      }
    };

    fetchReceipt();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {receipt ? (
        <InventoryReceiptCard 
            id={receipt.id}
            receiptId={receipt.receipt_id}  
            receiptDate={receipt.receipt_date}
            receivedQuantity={receipt.received_quantity}
            receivedCondition={receipt.received_condition}
            inspectionNotes={receipt?.inspection_notes}
            inspectionReport={receipt?.inspection_report}
            showButtons={true}
        />
      ) : (
        <LoadingSpinner />
      )}
    </>
  );
};

export default InventoryReceiptViewProcurementOfficer;
