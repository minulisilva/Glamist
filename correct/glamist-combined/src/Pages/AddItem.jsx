import { useState } from "react";

import { useNavigate } from "react-router-dom";

function AddItem() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    price: "",
    supplier: "",
    description: "",
    category: "",
  });

  const [error, setError] = useState(""); // For error messages
  const [loading, setLoading] = useState(false); // To manage loading state

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || formData.quantity <= 0 || formData.price <= 0) {
      setError("Name, Quantity, and Price are required and must be greater than 0.");
      return;
    }

    setLoading(true); // Set loading state to true while submitting
    setError(""); // Clear any previous errors

    try {
      await addItem(formData); // Call the API to add the item
      alert("Item added successfully!");
      navigate("/list"); // Redirect to the list page after success
    } catch (error) {
      setError("Error adding item: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-black mb-4">Add New Item</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>} {/* Error message */}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Item Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="p-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 bg-purple-50 text-black placeholder-gray-500 transition-all duration-300"
        />
        <input
          type="number"
          placeholder="Quantity"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="p-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 bg-purple-50 text-black placeholder-gray-500 transition-all duration-300"
          min="0"
        />
        <input
          type="number"
          placeholder="Price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="p-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 bg-purple-50 text-black placeholder-gray-500 transition-all duration-300"
          min="0"
          step="0.01"
        />
        <input
          type="text"
          placeholder="Supplier"
          name="supplier"
          value={formData.supplier}
          onChange={handleChange}
          className="p-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 bg-purple-50 text-black placeholder-gray-500 transition-all duration-300"
        />
        <input
          type="text"
          placeholder="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="p-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 bg-purple-50 text-black placeholder-gray-500 transition-all duration-300"
        />
        <input
          type="text"
          placeholder="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="p-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 bg-purple-50 text-black placeholder-gray-500 transition-all duration-300"
        />
        <button
          type="submit"
          className="bg-purple-500 text-black hover:bg-purple-600 hover:text-gray-900 p-3 rounded-md transition-all duration-300 ease-in-out font-medium shadow-sm"
          disabled={loading} // Disable the button while loading
        >
          {loading ? "Adding..." : "Add Item"}
        </button>
      </form>
    </div>
  );
}

export default AddItem;