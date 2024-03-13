import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import useAxios from "../../utils/useAxios";
import Toast from "../../components/common/Toast";
import InventoryCard from "../../components/cards/InventoryCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const InventoryView = () => {
  const baseURL = process.env.REACT_APP_API_URL;
  const { id } = useParams();
  const api = useAxios();
  const [inventory, setInventory] = useState(null);

  useEffect(() => {
    const fetchInventoryItem = async () => {
      try {
        const response = await api.get(`${baseURL}/inventory/${id}/`);
        setInventory(response.data);
      } catch (error) {
        console.error("Error fetching inventory item:", error);
        Toast.fire({
          icon: "error",
          title: "Error fetching item!",
        });
      }
    };

    fetchInventoryItem();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {inventory ? (
        <InventoryCard
          id={inventory.id}
          itemName={inventory.item_name}
          description={inventory.description}
          location={inventory.location}
          unitPrice={inventory.unit_price}
          stockQuantity={inventory.stock_quantity}
          image={inventory?.image}
          dateAdded={inventory.date_added}
          lastUpdated={inventory.last_updated}
        />
      ) : (
        <LoadingSpinner />
      )}
    </>
  );
};

export default InventoryView;
