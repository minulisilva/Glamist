import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";


function DeleteItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [itemData, setItemData] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await getItemDetails(id);
        console.log("Fetched Item Data:", response.data);
        setItemData(response.data);
      } catch (error) {
        console.error("Error fetching item record:", error);
        alert("Error fetching item record: " + (error.response?.data?.message || error.message));
        navigate("/list");
      }
    };
    fetchItem();
  }, [id, navigate]);

  const handleDelete = async () => {
    try {
      await deleteItem(id);
      alert("Item deleted successfully!");
      navigate("/list");
    } catch (error) {
      alert("Error deleting item: " + (error.response?.data?.message || error.message));
    }
  };

  const handleCancel = () => {
    navigate("/list");
  };

  if (!itemData) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-black mb-4">Delete Item</h2>
      <div className="space-y-4">
        {itemData ? (
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-md shadow-sm text-black">
            <p className="font-medium text-lg mb-2">{itemData.name}</p>
            <p className="text-sm text-gray-500 mb-4">{itemData.category}</p>
            <div className="space-y-2">
              <p><span className="font-medium">Quantity:</span> {itemData.quantity}</p>
              <p><span className="font-medium">Price:</span> ${Number(itemData.price).toFixed(2)}</p>
            </div>
            <p className="mt-4 text-gray-700">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={handleDelete}
                className="bg-purple-500 text-black hover:bg-purple-600 hover:text-gray-900 px-4 py-2 rounded-md transition-all duration-300 ease-in-out font-medium shadow-sm"
              >
                Confirm Delete
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-200 text-black hover:bg-gray-300 hover:text-gray-900 px-4 py-2 rounded-md transition-all duration-300 ease-in-out font-medium shadow-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No item selected for deletion.</p>
        )}
      </div>
    </div>
  );
}

export default DeleteItem;