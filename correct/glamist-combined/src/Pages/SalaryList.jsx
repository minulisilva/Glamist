import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  HStack,
  TableContainer,
} from "@chakra-ui/react";

function SalaryList() {
  const navigate = useNavigate();
  const [salaryRecords, setSalaryRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        const response = await getSalaryList(); // Note: getSalaryList needs to be implemented
        setSalaryRecords(response.data);
      } catch (error) {
        alert("Error fetching salary records: " + error.response?.data?.message);
      }
    };
    fetchSalaries();
  }, []);

  const filteredRecords = salaryRecords.filter(
    (record) =>
      record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (id) => {
    navigate(`/details/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  const handleDelete = (id) => {
    navigate(`/delete/${id}`);
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
        Salary Overview
      </Heading>

      <Input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by employee name or ID"
        mb={6}
        bg="white"
        borderColor="gray.300"
        focusBorderColor="pink.500"
        _placeholder={{ color: "gray.400" }}
        shadow="sm"
      />

      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr bgGradient="linear(to-r, pink.500, purple.600)">
              <Th color="white" borderTopLeftRadius="lg">Employee</Th>
              <Th color="white">Amount</Th>
              <Th color="white">Date</Th>
              <Th color="white">Status</Th>
              <Th color="white" borderTopRightRadius="lg">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <Tr
                  key={record.id}
                  borderBottom="1px"
                  borderColor="gray.200"
                  _hover={{ bg: "pink.50" }}
                  transition="all 0.2s"
                >
                  <Td color="gray.700" fontWeight="medium">{record.employeeName}</Td>
                  <Td color="gray.700" fontWeight="medium">Rs {record.salaryAmount}</Td>
                  <Td color="gray.700" fontWeight="medium">
                    {new Date(record.paymentDate).toLocaleDateString()}
                  </Td>
                  <Td
                    color={record.status === "Paid" ? "green.600" : "red.600"}
                    fontWeight="semibold"
                  >
                    {record.status}
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <Button
                        onClick={() => handleView(record._id)}
                        bgGradient="linear(to-r, blue.500, blue.600)"
                        color="white"
                        size="sm"
                        fontWeight="semibold"
                        _hover={{
                          bgGradient: "linear(to-r, blue.600, blue.700)",
                          transform: "scale(1.05)",
                        }}
                        transition="all 0.3s"
                        shadow="md"
                      >
                        View
                      </Button>
                      <Button
                        onClick={() => handleEdit(record._id)}
                        bgGradient="linear(to-r, green.500, green.600)"
                        color="white"
                        size="sm"
                        fontWeight="semibold"
                        _hover={{
                          bgGradient: "linear(to-r, green.600, green.700)",
                          transform: "scale(1.05)",
                        }}
                        transition="all 0.3s"
                        shadow="md"
                      >
                        Update
                      </Button>
                      <Button
                        onClick={() => handleDelete(record._id)}
                        bgGradient="linear(to-r, red.500, red.600)"
                        color="white"
                        size="sm"
                        fontWeight="semibold"
                        _hover={{
                          bgGradient: "linear(to-r, red.600, red.700)",
                          transform: "scale(1.05)",
                        }}
                        transition="all 0.3s"
                        shadow="md"
                      >
                        Delete
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={5} textAlign="center" color="gray.500" py={4}>
                  No records found.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default SalaryList;