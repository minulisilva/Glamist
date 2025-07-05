import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Heading,
  Input,
  Button,
  VStack,
  Grid,
  GridItem,
  Text,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useToast,
  useColorMode,
  useDisclosure,
} from '@chakra-ui/react';
import { FaCheckCircle, FaExclamationCircle, FaEdit, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useLanguage } from './LanguageContext';
import { useTheme } from './ThemeContext';

const MotionBox = motion(Box);

function ViewDepartments() {
  const { t } = useLanguage();
  const { currentTheme, colorMode } = useTheme();
  const { colorMode: chakraColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [departments, setDepartments] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [editingDept, setEditingDept] = useState(null);
  const [editForm, setEditForm] = useState({ DepartmentName: '', Description: '' });
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/department', {
        withCredentials: true,
      });
      setDepartments(response.data.departments);
      toast({
        title: t('success'),
        description: t('departmentsLoadedSuccess'),
        status: 'success',
        duration: 3000,
        isClosable: true,
        icon: <FaCheckCircle />,
      });
    } catch (error) {
      console.error('Error fetching departments:', error.response?.data || error.message);
      toast({
        title: t('error'),
        description: t('failedToLoadDepartments'),
        status: 'error',
        duration: 3000,
        isClosable: true,
        icon: <FaExclamationCircle />,
      });
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    try {
      const response = await axios.get(`http://localhost:4000/api/department/${searchId}`, {
        withCredentials: true,
      });
      setDepartments([response.data.departments]);
      toast({
        title: t('success'),
        description: t('departmentFound'),
        status: 'success',
        duration: 3000,
        isClosable: true,
        icon: <FaCheckCircle />,
      });
      setSearchId('');
    } catch (error) {
      console.error('Error searching department:', error.response?.data || error.message);
      toast({
        title: t('error'),
        description: t('departmentNotFound'),
        status: 'error',
        duration: 3000,
        isClosable: true,
        icon: <FaExclamationCircle />,
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
      const response = await axios.put(`http://localhost:4000/api/department/${editingDept}`, editForm, {
        withCredentials: true,
      });
      setDepartments(departments.map((d) =>
        d._id === editingDept ? response.data.departments : d
      ));
      setEditingDept(null);
      toast({
        title: t('success'),
        description: t('departmentUpdatedSuccess'),
        status: 'success',
        duration: 3000,
        isClosable: true,
        icon: <FaCheckCircle />,
      });
    } catch (error) {
      console.error('Error updating department:', error.response?.data || error.message);
      toast({
        title: t('error'),
        description: t('failedToUpdateDepartment'),
        status: 'error',
        duration: 3000,
        isClosable: true,
        icon: <FaExclamationCircle />,
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('confirmDeleteDepartment'))) return;
    try {
      await axios.delete(`http://localhost:4000/api/department/${id}`, {
        withCredentials: true,
      });
      setDepartments(departments.filter((d) => d._id !== id));
      toast({
        title: t('success'),
        description: t('departmentDeletedSuccess'),
        status: 'success',
        duration: 3000,
        isClosable: true,
        icon: <FaCheckCircle />,
      });
    } catch (error) {
      console.error('Error deleting department:', error.response?.data || error.message);
      toast({
        title: t('error'),
        description: t('failedToDeleteDepartment'),
        status: 'error',
        duration: 3000,
        isClosable: true,
        icon: <FaExclamationCircle />,
      });
    }
  };

  const fetchEmployeeDetails = async (employeeId) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/employee/${employeeId}`, {
        withCredentials: true,
      });
      setSelectedEmployee(response.data.employee);
      onOpen();
    } catch (error) {
      console.error('Error fetching employee details:', error.response?.data || error.message);
      toast({
        title: t('error'),
        description: t('failedToLoadEmployeeDetails'),
        status: 'error',
        duration: 3000,
        isClosable: true,
        icon: <FaExclamationCircle />,
      });
    }
  };

  const handleEmployeeClick = (employeeId) => {
    fetchEmployeeDetails(employeeId);
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
        textAlign="center"
        mb={8}
      >
        {t('viewDepartments')}
      </Heading>

      <form onSubmit={handleSearch}>
        <VStack spacing={4} mb={8} align="center">
          <Input
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder={t('enterDepartmentId')}
            maxW="md"
            focusBorderColor={currentTheme.primaryColor}
          />
          <Button
            type="submit"
            colorScheme={currentTheme.primaryColor.split('.')[0]}
            size="md"
            borderRadius="full"
            _hover={{ transform: 'scale(1.05)' }}
          >
            {t('search')}
          </Button>
          <Button
            type="button"
            onClick={fetchDepartments}
            colorScheme="gray"
            size="md"
            borderRadius="full"
            _hover={{ transform: 'scale(1.05)' }}
          >
            {t('showAll')}
          </Button>
        </VStack>
      </form>

      {departments.length > 0 ? (
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6} maxW="5xl" mx="auto">
          {departments.map((dept) => (
            <MotionBox
              key={dept._id}
              bg={chakraColorMode === 'light' ? 'white' : 'gray.700'}
              p={6}
              rounded="2xl"
              shadow="lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              _hover={{ transform: 'translateY(-10px)', boxShadow: 'xl' }}
              position="relative"
            >
              {editingDept === dept._id ? (
                <form onSubmit={handleUpdate}>
                  <VStack spacing={4}>
                    <FormControl>
                      <FormLabel fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>
                        {t('departmentName')}
                      </FormLabel>
                      <Input
                        value={editForm.DepartmentName}
                        onChange={(e) => setEditForm({ ...editForm, DepartmentName: e.target.value })}
                        placeholder={t('departmentName')}
                        focusBorderColor={currentTheme.primaryColor}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>
                        {t('description')}
                      </FormLabel>
                      <Textarea
                        value={editForm.Description}
                        onChange={(e) => setEditForm({ ...editForm, Description: e.target.value })}
                        placeholder={t('description')}
                        rows={3}
                        focusBorderColor={currentTheme.primaryColor}
                      />
                    </FormControl>
                    <Button
                      type="submit"
                      colorScheme={currentTheme.primaryColor.split('.')[0]}
                      size="sm"
                      borderRadius="full"
                    >
                      {t('save')}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setEditingDept(null)}
                      colorScheme="gray"
                      size="sm"
                      borderRadius="full"
                    >
                      {t('cancel')}
                    </Button>
                  </VStack>
                </form>
              ) : (
                <>
                  <Heading
                    as="h3"
                    size="lg"
                    fontFamily="'Playfair Display', serif"
                    color={currentTheme.primaryColor}
                    mb={3}
                  >
                    {dept.DepartmentName}
                  </Heading>
                  <Text fontFamily="'Montserrat', sans-serif" color={chakraColorMode === 'light' ? 'gray.600' : 'gray.300'} mb={2}>
                    {dept.Description}
                  </Text>
                  <Text fontFamily="'Montserrat', sans-serif" color={chakraColorMode === 'light' ? 'gray.600' : 'gray.300'}>
                    {t('totalEmployees')}: <Text as="span" fontWeight="semibold" color={currentTheme.primaryColor}>{dept.EmployeeCount}</Text>
                  </Text>
                  <Box mt={4}>
                    <Text fontFamily="'Montserrat', sans-serif" color={chakraColorMode === 'light' ? 'gray.600' : 'gray.300'} mb={2}>
                      {t('workers')}:
                    </Text>
                    <Flex flexWrap="wrap" gap={3}>
                      {dept.employees.length > 0 ? (
                        dept.employees.map((emp) => (
                          <Box
                            key={emp._id}
                            onClick={() => handleEmployeeClick(emp._id)}
                            cursor="pointer"
                            _hover={{ transform: 'scale(1.1)' }}
                          >
                            {emp.ProfilePicture ? (
                              <Image
                                src={`http://localhost:4000${emp.ProfilePicture}`}
                                alt="Employee"
                                boxSize="48px"
                                rounded="full"
                                objectFit="cover"
                                border="2px"
                                borderColor={currentTheme.primaryColor}
                              />
                            ) : (
                              <Box
                                boxSize="48px"
                                rounded="full"
                                bg="gray.200"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                border="2px"
                                borderColor={currentTheme.primaryColor}
                              >
                                <Text color="gray.500" fontSize="sm">{t('noPic')}</Text>
                              </Box>
                            )}
                          </Box>
                        ))
                      ) : (
                        <Text color={chakraColorMode === 'light' ? 'gray.600' : 'gray.300'}>{t('none')}</Text>
                      )}
                    </Flex>
                  </Box>
                  <Box position="absolute" top={4} right={4} display="flex" gap={2}>
                    <Button
                      onClick={() => handleEdit(dept)}
                      colorScheme={currentTheme.primaryColor.split('.')[0]}
                      variant="ghost"
                      size="sm"
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      onClick={() => handleDelete(dept._id)}
                      colorScheme="red"
                      variant="ghost"
                      size="sm"
                    >
                      <FaTrash />
                    </Button>
                  </Box>
                </>
              )}
            </MotionBox>
          ))}
        </Grid>
      ) : (
        <Text color={chakraColorMode === 'light' ? 'gray.500' : 'gray.400'} textAlign="center">
          {t('noDepartmentsFound')}
        </Text>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={chakraColorMode === 'light' ? 'white' : 'gray.700'} rounded="2xl">
          <ModalHeader fontFamily="'Playfair Display', serif" color={currentTheme.primaryColor}>
            {t('employeeDetails')}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedEmployee && (
              <VStack spacing={4} align="center">
                {selectedEmployee.ProfilePicture ? (
                  <Image
                    src={`http://localhost:4000${selectedEmployee.ProfilePicture}`}
                    alt={selectedEmployee.EmployeeName}
                    boxSize="100px"
                    rounded="full"
                    objectFit="cover"
                    border="4px"
                    borderColor={currentTheme.primaryColor}
                  />
                ) : (
                  <Box
                    boxSize="100px"
                    rounded="full"
                    bg="gray.200"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    border="4px"
                    borderColor={currentTheme.primaryColor}
                  >
                    <Text color="gray.500">{t('noPic')}</Text>
                  </Box>
                )}
                <Heading as="h3" size="md" color={currentTheme.primaryColor}>
                  {selectedEmployee.EmployeeName}
                </Heading>
                <Text><Text as="span" fontWeight="semibold">{t('role')}:</Text> {selectedEmployee.Role}</Text>
                <Text><Text as="span" fontWeight="semibold">{t('age')}:</Text> {selectedEmployee.Age}</Text>
                <Text><Text as="span" fontWeight="semibold">{t('address')}:</Text> {selectedEmployee.Address}</Text>
                <Text><Text as="span" fontWeight="semibold">{t('phone')}:</Text> {selectedEmployee.Phone}</Text>
                <Text><Text as="span" fontWeight="semibold">{t('hireDate')}:</Text> {new Date(selectedEmployee.HireDate).toLocaleDateString()}</Text>
                <Text><Text as="span" fontWeight="semibold">{t('department')}:</Text> {selectedEmployee.DepartmentId?.DepartmentName || t('unknown')}</Text>
                <Text><Text as="span" fontWeight="semibold">{t('email')}:</Text> {selectedEmployee.Email}</Text>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Link to="/">
        <Button
          variant="link"
          color={currentTheme.primaryColor}
          mt={8}
          _hover={{ textDecoration: 'underline' }}
          mx="auto"
          display="block"
        >
          {t('backToDashboard')}
        </Button>
      </Link>
    </Box>
  );
}

export default ViewDepartments;