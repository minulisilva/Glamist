import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [itemData, setItemData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      console.log("Fetching item with ID:", id);
      try {
        const response = await getItemDetails(id);
        console.log("API Response:", response.data);
        const item = response.data.data;
        if (!item) {
          throw new Error("No item data returned");
        }
        setItemData(item);
        setError(null);
      } catch (error) {
        console.error("Error fetching item:", error.response?.data || error);
        setError(error.response?.data?.message || error.message || "Failed to load item");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleEdit = () => {
    navigate(`/edit/${id}`);
  };

  const handleDelete = () => {
    navigate(`/delete/${id}`);
  };

  if (loading) return <div className="text-center text-gray-500 mt-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;
  if (!itemData) return <div className="text-gray-500 text-center mt-4">No item found</div>;

  return (
    <div className="max-w-4xl mx-auto mt-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold text-black mb-2">Item Details</h2>
      <div className="p-3 bg-purple-50 border border-purple-200 rounded-md shadow-sm text-black">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <p className="font-medium text-base">{itemData.name}</p>
            <p className="text-xs text-gray-500">{itemData.category || "N/A"}</p>
          </div>
          <div className="space-y-1">
            <p className="font-medium">Quantity: {itemData.quantity}</p>
            <p className="font-medium">Price: Rs.{Number(itemData.price).toFixed(2)}</p>
            <p className="font-medium">Description: {itemData.description || "N/A"}</p>
            <p className="font-medium">Last Updated: {itemData.updatedAt ? new Date(itemData.updatedAt).toLocaleString() : "N/A"}</p>
            <p className="font-medium">Supplier: {itemData.supplier || "N/A"}</p>
          </div>
        </div>
        {itemData.history && itemData.history.length > 0 && (
          <div className="mt-3">
            <h3 className="font-medium text-base">Usage History</h3>
            <ul className="mt-1 space-y-1">
              {itemData.history.map((entry, index) => (
                <li key={index} className="text-xs text-gray-700">
                  {entry.action === 'used' ? 'Used' : 'Added'} {entry.quantityChanged} units on {new Date(entry.timestamp).toLocaleString()} - Reason: {entry.reason}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={handleEdit}
            className="bg-blue-500 text-black px-3 py-1 rounded hover:bg-blue-600 transition-all duration-300 ease-in-out font-medium shadow-sm"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-black px-3 py-1 rounded hover:bg-red-600 transition-all duration-300 ease-in-out font-medium shadow-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemDetails;