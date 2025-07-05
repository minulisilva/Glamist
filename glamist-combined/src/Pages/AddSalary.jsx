import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Button,
  VStack,
} from "@chakra-ui/react";

function AddSalary() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    salaryAmount: "",
    paymentFrequency: "Hourly",
    paymentDate: "",
    bonuses: "",
    deductions: "",
    notes: "",
  });

  useEffect(() => {
    const timestamp = Date.now().toString().slice(-6);
    const generatedId = `E${timestamp}`;
    setFormData((prev) => ({ ...prev, employeeId: generatedId }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      salaryAmount: parseFloat(formData.salaryAmount),
      bonuses: formData.bonuses ? parseFloat(formData.bonuses) : 0,
      deductions: formData.deductions ? parseFloat(formData.deductions) : 0,
    };
    console.log("Submitting Data:", formattedData);
    try {
      await addSalary(formattedData); // Note: addSalary function needs to be implemented
      alert("Salary record added successfully!");
      navigate("/list");
    } catch (error) {
      console.error("Error adding salary record:", error);
      alert("Error adding salary record: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Box
      maxW="lg"
      mx="auto"
      bg="white"
      p={8}
      borderRadius="xl"
      shadow="lg"
      my={10}
      transition="all 0.3s"
      _hover={{ shadow: "2xl" }}
    >
      <Heading
        as="h2"
        size="xl"
        textAlign="center"
        color="pink.600"
        mb={8}
      >
        Add New Salary Record
      </Heading>
      
      <form onSubmit={handleSubmit}>
        <VStack spacing={6}>
          <FormControl isRequired>
            <FormLabel color="gray.700">Employee ID</FormLabel>
            <Input
              name="employeeId"
              value={formData.employeeId}
              isReadOnly
              bg="gray.100"
              color="gray.600"
              cursor="not-allowed"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel color="gray.700">Employee Name</FormLabel>
            <Input
              name="employeeName"
              value={formData.employeeName}
              onChange={handleChange}
              placeholder="example: Krish Alwis"
              focusBorderColor="pink.500"
              _placeholder={{ color: "gray.400" }}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel color="gray.700">Salary Amount</FormLabel>
            <Input
              type="number"
              name="salaryAmount"
              value={formData.salaryAmount}
              onChange={handleChange}
              placeholder="example: 15000"
              focusBorderColor="pink.500"
              _placeholder={{ color: "gray.400" }}
            />
          </FormControl>

          <FormControl>
            <FormLabel color="gray.700">Payment Frequency</FormLabel>
            <Select
              name="paymentFrequency"
              value={formData.paymentFrequency}
              onChange={handleChange}
              focusBorderColor="pink.500"
            >
              <option value="Hourly">Hourly</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel color="gray.700">Payment Date</FormLabel>
            <Input
              type="date"
              name="paymentDate"
              value={formData.paymentDate}
              onChange={handleChange}
              focusBorderColor="pink.500"
            />
          </FormControl>

          <FormControl>
            <FormLabel color="gray.700">Bonuses</FormLabel>
            <Input
              type="number"
              name="bonuses"
              value={formData.bonuses}
              onChange={handleChange}
              placeholder="example: 100"
              focusBorderColor="pink.500"
              _placeholder={{ color: "gray.400" }}
            />
          </FormControl>

          <FormControl>
            <FormLabel color="gray.700">Deductions</FormLabel>
            <Input
              type="number"
              name="deductions"
              value={formData.deductions}
              onChange={handleChange}
              placeholder="example: 50"
              focusBorderColor="pink.500"
              _placeholder={{ color: "gray.400" }}
            />
          </FormControl>

          <FormControl>
            <FormLabel color="gray.700">Notes</FormLabel>
            <Textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional notes"
              focusBorderColor="pink.500"
              _placeholder={{ color: "gray.400" }}
              resize="none"
              h="32"
            />
          </FormControl>

          <Button
            type="submit"
            w="full"
            bgGradient="linear(to-r, pink.500, pink.700)"
            color="white"
            fontWeight="semibold"
            _hover={{
              bgGradient: "linear(to-r, pink.600, pink.800)",
              transform: "scale(1.05)",
            }}
            transition="all 0.3s"
          >
            Save
          </Button>
        </VStack>
      </form>
    </Box>
  );
}

export default AddSalary;