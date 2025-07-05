import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";


function SalaryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [salaryData, setSalaryData] = useState(null);

  useEffect(() => {
    const fetchSalary = async () => {
      try {
        const response = await getSalaryDetails(id);
        setSalaryData(response.data);
      } catch (error) {
        alert("Error fetching salary record: " + error.response.data.message);
        navigate("/list");
      }
    };
    fetchSalary();
  }, [id, navigate]);

  const handleExportPDF = () => {
    console.log("Exporting salary details as PDF...");
  };

  if (!salaryData) return <div>Loading...</div>;

  return (
    <div className="max-w-lg mx-auto bg-gradient-to-br from-white to-pink-50 p-8 rounded-2xl shadow-xl transform transition-all duration-300 hover:shadow-2xl my-10 border border-pink-100">

      <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-8 tracking-wide">
        Salary Details
      </h2>

      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center p-3 bg-pink-50 rounded-lg shadow-sm">
          <strong className="text-gray-700 text-sm font-medium">Employee:</strong>
          <span className="text-pink-600 font-semibold">{salaryData.employeeName}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-pink-50 rounded-lg shadow-sm">
          <strong className="text-gray-700 text-sm font-medium">Base Salary:</strong>
          <span className="text-pink-600 font-semibold">Rs {salaryData.salaryAmount}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-pink-50 rounded-lg shadow-sm">
          <strong className="text-gray-700 text-sm font-medium">Bonuses:</strong>
          <span className="text-pink-600 font-semibold">Rs {salaryData.bonuses}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-pink-50 rounded-lg shadow-sm">
          <strong className="text-gray-700 text-sm font-medium">Deductions:</strong>
          <span className="text-pink-600 font-semibold">Rs {salaryData.deductions}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-pink-50 rounded-lg shadow-sm">
          <strong className="text-gray-700 text-sm font-medium">Net Pay:</strong>
          <span className="text-pink-600 font-semibold">Rs {salaryData.netPay}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-pink-50 rounded-lg shadow-sm">
          <strong className="text-gray-700 text-sm font-medium">Payment Date:</strong>
          <span className="text-pink-600 font-semibold">{new Date(salaryData.paymentDate).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-pink-50 rounded-lg shadow-sm">
          <strong className="text-gray-700 text-sm font-medium">Status:</strong>
          <span
            className={`font-semibold ${
              salaryData.status === "Paid" ? "text-green-600" : "text-red-600"
            }`}
          >
            {salaryData.status}
          </span>
        </div>
      </div>

      {/* Export as PDF Button */}
      <button
        onClick={handleExportPDF}
        className="relative w-full p-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
      >
        <span className="relative z-10">Export as PDF</span>
        <span className="absolute inset-0 rounded-lg bg-white opacity-0 hover:opacity-10 transition-opacity duration-300"></span>
      </button>
    </div>
  );
}

export default SalaryDetails;