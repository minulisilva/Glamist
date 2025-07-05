import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";


function DeleteSalary() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [salaryData, setSalaryData] = useState(null);

  useEffect(() => {
    const fetchSalary = async () => {
      try {
        const response = await getSalaryDetails(id);
        console.log("Fetched Salary Data:", response.data);
        setSalaryData(response.data);
      } catch (error) {
        console.error("Error fetching salary record:", error);
        alert("Error fetching salary record: " + (error.response?.data?.message || error.message));
        navigate("/list");
      }
    };
    fetchSalary();
  }, [id, navigate]);

  const handleDelete = async () => {
    try {
      await deleteSalary(id);
      alert("Salary record deleted successfully!");
      navigate("/list");
    } catch (error) {
      alert("Error deleting salary record: " + error.response.data.message);
    }
  };

  const handleCancel = () => {
    navigate("/list");
  };

  if (!salaryData) return <div>Loading...</div>;
  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-white to-pink-50 p-8 rounded-2xl shadow-xl transform transition-all duration-300 hover:shadow-2xl my-10 border border-pink-100">

      <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-6 tracking-wide">
        Confirm Deletion
      </h2>

      <p className="text-gray-700 mb-8 text-lg leading-relaxed">
        Are you sure you want to delete the salary record for{" "}
        <strong className="text-pink-600 font-semibold">
          {salaryData.employeeName} ({salaryData.employeeId})
        </strong>{" "}
        dated{" "}
        <strong className="text-pink-600 font-semibold">
          {new Date(salaryData.paymentDate).toLocaleDateString()}
        </strong>?
      </p>

      <div className="flex justify-center space-x-4">

      <button
        onClick={handleDelete}
        className="relative px-6 py-3 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
      >
        <span className="relative z-10">Yes, Delete</span>
        <span className="absolute inset-0 rounded-lg bg-white opacity-0 hover:opacity-10 transition-opacity duration-300"></span>
      </button>

      <button
        onClick={handleCancel}
        className="relative px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-600 text-white rounded-lg font-semibold hover:from-gray-500 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
      >
        <span className="relative z-10">Cancel</span>
        <span className="absolute inset-0 rounded-lg bg-white opacity-0 hover:opacity-10 transition-opacity duration-300"></span>
      </button>
      </div>
    </div>
  );
}

export default DeleteSalary;