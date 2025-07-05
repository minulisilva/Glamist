import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  VStack,
  Text,
  Flex,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react';

function AddEmployee() {
  const [formData, setFormData] = useState({
    EmployeeName: '',
    Role: '',
    Age: '',
    Address: '',
    Phone: '',
    HireDate: new Date().toISOString().split('T')[0], // Default to today
    DepartmentId: '',
    Email: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:3000/departments');
        setDepartments(response.data.departments);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.EmployeeName.trim()) newErrors.EmployeeName = 'Employee Name is required';
    if (!formData.Role.trim()) newErrors.Role = 'Role is required';
    if (!formData.Age || isNaN(formData.Age) || formData.Age <= 0) newErrors.Age = 'Valid Age is required';
    if (!formData.Address.trim()) newErrors.Address = 'Address is required';
    if (!formData.Phone.trim()) newErrors.Phone = 'Phone is required';
    if (!formData.DepartmentId) newErrors.DepartmentId = 'Department is required';
    if (!formData.Email.trim() || !/^\S+@\S+\.\S+$/.test(formData.Email)) newErrors.Email = 'Valid Email is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (profilePicture) data.append('ProfilePicture', profilePicture);

    try {
      const response = await axios.post('http://localhost:3000/employees', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Employee added:', response.data);
      setFormData({
        EmployeeName: '',
        Role: '',
        Age: '',
        Address: '',
        Phone: '',
        HireDate: new Date().toISOString().split('T')[0],
        DepartmentId: '',
        Email: '',
      });
      setProfilePicture(null);
      setNotification({ type: 'success', message: 'Employee added successfully!' });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Error adding employee:', error.response?.data || error.message);
      setNotification({ type: 'error', message: 'Failed to add employee' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <Box p={10} position="relative">
      <Heading as="h1" size="xl" color="purple.600" mb={6}>
        Add New Employee
      </Heading>

      {notification && (
        <Alert
          status={notification.type === 'success' ? 'success' : 'error'}
          position="fixed"
          top={4}
          right={4}
          width="auto"
          borderRadius="lg"
          boxShadow="lg"
          p={4}
        >
          <AlertIcon />
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}

      <Box as="form" onSubmit={handleSubmit} maxW="lg" bg="white" p={6} borderRadius="2xl" boxShadow="xl">
        <VStack spacing={6}>
          <FormControl isInvalid={!!errors.EmployeeName}>
            <FormLabel fontWeight="semibold" color="purple.600">
              Employee Name
            </FormLabel>
            <Input
              name="EmployeeName"
              value={formData.EmployeeName}
              onChange={handleChange}
              placeholder="Enter employee name"
              focusBorderColor="purple.400"
            />
            {errors.EmployeeName && <Text color="red.500" fontSize="sm">{errors.EmployeeName}</Text>}
          </FormControl>

          <FormControl isInvalid={!!errors.Role}>
            <FormLabel fontWeight="semibold" color="purple.600">
              Role
            </FormLabel>
            <Input
              name="Role"
              value={formData.Role}
              onChange={handleChange}
              placeholder="Enter role"
              focusBorderColor="purple.400"
            />
            {errors.Role && <Text color="red.500" fontSize="sm">{errors.Role}</Text>}
          </FormControl>

          <FormControl isInvalid={!!errors.Age}>
            <FormLabel fontWeight="semibold" color="purple.600">
              Age
            </FormLabel>
            <Input
              type="number"
              name="Age"
              value={formData.Age}
              onChange={handleChange}
              placeholder="Enter age"
              focusBorderColor="purple.400"
            />
            {errors.Age && <Text color="red.500" fontSize="sm">{errors.Age}</Text>}
          </FormControl>

          <FormControl isInvalid={!!errors.Address}>
            <FormLabel fontWeight="semibold" color="purple.600">
              Address
            </FormLabel>
            <Input
              name="Address"
              value={formData.Address}
              onChange={handleChange}
              placeholder="Enter address"
              focusBorderColor="purple.400"
            />
            {errors.Address && <Text color="red.500" fontSize="sm">{errors.Address}</Text>}
          </FormControl>

          <FormControl isInvalid={!!errors.Phone}>
            <FormLabel fontWeight="semibold" color="purple.600">
              Phone
            </FormLabel>
            <Input
              name="Phone"
              value={formData.Phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              focusBorderColor="purple.400"
            />
            {errors.Phone && <Text color="red.500" fontSize="sm">{errors.Phone}</Text>}
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="semibold" color="purple.600">
              Hire Date
            </FormLabel>
            <Input
              type="date"
              name="HireDate"
              value={formData.HireDate}
              onChange={handleChange}
              focusBorderColor="purple.400"
            />
          </FormControl>

          <FormControl isInvalid={!!errors.DepartmentId}>
            <FormLabel fontWeight="semibold" color="purple.600">
              Department
            </FormLabel>
            <Select
              name="DepartmentId"
              value={formData.DepartmentId}
              onChange={handleChange}
              placeholder="Select a department"
              focusBorderColor="purple.400"
            >
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.DepartmentName}
                </option>
              ))}
            </Select>
            {errors.DepartmentId && <Text color="red.500" fontSize="sm">{errors.DepartmentId}</Text>}
          </FormControl>

          <FormControl isInvalid={!!errors.Email}>
            <FormLabel fontWeight="semibold" color="purple.600">
              Email
            </FormLabel>
            <Input
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              placeholder="Enter email"
              focusBorderColor="purple.400"
            />
            {errors.Email && <Text color="red.500" fontSize="sm">{errors.Email}</Text>}
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="semibold" color="purple.600">
              Profile Picture
            </FormLabel>
            <Input
              type="file"
              name="ProfilePicture"
              accept="image/*"
              onChange={handleFileChange}
              border="none"
              p={1}
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="purple"
            width="full"
            size="lg"
            fontWeight="semibold"
          >
            Add Employee
          </Button>
        </VStack>
      </Box>

      <Button
        as={RouterLink}
        to="/staff"
        variant="link"
        color="purple.600"
        mt={6}
        _hover={{ textDecoration: 'underline' }}
      >
        Back to Dashboard
      </Button>
    </Box>
  );
}

export default AddEmployee;