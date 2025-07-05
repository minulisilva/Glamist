import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { FaSave, FaSpinner } from "react-icons/fa";

function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    price: "",
    description: "",
    supplier: "",
  });
  const [itemData, setItemData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      console.log("Fetching item with ID:", id);
      try {
        const response = await getItemDetails(id);
        console.log("Fetched item:", response.data);
        const item = response.data.data;
        if (!item) {
          throw new Error("No item data returned");
        }
        setItemData(item);
        setFormData({
          name: item.name,
          category: item.category || "",
          quantity: item.quantity,
          price: item.price,
          description: item.description || "",
          supplier: item.supplier || "",
        });
        setError(null);
      } catch (error) {
        console.error("Fetch error:", error.response?.data || error);
        setError(error.response?.data?.message || error.message || "Failed to fetch item");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const updatedData = {
      name: formData.name,
      category: formData.category,
      quantity: parseInt(formData.quantity, 10),
      price: parseFloat(formData.price),
      description: formData.description,
      supplier: formData.supplier,
    };
    console.log("Submitting:", updatedData);
    try {
      const response = await editItem(id, updatedData);
      console.log("Update response:", response.data);
      alert("Item updated successfully!");
      navigate("/list");
    } catch (error) {
      console.error("Update error:", error.response?.data || error);
      alert("Error updating item: " + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-8 p-4 bg-red-100 text-red-700 rounded-lg max-w-md mx-auto">
        {error}
      </div>
    );
  }

  if (!itemData) {
    return (
      <div className="text-center mt-8 p-4 bg-gray-100 text-gray-600 rounded-lg max-w-md mx-auto">
        No item found
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Edit Item
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all duration-200"
              placeholder="Enter item name"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all duration-200"
              placeholder="Enter category (optional)"
            />
          </div>

          {/* Quantity */}
          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all duration-200"
              placeholder="Enter quantity"
              min="0"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Price (Rs.) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all duration-200"
              placeholder="Enter price"
              min="0"
              step="0.01"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all duration-200"
              placeholder="Enter description (optional)"
              rows="3"
            />
          </div>

          {/* Supplier */}
          <div>
            <label
              htmlFor="supplier"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Supplier
            </label>
            <input
              type="text"
              id="supplier"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all duration-200"
              placeholder="Enter supplier (optional)"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className={`flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition-all duration-200 ease-in-out ${
                submitting ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" /> Saving...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditItem;