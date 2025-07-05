import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
import { FaSyncAlt, FaEdit, FaTrashAlt } from "react-icons/fa";

function ItemList() {
  const [salonItems, setSalonItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await getItemList();
      console.log("API Response:", response.data);
      setSalonItems(response.data.data);

      // Extract unique categories from items
      const uniqueCategories = [
        "all",
        ...new Set(
          response.data.data
            .filter((item) => item.category)
            .map((item) => item.category)
        ),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      alert("Error fetching items: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = salonItems.filter(
    (item) => selectedCategory === "all" || item.category === selectedCategory
  );

  const handleItemClick = (id) => {
    navigate(`/details/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Salon Inventory</h2>
          <button
            onClick={fetchItems}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-all duration-200"
          >
            <FaSyncAlt className="mr-2" /> Refresh
          </button>
        </div>

        <div className="mb-6">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-64 p-3 border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all duration-200"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          {filteredItems.length > 0 ? (
            <ul className="space-y-3">
              {filteredItems.map((item) => (
                <li
                  key={item._id}
                  onClick={() => handleItemClick(item._id)}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-purple-50 transition-all duration-200 cursor-pointer border border-gray-200"
                >
                  <div className="flex flex-col mb-2 sm:mb-0">
                    <span className="font-medium text-gray-800">{item.name}</span>
                    <span className="text-sm text-gray-500">
                      {item.category || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 sm:gap-6">
                    <span className="text-gray-600">Qty: {item.quantity}</span>
                    <span className="text-gray-800 font-semibold">
                      Rs.{Number(item.price).toFixed(2)}
                    </span>
                    <div
                      className="flex gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link to={`/edit/${item._id}`}>
                        <button className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm">
                          <FaEdit className="mr-1" /> Edit
                        </button>
                      </Link>
                      <Link to={`/delete/${item._id}`}>
                        <button className="flex items-center px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 shadow-sm">
                          <FaTrashAlt className="mr-1" /> Delete
                        </button>
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic text-center py-4">
              No items in the selected category.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ItemList;