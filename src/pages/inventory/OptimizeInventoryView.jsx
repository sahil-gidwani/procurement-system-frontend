import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import useAxios from "../../utils/useAxios";
import OptimizeInventoryCard from "../../components/cards/OptimizeInventoryCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const OptimizeInventoryView = () => {
  const baseURL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const { id } = useParams();
  const api = useAxios();
  const [optimizeInventory, setOptimizeInventory] = useState(null);

  useEffect(() => {
    const fetchOptimizeInventoryItem = async () => {
      try {
        const response = await api.get(`${baseURL}/inventory/optimize/${id}/`);
        setOptimizeInventory(response.data);
      } catch (error) {
        console.error("Error fetching optimize inventory item:", error);
        navigate(`/inventory/optimize/${id}/create/`);
      }
    };

    fetchOptimizeInventoryItem();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {optimizeInventory ? (
        <OptimizeInventoryCard
          id={optimizeInventory.id}
          demand={optimizeInventory.demand}
          orderingCost={optimizeInventory.ordering_cost}
          holdingCost={optimizeInventory.holding_cost}
          leadTime={optimizeInventory.lead_time}
          serviceLevel={optimizeInventory.service_level}
          safetyStock={optimizeInventory.safety_stock}
          reorderPoint={optimizeInventory.reorder_point}
          shelfLife={optimizeInventory.shelf_life}
          storageLimit={optimizeInventory.storage_limit}
          EOQ={optimizeInventory.eoq}
        />
      ) : (
        <LoadingSpinner />
      )}
    </>
  );
};

export default OptimizeInventoryView;
