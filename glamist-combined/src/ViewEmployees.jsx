import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Container,
  Heading,
  Input,
  Button,
  VStack,
  Grid,
  Text,
  Image,
  useToast,
  Flex,
  IconButton,
  FormControl,
  FormLabel,
  Select,
} from '@chakra-ui/react';
import { FaCheckCircle, FaExclamationCircle, FaEdit, FaTrash, FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useLanguage } from './LanguageContext';
import { useTheme } from './ThemeContext';

const MotionBox = motion(Box);
const MotionButton = motion(Button);

function ViewEmployees() {
  const { t } = useLanguage();
  const { currentTheme } = useTheme();
  const toast = useToast();
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

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/employee', { withCredentials: true });
      setEmployees(response.data.employees);
      toast({
        title: t('success'),
        description: t('employeesLoaded'),
        status: 'success',
        duration: 3000,
        isClosable: true,
        icon: <FaCheckCircle />,
      });
    } catch (error) {
      console.error('Error fetching employees:', error.response?.data || error.message);
      toast({
        title: t('error'),
        description: t('failedToLoadEmployees'),
        status: 'error',
        duration: 3000,
        isClosable: true,
        icon: <FaExclamationCircle />,
      });
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/department', { withCredentials: true });
      setDepartments(response.data.departments);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast({
        title: t('error'),
        description: t('failedToFetchDepartments'),
        status: 'error',
        duration: 3000,
        isClosable: true,
        icon: <FaExclamationCircle />,
      });
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    try {
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(searchTerm);
      let response;
      if (isObjectId) {
        response = await axios.get(`http://localhost:4000/api/employee/${searchTerm}`, { withCredentials: true });
        setEmployees([response.data.employee]);
      } else {
        response = await axios.get(`http://localhost:4000/api/employee?name=${encodeURIComponent(searchTerm)}`, { withCredentials: true });
        setEmployees(response.data.employees);
      }
      toast({
        title: t('success'),
        description: isObjectId ? t('employeeFound') : t('employeesFound'),
        status: 'success',
        duration: 3000,
        isClosable: true,
        icon: <FaCheckCircle />,
      });
      setSearchTerm('');
    } catch (error) {
      console.error('Error searching employee:', error.response?.data || error.message);
      toast({
        title: t('error'),
        description: t('noEmployeesFound'),
        status: 'error',
        duration: 3000,
        isClosable: true,
        icon: <FaExclamationCircle />,
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
      HireDate: new Date(emp.HireDate).toISOString().split('T')[0],
      DepartmentId: emp.DepartmentId?._id || '',
      Email: emp.Email || '',
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(editForm).forEach((key) => data.append(key, editForm[key]));
    if (editProfilePicture) data.append('ProfilePicture', editProfilePicture);

    try {
      const response = await axios.put(`http://localhost:4000/api/employee/${editingEmp}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      setEmployees(employees.map((e) => (e._id === editingEmp ? response.data.employee : e)));
      setEditingEmp(null);
      setEditProfilePicture(null);
      toast({
        title: t('success'),
        description: t('employeeUpdated'),
        status: 'success',
        duration: 3000,
        isClosable: true,
        icon: <FaCheckCircle />,
      });
    } catch (error) {
      console.error('Error updating employee:', error.response?.data || error.message);
      toast({
        title: t('error'),
        description: t('failedToUpdateEmployee'),
        status: 'error',
        duration: 3000,
        isClosable: true,
        icon: <FaExclamationCircle />,
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('confirmDeleteEmployee'))) return;
    try {
      await axios.delete(`http://localhost:4000/api/employee/${id}`, { withCredentials: true });
      setEmployees(employees.filter((e) => e._id !== id));
      toast({
        title: t('success'),
        description: t('employeeDeleted'),
        status: 'success',
        duration: 3000,
        isClosable: true,
        icon: <FaCheckCircle />,
      });
    } catch (error) {
      console.error('Error deleting employee:', error.response?.data || error.message);
      toast({
        title: t('error'),
        description: t('failedToDeleteEmployee'),
        status: 'error',
        duration: 3000,
        isClosable: true,
        icon: <FaExclamationCircle />,
      });
    }
  };

  const getWhatsAppLink = (phone) => {
    if (!phone) return '#';
    const cleanedPhone = phone.replace(/\D/g, '');
    const noLeadingZero = cleanedPhone.startsWith('0') ? cleanedPhone.slice(1) : cleanedPhone;
    const whatsappNumber = `+94${noLeadingZero}`;
    return `https://wa.me/${whatsappNumber}`;
  };

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      bg={currentTheme.sectionBg}
      py={{ base: 10, md: 20 }}
      minH="100vh"
    >
      <Container maxW="container.xl">
        <VStack spacing={12} align="stretch">
          <Heading
            as="h1"
            size="2xl"
            fontFamily="'Playfair Display', serif"
            color={currentTheme.primaryColor}
            textAlign="center"
          >
            {t('viewEmployees')}
          </Heading>
          <Box w="full" maxW="600px">
            <form onSubmit={handleSearch}>
              <VStack spacing={4}>
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('enterEmployeeIdOrName')}
                  borderRadius="lg"
                  focusBorderColor={currentTheme.primaryColor}
                  bg="white"
                  boxShadow="sm"
                />
                <Button
                  type="submit"
                  bg={currentTheme.primaryColor}
                  color="white"
                  borderRadius="full"
                  _hover={{ bg: `${currentTheme.primaryColor.split('.')[0]}.700`, transform: 'scale(1.05)' }}
                  boxShadow="md"
                  fontFamily="'Montserrat', sans-serif"
                >
                  {t('search')}
                </Button>
                <Button
                  type="button"
                  onClick={fetchEmployees}
                  variant="outline"
                  colorScheme={currentTheme.primaryColor.split('.')[0]}
                  borderRadius="full"
                  fontFamily="'Montserrat', sans-serif"
                >
                  {t('showAll')}
                </Button>
              </VStack>
            </form>
          </Box>
          {employees.length > 0 ? (
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={8}>
              {employees.map((emp) => (
                <Box
                  key={emp._id}
                  bg="white"
                  p={6}
                  borderRadius="xl"
                  boxShadow="lg"
                  _hover={{ transform: 'translateY(-10px)', boxShadow: 'xl' }}
                  position="relative"
                >
                  {editingEmp === emp._id ? (
                    <form onSubmit={handleUpdate} encType="multipart/form-data">
                      <VStack spacing={4}>
                        <FormControl>
                          <FormLabel fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>
                            {t('employeeName')}
                          </FormLabel>
                          <Input
                            type="text"
                            name="EmployeeName"
                            value={editForm.EmployeeName}
                            onChange={(e) => setEditForm({ ...editForm, EmployeeName: e.target.value })}
                            placeholder={t('employeeName')}
                            borderRadius="lg"
                            focusBorderColor={currentTheme.primaryColor}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>
                            {t('role')}
                          </FormLabel>
                          <Input
                            type="text"
                            name="Role"
                            value={editForm.Role}
                            onChange={(e) => setEditForm({ ...editForm, Role: e.target.value })}
                            placeholder={t('role')}
                            borderRadius="lg"
                            focusBorderColor={currentTheme.primaryColor}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>
                            {t('age')}
                          </FormLabel>
                          <Input
                            type="number"
                            name="Age"
                            value={editForm.Age}
                            onChange={(e) => setEditForm({ ...editForm, Age: e.target.value })}
                            placeholder={t('age')}
                            borderRadius="lg"
                            focusBorderColor={currentTheme.primaryColor}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>
                            {t('address')}
                          </FormLabel>
                          <Input
                            type="text"
                            name="Address"
                            value={editForm.Address}
                            onChange={(e) => setEditForm({ ...editForm, Address: e.target.value })}
                            placeholder={t('address')}
                            borderRadius="lg"
                            focusBorderColor={currentTheme.primaryColor}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>
                            {t('phone')}
                          </FormLabel>
                          <Input
                            type="text"
                            name="Phone"
                            value={editForm.Phone}
                            onChange={(e) => setEditForm({ ...editForm, Phone: e.target.value })}
                            placeholder={t('phone')}
                            borderRadius="lg"
                            focusBorderColor={currentTheme.primaryColor}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>
                            {t('hireDate')}
                          </FormLabel>
                          <Input
                            type="date"
                            name="HireDate"
                            value={editForm.HireDate}
                            onChange={(e) => setEditForm({ ...editForm, HireDate: e.target.value })}
                            borderRadius="lg"
                            focusBorderColor={currentTheme.primaryColor}
                            max={new Date().toISOString().split('T')[0]}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>
                            {t('department')}
                          </FormLabel>
                          <Select
                            name="DepartmentId"
                            value={editForm.DepartmentId}
                            onChange={(e) => setEditForm({ ...editForm, DepartmentId: e.target.value })}
                            placeholder={t('selectDepartment')}
                            borderRadius="lg"
                            focusBorderColor={currentTheme.primaryColor}
                          >
                            {departments.map((dept) => (
                              <option key={dept._id} value={dept._id}>
                                {dept.DepartmentName}
                              </option>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl>
                          <FormLabel fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>
                            {t('email')}
                          </FormLabel>
                          <Input
                            type="email"
                            name="Email"
                            value={editForm.Email}
                            onChange={(e) => setEditForm({ ...editForm, Email: e.target.value })}
                            placeholder={t('email')}
                            borderRadius="lg"
                            focusBorderColor={currentTheme.primaryColor}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>
                            {t('profilePicture')}
                          </FormLabel>
                          <Input
                            type="file"
                            name="ProfilePicture"
                            accept="image/*"
                            onChange={(e) => setEditProfilePicture(e.target.files[0])}
                            border="none"
                            p={1}
                          />
                        </FormControl>
                        <Flex gap={2}>
                          <Button
                            type="submit"
                            bg={currentTheme.primaryColor}
                            color="white"
                            borderRadius="full"
                            _hover={{ bg: `${currentTheme.primaryColor.split('.')[0]}.700`, transform: 'scale(1.05)' }}
                            boxShadow="md"
                            fontFamily="'Montserrat', sans-serif"
                          >
                            {t('save')}
                          </Button>
                          <Button
                            type="button"
                            onClick={() => setEditingEmp(null)}
                            variant="outline"
                            colorScheme={currentTheme.primaryColor.split('.')[0]}
                            borderRadius="full"
                            fontFamily="'Montserrat', sans-serif"
                          >
                            {t('cancel')}
                          </Button>
                        </Flex>
                      </VStack>
                    </form>
                  ) : (
                    <Flex gap={4}>
                      <Box>
                        {emp.ProfilePicture ? (
                          <Image
                            src={`http://localhost:4000${emp.ProfilePicture}`}
                            alt={emp.EmployeeName}
                            boxSize="80px"
                            borderRadius="full"
                            objectFit="cover"
                            mb={2}
                          />
                        ) : (
                          <Box
                            boxSize="80px"
                            borderRadius="full"
                            bg="gray.200"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            mb={2}
                          >
                            <Text fontSize="sm" color="gray.500">{t('noImage')}</Text>
                          </Box>
                        )}
                      </Box>
                      <VStack align="start" spacing={1} flex={1}>
                        <Heading
                          as="h3"
                          size="md"
                          fontFamily="'Playfair Display', serif"
                          color={currentTheme.primaryColor}
                        >
                          {emp.EmployeeName}
                        </Heading>
                        <Text fontFamily="'Montserrat', sans-serif" color="gray.600">
                          {t('role')}: {emp.Role}
                        </Text>
                        <Text fontFamily="'Montserrat', sans-serif" color="gray.600">
                          {t('age')}: {emp.Age}
                        </Text>
                        <Text fontFamily="'Montserrat', sans-serif" color="gray.600">
                          {t('address')}: {emp.Address}
                        </Text>
                        <Flex align="center" gap={2}>
                          <Text fontFamily="'Montserrat', sans-serif" color="gray.600">
                            {t('phone')}: {emp.Phone}
                          </Text>
                          {emp.Phone && (
                            <IconButton
                              as="a"
                              href={getWhatsAppLink(emp.Phone)}
                              target="_blank"
                              rel="noopener noreferrer"
                              icon={<FaWhatsapp />}
                              colorScheme="green"
                              size="sm"
                              aria-label={t('messageOnWhatsApp')}
                              _hover={{ transform: 'scale(1.1)' }}
                            />
                          )}
                        </Flex>
                        <Text fontFamily="'Montserrat', sans-serif" color="gray.600">
                          {t('hireDate')}: {new Date(emp.HireDate).toLocaleDateString()}
                        </Text>
                        <Text fontFamily="'Montserrat', sans-serif" color="gray.600">
                          {t('department')}: {emp.DepartmentId?.DepartmentName || t('unknown')}
                        </Text>
                        <Text fontFamily="'Montserrat', sans-serif" color="gray.600">
                          {t('email')}: {emp.Email || t('notProvided')}
                        </Text>
                      </VStack>
                      <Box position="absolute" top={4} right={4} display="flex" gap={2}>
                        <MotionButton
                          whileHover={{ scale: 1.1, rotate: 10 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(emp)}
                          bg="transparent"
                          color={currentTheme.primaryColor}
                          _hover={{ color: `${currentTheme.primaryColor.split('.')[0]}.700` }}
                        >
                          <FaEdit />
                        </MotionButton>
                        <MotionButton
                          whileHover={{ scale: 1.1, rotate: -10 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(emp._id)}
                          bg="transparent"
                          color="red.500"
                          _hover={{ color: 'red.600' }}
                        >
                          <FaTrash />
                        </MotionButton>
                      </Box>
                    </Flex>
                  )}
                </Box>
              ))}
            </Grid>
          ) : (
            <Text fontFamily="'Montserrat', sans-serif" color="gray.500" textAlign="center">
              {t('noEmployeesFound')}
            </Text>
          )}
          <Button
            as={Link}
            to="/"
            variant="outline"
            colorScheme={currentTheme.primaryColor.split('.')[0]}
            borderRadius="full"
            fontFamily="'Montserrat', sans-serif"
          >
            {t('backToDashboard')}
          </Button>
        </VStack>
      </Container>
    </MotionBox>
  );
}

export default ViewEmployees;