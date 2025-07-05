import { Routes, Route, Link } from "react-router-dom";
import { Box, Flex, HStack, Container } from "@chakra-ui/react";
import AddSalary from "./Pages/AddSalary.jsx";
import SalaryList from "./Pages/SalaryList.jsx";
import SalaryDetails from "./Pages/SalaryDetails.jsx";
import EditSalary from "./Pages/EditSalary.jsx";
import DeleteSalary from "./Pages/DeleteSalary.jsx"; // Fixed capitalization
import SalaryDashboard from "./Pages/SalaryDashboard.jsx";
import SalaryPaymentProcessing from "./Pages/SalaryPaymentProcessing.jsx";

// Note: Removed BrowserRouter as Router since it should be in a parent component
function Salary() {
  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-r, pink.100, blue.100)"
      p={4}
    >
      <Container maxW="4xl" mb={8}>
        <HStack
          as="nav"
          bg="white"
          p={4}
          borderRadius="lg"
          shadow="md"
          spacing={8}
          justify="space-around"
        >
          <Link to="/" style={{ textDecoration: "none" }}>
            <Box
              color="pink.600"
              _hover={{ color: "pink.800" }}
              fontWeight="medium"
            >
              Add Salary
            </Box>
          </Link>
          <Link to="/list" style={{ textDecoration: "none" }}>
            <Box
              color="pink.600"
              _hover={{ color: "pink.800" }}
              fontWeight="medium"
            >
              Salary List
            </Box>
          </Link>
          <Link to="/dashboard" style={{ textDecoration: "none" }}>
            <Box
              color="pink.600"
              _hover={{ color: "pink.800" }}
              fontWeight="medium"
            >
              Dashboard
            </Box>
          </Link>
          <Link to="/process" style={{ textDecoration: "none" }}>
            <Box
              color="pink.600"
              _hover={{ color: "pink.800" }}
              fontWeight="medium"
            >
              Process Payments
            </Box>
          </Link>
        </HStack>
      </Container>

      <Routes>
        <Route path="/" element={<AddSalary />} />
        <Route path="/list" element={<SalaryList />} />
        <Route path="/details/:id" element={<SalaryDetails />} />
        <Route path="/edit/:id" element={<EditSalary />} />
        <Route path="/delete/:id" element={<DeleteSalary />} />
        <Route path="/dashboard" element={<SalaryDashboard />} />
        <Route path="/process" element={<SalaryPaymentProcessing />} />
      </Routes>
    </Box>
  );
}

export default Salary;