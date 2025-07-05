import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Button,
  TableContainer,
} from "@chakra-ui/react";

function SalaryPaymentProcessing() {
  const [salaryRecords, setSalaryRecords] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        const response = await getSalaryList(); // Note: getSalaryList needs to be implemented
        console.log("Fetched Salary Records:", response.data);
        setSalaryRecords(response.data);
      } catch (error) {
        console.error("Error fetching salary records:", error);
        alert("Error fetching salary records: " + (error.response?.data?.message || error.message));
      }
    };
    fetchSalaries();
  }, []);

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const newSelected = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      console.log("Selected IDs:", newSelected);
      return newSelected;
    });
  };

  const toggleSelectAll = () => {
    if (selected.length === salaryRecords.length) {
      setSelected([]);
      console.log("Selected IDs: []");
    } else {
      const allIds = salaryRecords.map((record) => record._id);
      setSelected(allIds);
      console.log("Selected IDs:", allIds);
    }
  };

  const handleMarkAsPaid = async () => {
    if (selected.length === 0) {
      alert("Please select at least one record to mark as paid.");
      return;
    }
    try {
      await processPayments(selected); // Note: processPayments needs to be implemented
      alert("Salary payments processed successfully!");
      const response = await getSalaryList();
      setSalaryRecords(response.data);
      setSelected([]);
    } catch (error) {
      console.error("Error processing salary payments:", error);
      alert("Error processing salary payments: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Box
      maxW="4xl"
      mx="auto"
      bgGradient="linear(to-br, white, pink.50)"
      p={8}
      borderRadius="2xl"
      shadow="xl"
      my={10}
      border="1px"
      borderColor="pink.100"
      transition="all 0.3s"
      _hover={{ shadow: "2xl" }}
    >
      <Heading
        as="h2"
        size="xl"
        textAlign="center"
        bgGradient="linear(to-r, pink.600, purple.600)"
        bgClip="text"
        mb={8}
      >
        Process Salary Payments
      </Heading>

      <TableContainer mb={6}>
        <Table variant="simple">
          <Thead>
            <Tr bgGradient="linear(to-r, pink.500, purple.600)">
              <Th color="white" borderTopLeftRadius="lg">
                <Checkbox
                  isChecked={selected.length === salaryRecords.length && salaryRecords.length > 0}
                  onChange={toggleSelectAll}
                  colorScheme="pink"
                  size="lg"
                />
              </Th>
              <Th color="white">Employee</Th>
              <Th color="white">Amount</Th>
              <Th color="white" borderTopRightRadius="lg">Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {salaryRecords.length > 0 ? (
              salaryRecords.map((record) => (
                <Tr
                  key={record._id}
                  borderBottom="1px"
                  borderColor="gray.200"
                  _hover={{ bg: "pink.50" }}
                  bg={selected.includes(record._id) ? "pink.100" : "transparent"}
                  transition="all 0.2s"
                >
                  <Td>
                    <Checkbox
                      isChecked={selected.includes(record._id)}
                      onChange={() => toggleSelect(record._id)}
                      colorScheme="pink"
                      size="lg"
                    />
                  </Td>
                  <Td color="gray.700" fontWeight="medium">{record.employeeName}</Td>
                  <Td color="gray.700" fontWeight="medium">Rs {record.salaryAmount}</Td>
                  <Td
                    color={record.status === "Paid" ? "green.600" : "red.600"}
                    fontWeight="semibold"
                  >
                    {record.status}
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={4} textAlign="center" color="gray.500" py={4}>
                  No records found.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>

      <Button
        onClick={handleMarkAsPaid}
        w="full"
        bgGradient="linear(to-r, pink.500, purple.600)"
        color="white"
        fontWeight="semibold"
        _hover={{
          bgGradient: "linear(to-r, pink.600, purple.700)",
          transform: "scale(1.05)",
        }}
        transition="all 0.3s"
        shadow="md"
        isDisabled={selected.length === 0}
      >
        Mark Selected as Paid
      </Button>
    </Box>
  );
}

export default SalaryPaymentProcessing;