// src/App.jsx
import { FaUserPlus, FaClipboardCheck, FaBuildingColumns, FaList, FaUsers } from 'react-icons/fa6';
import { Link, Routes, Route } from 'react-router-dom';
import { Box, Flex, VStack, Heading, Grid, Button, Icon, chakra } from '@chakra-ui/react';
import Insertion from './Pages/insertion.jsx';
import ViewDepartment from './Pages/ViewDepartments.jsx';
import AddEmployee from './Pages/AddEmployee.jsx';
import ViewEmployees from './Pages/ViewEmployees.jsx';
import MarkAttendance from './Pages/MarkAttendance.jsx';

function Staff() {
  return (
    <Flex h="100vh">
      <Box w="20%" bg="purple.800" color="white" p={6} shadow="lg">
        <Heading size="lg" mb={10}>Dashboard</Heading>
        <VStack spacing={4} align="start">
          <Button
            w="full"
            bg="purple.700"
            color="white"
            leftIcon={<chakra.span fontSize="xl">📊</chakra.span>}
            _hover={{ bg: 'purple.600' }}
            variant="solid"
          >
            Overview
          </Button>
          <Button
            w="full"
            variant="ghost"
            leftIcon={<chakra.span fontSize="xl">📅</chakra.span>}
            _hover={{ bg: 'purple.700', borderRadius: 'lg' }}
          >
            Appointments
          </Button>
          <Button
            w="full"
            variant="ghost"
            leftIcon={<chakra.span fontSize="xl">📈</chakra.span>}
            _hover={{ bg: 'purple.700', borderRadius: 'lg' }}
          >
            Reports
          </Button>
        </VStack>
      </Box>

      <Box w="80%" p={10}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Heading size="2xl" color="purple.700" mb={12}>
                  Salon Management System
                </Heading>
                <Grid templateColumns="repeat(3, 1fr)" gap={8}>
                  <Link to="/add-employee">
                    <Box
                      bg="white"
                      p={8}
                      borderRadius="2xl"
                      shadow="xl"
                      textAlign="center"
                      transition="all 0.3s"
                      _hover={{ transform: 'scale(1.05)' }}
                      position="relative"
                      overflow="hidden"
                    >
                      <Box
                        bg="purple.600"
                        p={4}
                        borderRadius="full"
                        mb={6}
                        _groupHover={{ bg: 'purple.500' }}
                        transition="all 0.3s"
                      >
                        <Icon as={FaUserPlus} color="white" boxSize={10} />
                      </Box>
                      <Heading
                        size="md"
                        color="purple.600"
                        _groupHover={{ color: 'purple.700' }}
                        transition="all 0.3s"
                      >
                        Add Employee
                      </Heading>
                    </Box>
                  </Link>

                  <Link to="/mark-attendance">
                    <Box
                      bg="white"
                      p={8}
                      borderRadius="2xl"
                      shadow="xl"
                      textAlign="center"
                      transition="all 0.3s"
                      _hover={{ transform: 'scale(1.05)' }}
                      position="relative"
                    >
                      <Box
                        bg="purple.600"
                        p={4}
                        borderRadius="full"
                        mb={6}
                        _groupHover={{ bg: 'purple.500' }}
                        transition="all 0.3s"
                      >
                        <Icon as={FaClipboardCheck} color="white" boxSize={10} />
                      </Box>
                      <Heading
                        size="md"
                        color="purple.600"
                        _groupHover={{ color: 'purple.700' }}
                        transition="all 0.3s"
                      >
                        Mark Attendance
                      </Heading>
                    </Box>
                  </Link>

                  <Link to="/add-department">
                    <Box
                      bg="white"
                      p={8}
                      borderRadius="2xl"
                      shadow="xl"
                      textAlign="center"
                      transition="all 0.3s"
                      _hover={{ transform: 'scale(1.05)' }}
                      position="relative"
                    >
                      <Box
                        bg="purple.600"
                        p={4}
                        borderRadius="full"
                        mb={6}
                        _groupHover={{ bg: 'purple.500' }}
                        transition="all 0.3s"
                      >
                        <Icon as={FaBuildingColumns} color="white" boxSize={10} />
                      </Box>
                      <Heading
                        size="md"
                        color="purple.600"
                        _groupHover={{ color: 'purple.700' }}
                        transition="all 0.3s"
                      >
                        Add Department
                      </Heading>
                    </Box>
                  </Link>

                  <Link to="/departments">
                    <Box
                      bg="white"
                      p={8}
                      borderRadius="2xl"
                      shadow="xl"
                      textAlign="center"
                      transition="all 0.3s"
                      _hover={{ transform: 'scale(1.05)' }}
                      position="relative"
                    >
                      <Box
                        bg="purple.600"
                        p={4}
                        borderRadius="full"
                        mb={6}
                        _groupHover={{ bg: 'purple.500' }}
                        transition="all 0.3s"
                      >
                        <Icon as={FaList} color="white" boxSize={10} />
                      </Box>
                      <Heading
                        size="md"
                        color="purple.600"
                        _groupHover={{ color: 'purple.700' }}
                        transition="all 0.3s"
                      >
                        View Departments
                      </Heading>
                    </Box>
                  </Link>

                  <Link to="/employees">
                    <Box
                      bg="white"
                      p={8}
                      borderRadius="2xl"
                      shadow="xl"
                      textAlign="center"
                      transition="all 0.3s"
                      _hover={{ transform: 'scale(1.05)' }}
                      position="relative"
                    >
                      <Box
                        bg="purple.600"
                        p={4}
                        borderRadius="full"
                        mb={6}
                        _groupHover={{ bg: 'purple.500' }}
                        transition="all 0.3s"
                      >
                        <Icon as={FaUsers} color="white" boxSize={10} />
                      </Box>
                      <Heading
                        size="md"
                        color="purple.600"
                        _groupHover={{ color: 'purple.700' }}
                        transition="all 0.3s"
                      >
                        View Employees
                      </Heading>
                    </Box>
                  </Link>
                </Grid>
              </>
            }
          />
          <Route path="/add-department" element={<Insertion />} />
          <Route path="/departments" element={<ViewDepartment />} />
          <Route path="/add-employee" element={<AddEmployee />} />
          <Route path="/employees" element={<ViewEmployees />} />
          <Route path="/mark-attendance" element={<MarkAttendance />} />
        </Routes>
      </Box>
    </Flex>
  );
}

export default Staff;