import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import Swal from "sweetalert2";
import { TiAttachment } from "react-icons/ti";
import useAxios from "../../../utils/useAxios";
import Table from "../../../components/tables/Table";
import Toast from "../../../components/common/Toast";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import ActionsCell from "../../../components/tables/ActionsCell";
import StatusPill from "../../../components/tables/StatusPill";

const SupplierBidListProcurementOfficer = () => {
  const baseURL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const { requisition_id } = useParams();
  const api = useAxios();
  const [isLoading, setIsLoading] = useState(false);
  const [bids, setBids] = useState([]);

  const handleAccept = async (value) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to accept the bid which will automatically reject all other submitted bids. This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, accept it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
      focusCancel: true,
    });

    if (result.isConfirmed) {
      try {
        await api.put(
          `${baseURL}/purchase/supplier-bids/procurement-officer/${value}/status/`,
          {
            status: "accepted",
          },
        );

        Toast.fire({
          icon: "success",
          title: "Bid accepted successfully!",
        });
        navigate("/purchase/bid/list/");
      } catch (error) {
        console.error("Error accepting bid:", error);

        Toast.fire({
          icon: "error",
          title: "Error accepting bid!",
        });
      }
    }
  };

  const handleReject = async (value) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to reject the bid. This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reject it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
      focusCancel: true,
    });

    if (result.isConfirmed) {
      try {
        await api.put(
          `${baseURL}/purchase/supplier-bids/procurement-officer/${value}/status/`,
          {
            status: "rejected",
          },
        );

        Toast.fire({
          icon: "success",
          title: "Bid rejected successfully!",
        });
        navigate("/purchase/bid/list/");
      } catch (error) {
        console.error("Error rejecting bid:", error);

        Toast.fire({
          icon: "error",
          title: "Error rejecting bid!",
        });
      }
    }
  };

  const getActions = (value, navigate, handleAccept, handleReject) => [
    {
      label: "View",
      action: () =>
        navigate(`/purchase/bid/procurement-officer-view/${value}/`),
    },
    { label: "Accept", action: () => handleAccept(value) },
    { label: "Reject", action: () => handleReject(value) },
  ];

  const columns = useMemo(
    () => [
      {
        Header: "Quantity Fulfilled",
        accessor: "quantity_fulfilled",
      },
      {
        Header: "Unit Price",
        accessor: "unit_price",
      },
      {
        Header: "Date Submitted",
        accessor: "date_submitted",
        Cell: ({ value }) => (
          <span className="text-sm text-gray-500">
            {new Date(value).toLocaleDateString()}
          </span>
        ),
      },
      {
        Header: "Days to Deliver",
        accessor: "days_delivery",
      },
      {
        Header: "Vendor",
        accessor: "supplier_company_name",
      },
      {
        Header: "Vendor Rating",
        accessor: "supplier_rating",
      },
      {
        Header: "Total Ratings",
        accessor: "total_ratings",
      },
      {
        Header: "Comments",
        accessor: "comments",
        Cell: ({ value }) => (
          <span className="overflow-hidden overflow-ellipsis text-sm text-gray-500">
            {value ? value : "N/A"}
          </span>
        ),
      },
      {
        Header: "Attachments",
        accessor: "attachments",
        Cell: ({ value }) =>
          value && (
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="text-gray-500"
            >
              <TiAttachment className="text-xl" />
            </a>
          ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <StatusPill
            value={value}
            colorMap={{
              accepted: {
                backgroundColor: "bg-green-100",
                textColor: "text-green-800",
              },
              submitted: {
                backgroundColor: "bg-yellow-100",
                textColor: "text-yellow-800",
              },
              rejected: {
                backgroundColor: "bg-red-100",
                textColor: "text-red-800",
              },
            }}
          />
        ),
      },
      {
        Header: "Actions",
        accessor: "id",
        Cell: ({ value }) => (
          <ActionsCell
            value={value}
            actions={getActions(value, navigate, handleAccept, handleReject)}
          />
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    const fetchBids = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(
          `${baseURL}/purchase/supplier-bids/procurement-officer/list/${requisition_id}/`,
        );
        setBids(response.data);
      } catch (error) {
        console.error("Error fetching bids:", error);
        Toast.fire({
          icon: "error",
          title: "Error fetching bids!",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBids();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const data = bids;

  const backButton = {
    label: "Purchase Requisitions List",
    action: () => {
      navigate("/purchase/requisition/list/");
    },
  };

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Table
          data={data}
          columns={columns}
          title="Bids Table"
          createButton={backButton}
        />
      )}
    </>
  );
};

export default SupplierBidListProcurementOfficer;
