import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";


function EditSalary() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    salaryAmount: "",
    bonuses: "",
    deductions: "",
    status: "",
  });
  const [salaryData, setSalaryData] = useState(null);

  useEffect(() => {
    const fetchSalary = async () => {
      try {
        const response = await getSalaryDetails(id);
        const salary = response.data;
        setSalaryData(salary);
        setFormData({
          employeeId: salary.employeeId,
          employeeName: salary.employeeName,
          salaryAmount: salary.salaryAmount,
          bonuses: salary.bonuses,
          deductions: salary.deductions,
          status: salary.status,
        });
      } catch (error) {
        alert("Error fetching salary record: " + error.response.data.message);
        navigate("/list");
      }
    };
    fetchSalary();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await editSalary(id, {
        salaryAmount: parseFloat(formData.salaryAmount),
        bonuses: parseFloat(formData.bonuses),
        deductions: parseFloat(formData.deductions),
        status: formData.status,
      });
      alert("Salary record updated successfully!");
      navigate("/list");
    } catch (error) {
      alert("Error updating salary record: " + error.response.data.message);
    }
  };

  if (!salaryData) return <div>Loading...</div>;

  return (
    <div className="max-w-lg mx-auto bg-gradient-to-br from-white to-pink-50 p-8 rounded-2xl shadow-xl transform transition-all duration-300 hover:shadow-2xl my-10 border border-pink-100">

      <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-8 tracking-wide">
        Edit Salary Record
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="relative">
          <label className="block mb-2 text-sm font-medium text-gray-700">Employee Name/ID</label>
          <input
            type="text"
            value={`${formData.employeeName} (${formData.employeeId})`}
            readOnly
            className="w-full p-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
          />
        </div>

        <div className="relative">
          <label className="block mb-2 text-sm font-medium text-gray-700">Salary Amount</label>
          <input
            type="number"
            name="salaryAmount"
            value={formData.salaryAmount}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-500 transition-all duration-200 placeholder-gray-400"
            placeholder="e.g., 1500"
            required
          />
        </div>

        <div className="relative">
          <label className="block mb-2 text-sm font-medium text-gray-700">Bonuses</label>
          <input
            type="number"
            name="bonuses"
            value={formData.bonuses}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-500 transition-all duration-200 placeholder-gray-400"
            placeholder="e.g., 100"
          />
        </div>

        <div className="relative">
          <label className="block mb-2 text-sm font-medium text-gray-700">Deductions</label>
          <input
            type="number"
            name="deductions"
            value={formData.deductions}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-500 transition-all duration-200 placeholder-gray-400"
            placeholder="e.g., 50"
          />
        </div>

        <div className="relative">
          <label className="block mb-2 text-sm font-medium text-gray-700">Payment Status</label>
          <select
            name="paymentStatus"
            value={formData.paymentStatus}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-500 transition-all duration-200 bg-white"
          >
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
          </select>
        </div>

        <button
          type="submit"
          className="relative w-full p-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
        >
          <span className="relative z-10">Update</span>
          <span className="absolute inset-0 rounded-lg bg-white opacity-0 hover:opacity-10 transition-opacity duration-300"></span>
        </button>
      </form>
    </div>
  );
}

export default EditSalary;