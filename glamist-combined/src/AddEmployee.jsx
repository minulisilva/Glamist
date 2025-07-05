import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  useToast,
  useColorMode,
} from '@chakra-ui/react';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { useLanguage } from './LanguageContext';
import { useTheme } from './ThemeContext';

function AddEmployee() {
  const { t } = useLanguage();
  const { currentTheme, colorMode } = useTheme();
  const { colorMode: chakraColorMode } = useColorMode();
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    EmployeeName: '',
    Role: '',
    Age: '',
    Address: '',
    Phone: '',
    HireDate: new Date().toISOString().split('T')[0],
    DepartmentId: '',
    Email: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/department', {
          withCredentials: true,
        });
        setDepartments(response.data.departments);
      } catch (error) {
        console.error('Error fetching departments:', error);
        toast({
          title: t('error'),
          description: t('failedToFetchDepartments'),
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };
    fetchDepartments();
  }, [t, toast]);

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
    if (!formData.EmployeeName.trim()) newErrors.EmployeeName = t('employeeNameRequired');
    if (!formData.Role.trim()) newErrors.Role = t('roleRequired');
    if (!formData.Age || isNaN(formData.Age) || formData.Age <= 0) newErrors.Age = t('validAgeRequired');
    if (!formData.Address.trim()) newErrors.Address = t('addressRequired');
    if (!formData.Phone.trim()) newErrors.Phone = t('phoneRequired');
    if (!formData.DepartmentId) newErrors.DepartmentId = t('departmentRequired');
    if (!formData.Email.trim() || !/^\S+@\S+\.\S+$/.test(formData.Email)) newErrors.Email = t('validEmailRequired');

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (profilePicture) data.append('ProfilePicture', profilePicture);

    try {
      await axios.post('http://localhost:4000/api/employee', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
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
      toast({
        title: t('success'),
        description: t('employeeAddedSuccess'),
        status: 'success',
        duration: 3000,
        isClosable: true,
        icon: <FaCheckCircle />,
      });
      navigate('/view-employees');
    } catch (error) {
      console.error('Error adding employee:', error.response?.data || error.message);
      toast({
        title: t('error'),
        description: t('failedToAddEmployee'),
        status: 'error',
        duration: 3000,
        isClosable: true,
        icon: <FaExclamationCircle />,
      });
    }
  };

  return (
    <Box
      py={10}
      px={{ base: 4, md: 10 }}
      bg={chakraColorMode === 'light' ? 'gray.50' : 'gray.900'}
      minH="100vh"
    >
      <Heading
        as="h1"
        size="2xl"
        fontFamily="'Playfair Display', serif"
        color={currentTheme.primaryColor}
        mb={6}
      >
        {t('addEmployee')}
      </Heading>

      <Box maxW="lg" bg={chakraColorMode === 'light' ? 'white' : 'gray.700'} p={6} rounded="2xl" shadow="lg">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <VStack spacing={6}>
            <FormControl isInvalid={!!errors.EmployeeName}>
              <FormLabel fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>
                {t('employeeName')}
              </FormLabel>
              <Input
                name="EmployeeName"
                value={formData.EmployeeName}
                onChange={handleChange}
                placeholder={t('enterEmployeeName')}
                focusBorderColor={currentTheme.primaryColor}
              />
              {errors.EmployeeName && <Text color="red.500" fontSize="sm">{errors.EmployeeName}</Text>}
            </FormControl>

            <FormControl isInvalid={!!errors.Role}>
              <FormLabel fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>
                {t('role')}
              </FormLabel>
              <Input
                name="Role"
                value={formData.Role}
                onChange={handleChange}
                placeholder={t('enterRole')}
                focusBorderColor={currentTheme.primaryColor}
              />
              {errors.Role && <Text color="red.500" fontSize="sm">{errors.Role}</Text>}
            </FormControl>

            <FormControl isInvalid={!!errors.Age}>
              <FormLabel fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>
                {t('age')}
              </FormLabel>
              <Input
                type="number"
                name="Age"
                value={formData.Age}
                onChange={handleChange}
                placeholder={t('enterAge')}
                focusBorderColor={currentTheme.primaryColor}
              />
              {errors.Age && <Text color="red.500" fontSize="sm">{errors.Age}</Text>}
            </FormControl>

            <FormControl isInvalid={!!errors.Address}>
              <FormLabel fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>
                {t('address')}
              </FormLabel>
              <Input
                name="Address"
                value={formData.Address}
                onChange={handleChange}
                placeholder={t('enterAddress')}
                focusBorderColor={currentTheme.primaryColor}
              />
              {errors.Address && <Text color="red.500" fontSize="sm">{errors.Address}</Text>}
            </FormControl>

            <FormControl isInvalid={!!errors.Phone}>
              <FormLabel fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>
                {t('phone')}
              </FormLabel>
              <Input
                name="Phone"
                value={formData.Phone}
                onChange={handleChange}
                placeholder={t('enterPhone')}
                focusBorderColor={currentTheme.primaryColor}
              />
              {errors.Phone && <Text color="red.500" fontSize="sm">{errors.Phone}</Text>}
            </FormControl>

            <FormControl>
              <FormLabel fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>
                {t('hireDate')}
              </FormLabel>
              <Input
                type="date"
                name="HireDate"
                value={formData.HireDate}
                onChange={handleChange}
                focusBorderColor={currentTheme.primaryColor}
              />
            </FormControl>

            <FormControl isInvalid={!!errors.DepartmentId}>
              <FormLabel fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>
                {t('department')}
              </FormLabel>
              <Select
                name="DepartmentId"
                value={formData.DepartmentId}
                onChange={handleChange}
                placeholder={t('selectDepartment')}
                focusBorderColor={currentTheme.primaryColor}
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
              <FormLabel fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>
                {t('email')}
              </FormLabel>
              <Input
                type="email"
                name="Email"
                value={formData.Email}
                onChange={handleChange}
                placeholder={t('enterEmail')}
                focusBorderColor={currentTheme.primaryColor}
              />
              {errors.Email && <Text color="red.500" fontSize="sm">{errors.Email}</Text>}
            </FormControl>

            <FormControl>
              <FormLabel fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>
                {t('profilePicture')}
              </FormLabel>
              <Input
                type="file"
                name="ProfilePicture"
                accept="image/*"
                onChange={handleFileChange}
                p={1}
                border="none"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme={currentTheme.primaryColor.split('.')[0]}
              size="lg"
              w="full"
              borderRadius="full"
              _hover={{ transform: 'scale(1.05)' }}
            >
              {t('addEmployee')}
            </Button>
          </VStack>
        </form>
      </Box>

      <Link to="/">
        <Button
          variant="link"
          color={currentTheme.primaryColor}
          mt={6}
          _hover={{ textDecoration: 'underline' }}
        >
          {t('backToDashboard')}
        </Button>
      </Link>
    </Box>
  );
}

export default AddEmployee;