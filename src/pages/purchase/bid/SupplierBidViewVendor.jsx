import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import useAxios from "../../../utils/useAxios";
import Toast from "../../../components/common/Toast";
import BidCard from "../../../components/cards/BidCard";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

const SupplierBidViewVendor = () => {
  const baseURL = process.env.REACT_APP_API_URL;
  const { id } = useParams();
  const api = useAxios();
  const [bid, setBid] = useState(null);

  useEffect(() => {
    const fetchBid = async () => {
      try {
        const response = await api.get(
          `${baseURL}/purchase/supplier-bids/${id}/`,
        );
        setBid(response.data);
      } catch (error) {
        console.error("Error fetching bid:", error);
        Toast.fire({
          icon: "error",
          title: "Error fetching bid!",
        });
      }
    };

    fetchBid();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {bid ? (
        <BidCard
          id={bid.id}
          requisitionNumber={bid.requisition_number}
          quantityFulfilled={bid.quantity_fulfilled}
          unitPrice={bid.unit_price}
          dateSubmitted={bid.date_submitted}
          daysToDeliver={bid.days_delivery}
          comments={bid?.comments}
          attachments={bid?.attachments}
          status={bid.status}
        />
      ) : (
        <LoadingSpinner />
      )}
    </>
  );
};

export default SupplierBidViewVendor;
