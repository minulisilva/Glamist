import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaExclamationCircle, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Heading,
  Input,
  Button,
  Flex,
  Text,
  VStack,
  HStack,
  FormControl,
  Textarea,
  Image,
  Avatar,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useToast,
  Grid,
  IconButton,
  Center,
} from '@chakra-ui/react';

function ViewDepartment() {
  const [departments, setDepartments] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [editingDept, setEditingDept] = useState(null);
  const [editForm, setEditForm] = useState({ DepartmentName: '', Description: '' });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const toast = useToast();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:3000/departments');
      setDepartments(response.data.departments);
      toast({
        title: 'Success',
        description: 'Departments loaded successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (error) {
      console.error('Error fetching departments:', error.response?.data || error.message);
      toast({
        title: 'Error',
        description: 'Failed to load departments',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    try {
      const response = await axios.get(`http://localhost:3000/departments/${searchId}`);
      setDepartments([response.data.departments]);
      toast({
        title: 'Success',
        description: 'Department found!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setSearchId('');
    } catch (error) {
      console.error('Error searching department:', error.response?.data || error.message);
      toast({
        title: 'Error',
        description: 'Department not found',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEdit = (dept) => {
    setEditingDept(dept._id);
    setEditForm({ DepartmentName: dept.DepartmentName, Description: dept.Description });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:3000/departments/${editingDept}`, editForm);
      setDepartments(departments.map((d) =>
        d._id === editingDept ? response.data.departments : d
      ));
      setEditingDept(null);
      toast({
        title: 'Success',
        description: 'Department updated successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating department:', error.response?.data || error.message);
      toast({
        title: 'Error',
        description: 'Failed to update department',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    try {
      await axios.delete(`http://localhost:3000/departments/${id}`);
      setDepartments(departments.filter((d) => d._id !== id));
      toast({
        title: 'Success',
        description: 'Department deleted successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting department:', error.response?.data || error.message);
      toast({
        title: 'Error',
        description: 'Failed to delete department',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchEmployeeDetails = async (employeeId) => {
    try {
      const response = await axios.get(`http://localhost:3000/employees/${employeeId}`);
      setSelectedEmployee(response.data.employee);
    } catch (error) {
      console.error('Error fetching employee details:', error.response?.data || error.message);
      toast({
        title: 'Error',
        description: 'Failed to load employee details',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEmployeeClick = (employeeId) => {
    fetchEmployeeDetails(employeeId);
  };

  const closeModal = () => {
    setSelectedEmployee(null);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
  };

  return (
    <Box p={10} minH="100vh" bg="gray.50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Heading as="h1" size="xl" color="purple.600" mb={8} textAlign="center">
          View Departments
        </Heading>
      </motion.div>

      <motion.form
        onSubmit={handleSearch}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Flex justify="center" mb={8} gap={4}>
          <Input
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter Department ID"
            width="250px"
            bg="white"
            borderColor="purple.300"
            focusBorderColor="purple.500"
            boxShadow="md"
          />
          <Button type="submit" colorScheme="purple" px={6}>
            Search
          </Button>
          <Button onClick={fetchDepartments} colorScheme="gray" px={6}>
            Show All
          </Button>
        </Flex>
      </motion.form>

      <AnimatePresence>
        {departments.length > 0 ? (
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6} maxW="5xl" mx="auto">
            {departments.map((dept) => (
              <motion.div
                key={dept._id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Box
                  bg="white"
                  p={6}
                  rounded="lg"
                  shadow="lg"
                  borderWidth="1px"
                  borderColor="gray.200"
                  position="relative"
                >
                  {editingDept === dept._id ? (
                    <motion.form
                      onSubmit={handleUpdate}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <VStack spacing={4}>
                        <FormControl>
                          <Input
                            value={editForm.DepartmentName}
                            onChange={(e) => setEditForm({ ...editForm, DepartmentName: e.target.value })}
                            placeholder="Department Name"
                            bg="white"
                            borderColor="purple.300"
                          />
                        </FormControl>
                        <FormControl>
                          <Textarea
                            value={editForm.Description}
                            onChange={(e) => setEditForm({ ...editForm, Description: e.target.value })}
                            placeholder="Description"
                            bg="white"
                            borderColor="purple.300"
                            rows={3}
                          />
                        </FormControl>
                        <HStack>
                          <Button type="submit" colorScheme="purple" size="sm">
                            Save
                          </Button>
                          <Button onClick={() => setEditingDept(null)} colorScheme="gray" size="sm">
                            Cancel
                          </Button>
                        </HStack>
                      </VStack>
                    </motion.form>
                  ) : (
                    <>
                      <Heading as="h3" size="md" color="purple.600" mb={3}>
                        {dept.DepartmentName}
                      </Heading>
                      <Text color="gray.600" mb={2}>{dept.Description}</Text>
                      <Text color="gray.600">
                        Total Employees: <Text as="span" fontWeight="semibold" color="purple.600">{dept.EmployeeCount}</Text>
                      </Text>
                      <Box mt={4}>
                        <Text color="gray.600" mb={2}>Workers:</Text>
                        <Flex wrap="wrap" gap={3}>
                          {dept.employees.length > 0 ? (
                            dept.employees.map((emp) => (
                              <motion.div
                                key={emp._id}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleEmployeeClick(emp._id)}
                                cursor="pointer"
                              >
                                {emp.ProfilePicture ? (
                                  <Avatar
                                    src={`http://localhost:3000${emp.ProfilePicture}`}
                                    size="md"
                                    borderWidth="2px"
                                    borderColor="purple.500"
                                  />
                                ) : (
                                  <Avatar size="md" bg="gray.200" color="gray.500" name="No Pic" />
                                )}
                              </motion.div>
                            ))
                          ) : (
                            <Text color="gray.600">None</Text>
                          )}
                        </Flex>
                      </Box>
                      <HStack position="absolute" top={4} right={4} spacing={3}>
                        <IconButton
                          icon={<FaEdit />}
                          colorScheme="purple"
                          variant="ghost"
                          onClick={() => handleEdit(dept)}
                          aria-label="Edit department"
                        />
                        <IconButton
                          icon={<FaTrash />}
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => handleDelete(dept._id)}
                          aria-label="Delete department"
                        />
                      </HStack>
                    </>
                  )}
                </Box>
              </motion.div>
            ))}
          </Grid>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Text color="gray.500" textAlign="center">No departments found.</Text>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Employee Details Modal */}
      <Modal isOpen={!!selectedEmployee} onClose={closeModal} isCentered>
        <ModalOverlay bg="blackAlpha.600" />
        <ModalContent
          bg="gray.800"
          color="white"
          rounded="lg"
          shadow="xl"
          borderWidth="1px"
          borderColor="gray.700"
          maxW="md"
          as={motion.div}
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <ModalCloseButton />
          <ModalBody p={6} textAlign="center">
            {selectedEmployee?.ProfilePicture ? (
              <Image
                src={`http://localhost:3000${selectedEmployee.ProfilePicture}`}
                alt={selectedEmployee.EmployeeName}
                boxSize="100px"
                rounded="full"
                objectFit="cover"
                borderWidth="4px"
                borderColor="purple.500"
                mb={4}
                mx="auto"
              />
            ) : (
              <Avatar size="xl" bg="gray.700" name="No Pic" mb={4} />
            )}
            <Heading as="h3" size="lg" color="purple.400" mb={3}>
              {selectedEmployee?.EmployeeName}
            </Heading>
            <VStack spacing={2} align="start" color="gray.200">
              <Text><Text as="span" fontWeight="semibold" color="gray.100">Role:</Text> {selectedEmployee?.Role}</Text>
              <Text><Text as="span" fontWeight="semibold" color="gray.100">Age:</Text> {selectedEmployee?.Age}</Text>
              <Text><Text as="span" fontWeight="semibold" color="gray.100">Address:</Text> {selectedEmployee?.Address}</Text>
              <Text><Text as="span" fontWeight="semibold" color="gray.100">Phone:</Text> {selectedEmployee?.Phone}</Text>
              <Text><Text as="span" fontWeight="semibold" color="gray.100">Hire Date:</Text> {selectedEmployee?.HireDate ? new Date(selectedEmployee.HireDate).toLocaleDateString() : 'N/A'}</Text>
              <Text><Text as="span" fontWeight="semibold" color="gray.100">Department:</Text> {selectedEmployee?.DepartmentId?.DepartmentName || 'Unknown'}</Text>
              <Text><Text as="span" fontWeight="semibold" color="gray.100">Email:</Text> {selectedEmployee?.Email}</Text>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Center mt={8}>
          <Link to="/staff">
            <Button colorScheme="purple" variant="link" fontSize="lg">
              Back to Dashboard
            </Button>
          </Link>
        </Center>
      </motion.div>
    </Box>
  );
}

export default ViewDepartment;