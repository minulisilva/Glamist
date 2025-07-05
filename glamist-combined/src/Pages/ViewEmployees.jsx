import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaExclamationCircle, FaEdit, FaTrash, FaWhatsapp } from 'react-icons/fa';
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
  Select,
  Image,
  Avatar,
  useToast,
  Grid,
  IconButton,
  Center,
} from '@chakra-ui/react';

function ViewEmployees() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingEmp, setEditingEmp] = useState(null);
  const [editForm, setEditForm] = useState({
    EmployeeName: '',
    Role: '',
    Age: '',
    Address: '',
    Phone: '',
    HireDate: '',
    DepartmentId: '',
    Email: '',
  });
  const [editProfilePicture, setEditProfilePicture] = useState(null);
  const [departments, setDepartments] = useState([]);
  const toast = useToast();

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:3000/employees');
      setEmployees(response.data.employees);
      toast({
        title: 'Success',
        description: 'Employees loaded successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (error) {
      console.error('Error fetching employees:', error.response?.data || error.message);
      toast({
        title: 'Error',
        description: 'Failed to load employees',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:3000/departments');
      setDepartments(response.data.departments);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(searchTerm);
      let response;

      if (isObjectId) {
        response = await axios.get(`http://localhost:3000/employees/${searchTerm}`);
        setEmployees([response.data.employee]);
      } else {
        response = await axios.get(`http://localhost:3000/employees?name=${encodeURIComponent(searchTerm)}`);
        setEmployees(response.data.employees);
      }

      toast({
        title: 'Success',
        description: isObjectId ? 'Employee found!' : 'Employees found!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setSearchTerm('');
    } catch (error) {
      console.error('Error searching employee:', error.response?.data || error.message);
      toast({
        title: 'Error',
        description: 'No employees found',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEdit = (emp) => {
    setEditingEmp(emp._id);
    setEditForm({
      EmployeeName: emp.EmployeeName,
      Role: emp.Role,
      Age: emp.Age,
      Address: emp.Address,
      Phone: emp.Phone,
      HireDate: emp.HireDate,
      DepartmentId: emp.DepartmentId._id || emp.DepartmentId,
      Email: emp.Email || '',
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(editForm).forEach((key) => data.append(key, editForm[key]));
    if (editProfilePicture) data.append('ProfilePicture', editProfilePicture);

    try {
      const response = await axios.put(`http://localhost:3000/employees/${editingEmp}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setEmployees(employees.map((e) =>
        e._id === editingEmp ? response.data.employee : e
      ));
      setEditingEmp(null);
      setEditProfilePicture(null);
      toast({
        title: 'Success',
        description: 'Employee updated successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating employee:', error.response?.data || error.message);
      toast({
        title: 'Error',
        description: 'Failed to update employee',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await axios.delete(`http://localhost:3000/employees/${id}`);
      setEmployees(employees.filter((e) => e._id !== id));
      toast({
        title: 'Success',
        description: 'Employee deleted successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting employee:', error.response?.data || error.message);
      toast({
        title: 'Error',
        description: 'Failed to delete employee',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getWhatsAppLink = (phone) => {
    if (!phone) return '#';
    const cleanedPhone = phone.replace(/\D/g, '');
    const noLeadingZero = cleanedPhone.startsWith('0') ? cleanedPhone.slice(1) : cleanedPhone;
    const whatsappNumber = `+94${noLeadingZero}`;
    console.log('Cleaned WhatsApp Number:', whatsappNumber);
    return `https://wa.me/${whatsappNumber}`;
  };

  return (
    <Box p={10} bg="gray.50" minH="100vh">
      <Heading as="h1" size="xl" color="purple.600" mb={6} textAlign="center">
        View Employees
      </Heading>

      <form onSubmit={handleSearch}>
        <Flex mb={6} gap={4} justify="center">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter Employee ID or Name"
            width="250px"
            bg="white"
            borderColor="purple.300"
            focusBorderColor="purple.500"
            boxShadow="md"
          />
          <Button type="submit" colorScheme="purple" px={6}>
            Search
          </Button>
          <Button onClick={fetchEmployees} colorScheme="gray" px={6}>
            Show All
          </Button>
        </Flex>
      </form>

      {employees.length > 0 ? (
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
          {employees.map((emp) => (
            <Box
              key={emp._id}
              bg="white"
              p={6}
              rounded="lg"
              shadow="lg"
              borderWidth="1px"
              borderColor="gray.200"
              position="relative"
            >
              {editingEmp === emp._id ? (
                <form onSubmit={handleUpdate} encType="multipart/form-data">
                  <VStack spacing={4}>
                    <FormControl>
                      <Input
                        name="EmployeeName"
                        value={editForm.EmployeeName}
                        onChange={(e) => setEditForm({ ...editForm, EmployeeName: e.target.value })}
                        placeholder="Employee Name"
                        bg="white"
                        borderColor="purple.300"
                      />
                    </FormControl>
                    <FormControl>
                      <Input
                        name="Role"
                        value={editForm.Role}
                        onChange={(e) => setEditForm({ ...editForm, Role: e.target.value })}
                        placeholder="Role"
                        bg="white"
                        borderColor="purple.300"
                      />
                    </FormControl>
                    <FormControl>
                      <Input
                        type="number"
                        name="Age"
                        value={editForm.Age}
                        onChange={(e) => setEditForm({ ...editForm, Age: e.target.value })}
                        placeholder="Age"
                        bg="white"
                        borderColor="purple.300"
                      />
                    </FormControl>
                    <FormControl>
                      <Input
                        name="Address"
                        value={editForm.Address}
                        onChange={(e) => setEditForm({ ...editForm, Address: e.target.value })}
                        placeholder="Address"
                        bg="white"
                        borderColor="purple.300"
                      />
                    </FormControl>
                    <FormControl>
                      <Input
                        name="Phone"
                        value={editForm.Phone}
                        onChange={(e) => setEditForm({ ...editForm, Phone: e.target.value })}
                        placeholder="Phone"
                        bg="white"
                        borderColor="purple.300"
                      />
                    </FormControl>
                    <FormControl>
                      <Input
                        type="date"
                        name="HireDate"
                        value={new Date(editForm.HireDate).toISOString().split('T')[0]}
                        onChange={(e) => setEditForm({ ...editForm, HireDate: e.target.value })}
                        bg="white"
                        borderColor="purple.300"
                      />
                    </FormControl>
                    <FormControl>
                      <Select
                        name="DepartmentId"
                        value={editForm.DepartmentId}
                        onChange={(e) => setEditForm({ ...editForm, DepartmentId: e.target.value })}
                        placeholder="Select a department"
                        bg="white"
                        borderColor="purple.300"
                      >
                        {departments.map((dept) => (
                          <option key={dept._id} value={dept._id}>
                            {dept.DepartmentName}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl>
                      <Input
                        type="file"
                        name="ProfilePicture"
                        accept="image/*"
                        onChange={(e) => setEditProfilePicture(e.target.files[0])}
                        border="none"
                        p={1}
                      />
                    </FormControl>
                    <FormControl>
                      <Input
                        type="email"
                        name="Email"
                        value={editForm.Email}
                        onChange={(e) => setEditForm({ ...editForm, Email: e.target.value })}
                        placeholder="Email"
                        bg="white"
                        borderColor="purple.300"
                      />
                    </FormControl>
                    <HStack>
                      <Button type="submit" colorScheme="purple" size="sm">
                        Save
                      </Button>
                      <Button onClick={() => setEditingEmp(null)} colorScheme="gray" size="sm">
                        Cancel
                      </Button>
                    </HStack>
                  </VStack>
                </form>
              ) : (
                <Flex gap={4}>
                  <Box>
                    {emp.ProfilePicture ? (
                      <Image
                        src={`http://localhost:3000${emp.ProfilePicture}`}
                        alt={emp.EmployeeName}
                        boxSize="100px"
                        rounded="full"
                        objectFit="cover"
                        mb={2}
                      />
                    ) : (
                      <Avatar size="xl" bg="gray.200" name="No Image" mb={2} />
                    )}
                  </Box>
                  <VStack align="start" flex={1} spacing={1}>
                    <Heading as="h3" size="md" color="purple.600">
                      {emp.EmployeeName}
                    </Heading>
                    <Text color="gray.600">Role: {emp.Role}</Text>
                    <Text color="gray.600">Age: {emp.Age}</Text>
                    <Text color="gray.600">Address: {emp.Address}</Text>
                    <HStack>
                      <Text color="gray.600">Phone: {emp.Phone}</Text>
                      {emp.Phone && (
                        <a
                          href={getWhatsAppLink(emp.Phone)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Message on WhatsApp"
                        >
                          <IconButton
                            icon={<FaWhatsapp />}
                            colorScheme="green"
                            variant="ghost"
                            size="sm"
                            aria-label="WhatsApp"
                          />
                        </a>
                      )}
                    </HStack>
                    <Text color="gray.600">
                      Hire Date: {new Date(emp.HireDate).toLocaleDateString()}
                    </Text>
                    <Text color="gray.600">
                      Department: {emp.DepartmentId?.DepartmentName || 'Unknown'}
                    </Text>
                    <Text color="gray.600">Email: {emp.Email || 'Not set'}</Text>
                  </VStack>
                  <HStack position="absolute" top={4} right={4} spacing={2}>
                    <IconButton
                      icon={<FaEdit />}
                      colorScheme="purple"
                      variant="ghost"
                      onClick={() => handleEdit(emp)}
                      aria-label="Edit employee"
                    />
                    <IconButton
                      icon={<FaTrash />}
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => handleDelete(emp._id)}
                      aria-label="Delete employee"
                    />
                  </HStack>
                </Flex>
              )}
            </Box>
          ))}
        </Grid>
      ) : (
        <Text color="gray.500" textAlign="center">No employees found.</Text>
      )}

      <Center mt={6}>
        <Link to="/staff">
          <Button colorScheme="purple" variant="link" fontSize="lg">
            Back to Dashboard
          </Button>
        </Link>
      </Center>
    </Box>
  );
}

export default ViewEmployees;