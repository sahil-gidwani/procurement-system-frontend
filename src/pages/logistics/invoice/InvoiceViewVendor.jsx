import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import useAxios from "../../../utils/useAxios";
import Toast from "../../../components/common/Toast";
import InvoiceCard from "../../../components/cards/InvoiceCard";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

const InvoiceViewVendor = () => {
  const baseURL = process.env.REACT_APP_API_URL;
  const { id } = useParams();
  const api = useAxios();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await api.get(`${baseURL}/logistics/invoice/${id}/`);
        setInvoice(response.data);
      } catch (error) {
        console.error("Error fetching invoice:", error);
        Toast.fire({
          icon: "error",
          title: "Error fetching invoice!",
        });
      }
    };

    fetchInvoice();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {invoice ? (
        <InvoiceCard
          id={invoice.id}
          invoiceNumber={invoice.invoice_number}
          invoiceDate={invoice.invoice_date}
          accountNumber={invoice.account_number}
          totalAmount={invoice.total_amount}
          paymentDueDate={invoice.payment_due_date}
          paymentMode={invoice.payment_mode}
          paymentStatus={invoice.payment_status}
          invoiceReport={invoice?.invoice_report}
          showButtons={true}
        />
      ) : (
        <LoadingSpinner />
      )}
    </>
  );
};

export default InvoiceViewVendor;
