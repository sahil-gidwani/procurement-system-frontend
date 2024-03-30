import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import useAxios from "../../../utils/useAxios";
import Toast from "../../../components/common/Toast";
import RequisitionCard from "../../../components/cards/RequisitionCard";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

const PurchaseRequisitionView = () => {
  const baseURL = process.env.REACT_APP_API_URL;
  const { id } = useParams();
  const api = useAxios();
  const [requisition, setRequisition] = useState(null);

  useEffect(() => {
    const fetchRequisition = async () => {
      try {
        const response = await api.get(`${baseURL}/purchase/purchase-requisitions/${id}/`);
        setRequisition(response.data);
      } catch (error) {
        console.error("Error fetching requisition:", error);
        Toast.fire({
          icon: "error",
          title: "Error fetching requisition!",
        });
      }
    };

    fetchRequisition();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {requisition ? (
        <RequisitionCard 
            id={requisition.id}
            requisitionNumber={requisition.requisition_number}
            quantityRequested={requisition.quantity_requested}
            expectedDeliveryDate={requisition.expected_delivery_date}
            urgencyLevel={requisition.urgency_level}
            comments={requisition?.comments}
            dateCreated={requisition.date_created}
            lastUpdated={requisition.last_updated}
            attachments={requisition?.attachments}
            report={requisition?.report}
            status={requisition.status}
        />
      ) : (
        <LoadingSpinner />
      )}
    </>
  );
};

export default PurchaseRequisitionView;
