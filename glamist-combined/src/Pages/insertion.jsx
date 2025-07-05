import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  Text,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react';

function Insertion() {
  const [formData, setFormData] = useState({
    DepartmentName: '',
    Description: '',
  });
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.DepartmentName.trim()) {
      newErrors.DepartmentName = 'Department Name is required';
    }
    if (!formData.Description.trim()) {
      newErrors.Description = 'Description is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/departments', formData);
      console.log('Department added:', response.data);
      setFormData({ DepartmentName: '', Description: '' });
      setNotification({ type: 'success', message: 'Department added successfully!' });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Error adding department:', error.response?.data || error.message);
      setNotification({ type: 'error', message: 'Failed to add department' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <Box p={10} position="relative">
      <Heading as="h1" size="xl" color="purple.600" mb={6}>
        Add New Department
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
          <FormControl isInvalid={!!errors.DepartmentName}>
            <FormLabel fontWeight="semibold" color="purple.600">
              Department Name
            </FormLabel>
            <Input
              name="DepartmentName"
              value={formData.DepartmentName}
              onChange={handleChange}
              placeholder="Enter department name"
              focusBorderColor="purple.400"
            />
            {errors.DepartmentName && (
              <Text color="red.500" fontSize="sm">
                {errors.DepartmentName}
              </Text>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.Description}>
            <FormLabel fontWeight="semibold" color="purple.600">
              Description
            </FormLabel>
            <Textarea
              name="Description"
              value={formData.Description}
              onChange={handleChange}
              placeholder="Enter department description"
              rows={4}
              focusBorderColor="purple.400"
            />
            {errors.Description && (
              <Text color="red.500" fontSize="sm">
                {errors.Description}
              </Text>
            )}
          </FormControl>

          <Button
            type="submit"
            colorScheme="purple"
            width="full"
            size="lg"
            fontWeight="semibold"
          >
            Add Department
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

export default Insertion;