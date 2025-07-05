import React, { useState } from 'react';
import {
  Container, Box, Flex, Text, Heading, Button, Input, Select, Table, Thead, Tbody, Tr, Th, Td, Checkbox,
  IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  FormControl, FormLabel, Input as ChakraInput, useDisclosure, useToast, useColorMode, useBreakpointValue,
} from '@chakra-ui/react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useLanguage } from './LanguageContext';
import { useTheme } from './ThemeContext';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import jsPDF from 'jspdf';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MotionBox = motion(Box);
const MotionTr = motion(Tr);

const SalaryManagement = () => {
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const { currentTheme, themeKey } = useTheme();
  const { colorMode } = useColorMode();
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure();
  const toast = useToast();
  const buttonSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const headingSize = useBreakpointValue({ base: 'xl', md: '2xl' });

  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    salaryAmount: '',
    paymentFrequency: 'Monthly',
    paymentDate: '',
    bonuses: 0,
    deductions: 0,
    notes: '',
  });
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [detailsData, setDetailsData] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));

  // Fetch data with React Query (v5 syntax)
  const { data: salaries = [], isLoading: salariesLoading, error: salariesError } = useQuery({
    queryKey: ['salaries'],
    queryFn: () => axios.get('http://localhost:4000/api/salary/list', { withCredentials: true }).then((res) => res.data),
    onSuccess: (data) => console.log('Salaries Data:', data),
    onError: () => toast({
      title: t('error'),
      description: t('errorFetch'),
      status: 'error',
      duration: 5000,
      isClosable: true,
    }),
  });

  const { data: dashboardData = { totalPayroll: 0, pendingPayments: 0, salaryTrend: [] }, isLoading: dashboardLoading, error: dashboardError } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => axios.get('http://localhost:4000/api/salary/dashboard', { withCredentials: true }).then((res) => res.data),
    onSuccess: (data) => console.log('Dashboard Data:', data),
    onError: () => toast({
      title: t('error'),
      description: t('errorFetch'),
      status: 'error',
      duration: 5000,
      isClosable: true,
    }),
  });

  // Mutations
  const addMutation = useMutation({
    mutationFn: (data) => axios.post('http://localhost:4000/api/salary/add', data, { withCredentials: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salaries'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast({ title: t('success'), description: t('successAdd'), status: 'success', duration: 5000, isClosable: true });
    },
    onError: () => toast({ title: t('error'), description: t('errorAdd'), status: 'error', duration: 5000, isClosable: true }),
  });

  const editMutation = useMutation({
    mutationFn: ({ id, data }) => axios.put(`http://localhost:4000/api/salary/edit/${id}`, data, { withCredentials: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salaries'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast({ title: t('success'), description: t('successUpdate'), status: 'success', duration: 5000, isClosable: true });
    },
    onError: () => toast({ title: t('error'), description: t('errorUpdate'), status: 'error', duration: 5000, isClosable: true }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axios.delete(`http://localhost:4000/api/salary/delete/${id}`, { withCredentials: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salaries'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast({ title: t('success'), description: t('successDelete'), status: 'success', duration: 5000, isClosable: true });
    },
    onError: () => toast({ title: t('error'), description: t('errorDelete'), status: 'error', duration: 5000, isClosable: true }),
  });

  const processMutation = useMutation({
    mutationFn: (ids) => axios.post('http://localhost:4000/api/salary/process', { ids }, { withCredentials: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salaries'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast({ title: t('success'), description: t('successProcess'), status: 'success', duration: 5000, isClosable: true });
    },
    onError: () => toast({ title: t('error'), description: t('errorProcess'), status: 'error', duration: 5000, isClosable: true }),
  });

  // Handlers
  const handleSubmit = async () => {
    const formattedData = {
      ...formData,
      salaryAmount: parseFloat(formData.salaryAmount),
      bonuses: formData.bonuses ? parseFloat(formData.bonuses) : 0,
      deductions: formData.deductions ? parseFloat(formData.deductions) : 0,
      netPay: parseFloat(formData.salaryAmount) + (formData.bonuses || 0) - (formData.deductions || 0),
    };
    if (editId) {
      await editMutation.mutateAsync({ id: editId, data: formattedData });
      onEditClose();
    } else {
      await addMutation.mutateAsync(formattedData);
      onAddClose();
    }
    setFormData({
      employeeId: '',
      employeeName: '',
      salaryAmount: '',
      paymentFrequency: 'Monthly',
      paymentDate: '',
      bonuses: 0,
      deductions: 0,
      notes: '',
    });
    setEditId(null);
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(deleteId);
    onDeleteClose();
  };

  const handleProcessPayments = async () => {
    if (selectedIds.length === 0) {
      toast({
        title: t('error'),
        description: t('noSelection'),
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    await processMutation.mutateAsync(selectedIds);
    setSelectedIds([]);
  };

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    );
  };

  const handleExportPDF = () => {
    if (!detailsData) return;
    const doc = new jsPDF();
    doc.setFont('Helvetica', 'normal');
    doc.text('Salary Details', 20, 20);
    doc.text(`Employee ID: ${detailsData.employeeId}`, 20, 30);
    doc.text(`Employee Name: ${detailsData.employeeName}`, 20, 40);
    doc.text(`Salary Amount: LKR ${detailsData.salaryAmount.toLocaleString()}`, 20, 50);
    doc.text(`Net Pay: LKR ${detailsData.netPay.toLocaleString()}`, 20, 60);
    doc.text(`Payment Frequency: ${detailsData.paymentFrequency}`, 20, 70);
    doc.text(`Payment Date: ${new Date(detailsData.paymentDate).toLocaleDateString()}`, 20, 80);
    doc.text(`Bonuses: LKR ${detailsData.bonuses.toLocaleString()}`, 20, 90);
    doc.text(`Deductions: LKR ${detailsData.deductions.toLocaleString()}`, 20, 100);
    doc.text(`Status: ${detailsData.status}`, 20, 110);
    doc.text(`Notes: ${detailsData.notes || 'N/A'}`, 20, 120);
    doc.save(`salary_${detailsData.employeeId}.pdf`);
  };

  // Graph Data
 

  const currentYear = new Date().getFullYear();
  const currentYearTrend = dashboardData.salaryTrend.filter((data) => data._id.year === currentYear);
  const chartData = {
    labels: currentYearTrend.map((data) => `${data._id.month}/${data._id.year}`),
    datasets: [
      {
        label: t('salaryTrend'),
        data: currentYearTrend.map((data) => data.total),
        borderColor: '#6B46C1', // Purple theme
        backgroundColor: 'rgba(107, 70, 193, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: colorMode === 'light' ? 'gray.800' : 'gray.100' } },
      title: {
        display: true,
        text: `${t('salaryTrend')} (${currentYear})`,
        font: { size: 20, family: 'Inter' },
        color: colorMode === 'light' ? 'gray.800' : 'gray.100',
      },
    },
    scales: {
      x: { ticks: { color: colorMode === 'light' ? 'gray.800' : 'gray.100' }, grid: { color: 'rgba(107, 70, 193, 0.1)' } },
      y: {
        ticks: {
          color: colorMode === 'light' ? 'gray.800' : 'gray.100',
          callback: (value) => `LKR ${value.toLocaleString()}`,
        },
        grid: { color: 'rgba(107, 70, 193, 0.1)' },
      },
    },
  };

  // Filtered salaries for the table
  const filteredSalaries = salaries.filter((salary) =>
    salary.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    new Date(salary.paymentDate).toLocaleString('default', { month: 'long' }) === selectedMonth
  );

  if (salariesLoading || dashboardLoading) {
    return (
      <Container maxW="container.xl" py={10}>
        <Flex justify="center" align="center" minH="200px">
          <Text fontSize="lg" fontWeight="medium" color="purple.500">
            {t('loading')}
          </Text>
        </Flex>
      </Container>
    );
  }

  if (salariesError || dashboardError) {
    return (
      <Container maxW="container.xl" py={10}>
        <Flex justify="center" align="center" minH="200px">
          <Text fontSize="lg" fontWeight="medium" color="red.500">
            {t('errorFetch')}
          </Text>
        </Flex>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      <Heading
        fontFamily="'Inter', sans-serif"
        fontSize={headingSize}
        fontWeight="bold"
        color="purple.600"
        textAlign="center"
        mb={10}
        bgGradient="linear(to-r, purple.600, purple.400)"
        bgClip="text"
      >
        {t('salaryManagement')}
      </Heading>

      {/* Dashboard Cards */}
      <Flex gap={6} wrap="wrap" justify="center" mb={10}>
        <MotionBox
          bg={colorMode === 'light' ? 'white' : 'gray.800'}
          borderRadius="2xl"
          p={6}
          boxShadow="xl"
          flex="1"
          minW="250px"
          border="1px solid"
          borderColor="purple.200"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          _hover={{ transform: 'translateY(-5px)', boxShadow: '2xl' }}
        >
          <Text fontFamily="'Inter', sans-serif" fontSize="lg" fontWeight="semibold" color="purple.500">
            {t('totalPayroll')}
          </Text>
          <Text fontFamily="'Inter', sans-serif" fontSize="2xl" fontWeight="bold" mt={2} color="purple.700">
            {`LKR ${dashboardData.totalPayroll.toLocaleString()}`}
          </Text>
        </MotionBox>
        <MotionBox
          bg={colorMode === 'light' ? 'white' : 'gray.800'}
          borderRadius="2xl"
          p={6}
          boxShadow="xl"
          flex="1"
          minW="250px"
          border="1px solid"
          borderColor="purple.200"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          _hover={{ transform: 'translateY(-5px)', boxShadow: '2xl' }}
        >
          <Text fontFamily="'Inter', sans-serif" fontSize="lg" fontWeight="semibold" color="purple.500">
            {t('pendingPayments')}
          </Text>
          <Text fontFamily="'Inter', sans-serif" fontSize="2xl" fontWeight="bold" mt={2} color="purple.700">
            {dashboardData.pendingPayments}
          </Text>
        </MotionBox>
      </Flex>

Clone()
      {/* Salary Trend Graph */}
      <MotionBox
        bg={colorMode === 'light' ? 'white' : 'gray.800'}
        borderRadius="2xl"
        p={8}
        boxShadow="xl"
        mb={10}
        border="1px solid"
        borderColor="purple.200"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        mx="auto"
        maxW="800px"
      >
        <Text
          fontFamily="'Inter', sans-serif"
          fontSize="xl"
          fontWeight="semibold"
          color="purple.500"
          mb={6}
          textAlign="center"
        >
          {t('salaryTrend')}
        </Text>
        {currentYearTrend.length > 0 ? (
          <Box h="350px" display="flex" justifyContent="center">
            <Line data={chartData} options={chartOptions} />
          </Box>
        ) : (
          <Text fontFamily="'Inter', sans-serif" textAlign="center" color="gray.500" fontSize="lg">
            {t('noRecords')}
          </Text>
        )}
      </MotionBox>

      {/* Salary List Table */}
      <MotionBox
        bg={colorMode === 'light' ? 'white' : 'gray.800'}
        borderRadius="2xl"
        p={8}
        boxShadow="xl"
        border="1px solid"
        borderColor="purple.200"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Text
          fontFamily="'Inter', sans-serif"
          fontSize="xl"
          fontWeight="semibold"
          color="purple.500"
          mb={6}
          textAlign="center"
        >
          {t('salaryList')}
        </Text>
        <Flex mb={6} alignItems="center" gap={4} wrap="wrap">
          <Input
            placeholder={t('search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            bg={colorMode === 'light' ? 'purple.50' : 'gray.700'}
            borderRadius="full"
            px={5}
            py={3}
            border="1px solid"
            borderColor="purple.300"
            _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px purple.500' }}
          />
          <Select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            bg={colorMode === 'light' ? 'purple.50' : 'gray.700'}
            borderRadius="full"
            px={5}
            py={3}
            border="1px solid"
            borderColor="purple.300"
            _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px purple.500' }}
            w="200px"
          >
            {[
              'January', 'February', 'March', 'April', 'May', 'June',
              'July', 'August', 'September', 'October', 'November', 'December',
            ].map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </Select>
          <Button
            onClick={onAddOpen}
            bg="purple.600"
            color="white"
            borderRadius="full"
            size={buttonSize}
            _hover={{ bg: 'purple.700' }}
            _active={{ bg: 'purple.800' }}
            px={6}
          >
            {t('addSalary')}
          </Button>
          <Button
            onClick={handleProcessPayments}
            bg="purple.600"
            color="white"
            borderRadius="full"
            size={buttonSize}
            _hover={{ bg: 'purple.700' }}
            _active={{ bg: 'purple.800' }}
            px={6}
            ml="auto"
          >
            {t('markAsPaid')}
          </Button>
        </Flex>
        <Box overflowX="auto">
          <Table variant="simple" colorScheme="purple">
            <Thead bg="purple.50">
              <Tr>
                <Th color="purple.700"><Checkbox isDisabled /></Th>
                <Th color="purple.700">{t('employeeName')}</Th>
                <Th color="purple.700">{t('salaryAmount')}</Th>
                <Th color="purple.700">{t('netPay')}</Th>
                <Th color="purple.700">{t('paymentDate')}</Th>
                <Th color="purple.700">{t('status')}</Th>
                <Th color="purple.700">{t('actions')}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredSalaries.map((salary) => (
                <MotionTr
                  key={salary._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  _hover={{ bg: colorMode === 'light' ? 'purple.50' : 'gray.700' }}
                >
                  <Td>
                    <Checkbox
                      onChange={() => handleSelect(salary._id)}
                      isChecked={selectedIds.includes(salary._id)}
                      colorScheme="purple"
                    />
                  </Td>
                  <Td fontWeight="medium">{salary.employeeName}</Td>
                  <Td>{`LKR ${salary.salaryAmount.toLocaleString()}`}</Td>
                  <Td>{`LKR ${salary.netPay.toLocaleString()}`}</Td>
                  <Td>{new Date(salary.paymentDate).toLocaleDateString()}</Td>
                  <Td>
                    <Text color={salary.status === 'Paid' ? 'green.500' : 'red.500'} fontWeight="medium">
                      {salary.status}
                    </Text>
                  </Td>
                  <Td>
                    <IconButton
                      icon={<FaEye />}
                      onClick={() => { setDetailsData(salary); onDetailsOpen(); }}
                      variant="ghost"
                      colorScheme="purple"
                      size="sm"
                      mr={2}
                      _hover={{ bg: 'purple.100' }}
                    />
                    <IconButton
                      icon={<FaEdit />}
                      onClick={() => {
                        setEditId(salary._id);
                        setFormData({
                          employeeId: salary.employeeId,
                          employeeName: salary.employeeName,
                          salaryAmount: salary.salaryAmount.toString(),
                          paymentFrequency: salary.paymentFrequency,
                          paymentDate: new Date(salary.paymentDate).toISOString().split('T')[0],
                          bonuses: salary.bonuses,
                          deductions: salary.deductions,
                          notes: salary.notes,
                        });
                        onEditOpen();
                      }}
                      variant="ghost"
                      colorScheme="purple"
                      size="sm"
                      mr={2}
                      _hover={{ bg: 'purple.100' }}
                    />
                    <IconButton
                      icon={<FaTrash />}
                      onClick={() => { setDeleteId(salary._id); onDeleteOpen(); }}
                      variant="ghost"
                      colorScheme="red"
                      size="sm"
                      _hover={{ bg: 'red.100' }}
                    />
                  </Td>
                </MotionTr>
              ))}
            </Tbody>
          </Table>
        </Box>
        {filteredSalaries.length === 0 && (
          <Text textAlign="center" color="gray.500" mt={6} fontFamily="'Inter', sans-serif" fontSize="lg">
            {t('noRecords')}
          </Text>
        )}
      </MotionBox>

      {/* Add Salary Modal */}
      <Modal isOpen={isAddOpen} onClose={onAddClose}>
        <ModalOverlay />
        <ModalContent borderRadius="2xl" boxShadow="xl" bg={colorMode === 'light' ? 'white' : 'gray.800'}>
          <ModalHeader fontFamily="'Inter', sans-serif" fontWeight="bold" color="purple.600">
            {t('addSalary')}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel fontWeight="medium" color="purple.700">{t('employeeId')}</FormLabel>
              <ChakraInput
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                bg="purple.50"
                borderRadius="lg"
                borderColor="purple.300"
                _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px purple.500' }}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel fontWeight="medium" color="purple.700">{t('employeeName')}</FormLabel>
              <ChakraInput
                value={formData.employeeName}
                onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                bg="purple.50"
                borderRadius="lg"
                borderColor="purple.300"
                _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px purple.500' }}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel fontWeight="medium" color="purple.700">{t('salaryAmount')}</FormLabel>
              <ChakraInput
                type="number"
                value={formData.salaryAmount}
                onChange={(e) => setFormData({ ...formData, salaryAmount: e.target.value })}
                bg="purple.50"
                borderRadius="lg"
                borderColor="purple.300"
                _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px purple.500' }}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel fontWeight="medium" color="purple.700">{t('paymentFrequency')}</FormLabel>
              <Select
                value={formData.paymentFrequency}
                onChange={(e) => setFormData({ ...formData, paymentFrequency: e.target.value })}
                bg="purple.50"
                borderRadius="lg"
                borderColor="purple.300"
                _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px purple.500' }}
              >
                <option value="Hourly">{t('hourly')}</option>
                <option value="Weekly">{t('weekly')}</option>
                <option value="Monthly">{t('monthly')}</option>
              </Select>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel fontWeight="medium" color="purple.700">{t('paymentDate')}</FormLabel>
              <ChakraInput
                type="date"
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                bg="purple.50"
                borderRadius="lg"
                borderColor="purple.300"
                _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px purple.500' }}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel fontWeight="medium" color="purple.700">{t('bonuses')}</FormLabel>
              <ChakraInput
                type="number"
                value={formData.bonuses}
                onChange={(e) => setFormData({ ...formData, bonuses: parseFloat(e.target.value) || 0 })}
                bg="purple.50"
                borderRadius="lg"
                borderColor="purple.300"
                _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px purple.500' }}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel fontWeight="medium" color="purple.700">{t('deductions')}</FormLabel>
              <ChakraInput
                type="number"
                value={formData.deductions}
                onChange={(e) => setFormData({ ...formData, deductions: parseFloat(e.target.value) || 0 })}
                bg="purple.50"
                borderRadius="lg"
                borderColor="purple.300"
                _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px purple.500' }}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel fontWeight="medium" color="purple.700">{t('notes')}</FormLabel>
              <ChakraInput
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                bg="purple.50"
                borderRadius="lg"
                borderColor="purple.300"
                _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px purple.500' }}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              onClick={onAddClose}
              mr={3}
              borderColor="purple.300"
              color="purple.600"
              borderRadius="full"
              _hover={{ bg: 'purple.50' }}
            >
              {t('cancel')}
            </Button>
            <Button
              bg="purple.600"
              color="white"
              borderRadius="full"
              onClick={handleSubmit}
              _hover={{ bg: 'purple.700' }}
              _active={{ bg: 'purple.800' }}
            >
              {t('save')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Salary Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent borderRadius="2xl" boxShadow="xl" bg={colorMode === 'light' ? 'white' : 'gray.800'}>
          <ModalHeader fontFamily="'Inter', sans-serif" fontWeight="bold" color="purple.600">
            {t('editSalary')}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel fontWeight="medium" color="purple.700">{t('employeeId')}</FormLabel>
              <ChakraInput
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                bg="purple.50"
                borderRadius="lg"
                borderColor="purple.300"
                _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px purple.500' }}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel fontWeight="medium" color="purple.700">{t('employeeName')}</FormLabel>
              <ChakraInput
                value={formData.employeeName}
                onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                bg="purple.50"
                borderRadius="lg"
                borderColor="purple.300"
                _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px purple.500' }}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel fontWeight="medium" color="purple.700">{t('salaryAmount')}</FormLabel>
              <ChakraInput
                type="number"
                value={formData.salaryAmount}
                onChange={(e) => setFormData({ ...formData, salaryAmount: e.target.value })}
                bg="purple.50"
                borderRadius="lg"
                borderColor="purple.300"
                _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px purple.500' }}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel fontWeight="medium" color="purple.700">{t('paymentFrequency')}</FormLabel>
              <Select
                value={formData.paymentFrequency}
                onChange={(e) => setFormData({ ...formData, paymentFrequency: e.target.value })}
                bg="purple.50"
                borderRadius="lg"
                borderColor="purple.300"
                _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px purple.500' }}
              >
                <option value="Hourly">{t('hourly')}</option>
                <option value="Weekly">{t('weekly')}</option>
                <option value="Monthly">{t('monthly')}</option>
              </Select>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel fontWeight="medium" color="purple.700">{t('paymentDate')}</FormLabel>
              <ChakraInput
                type="date"
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                bg="purple.50"
                borderRadius="lg"
                borderColor="purple.300"
                _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px purple.500' }}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel fontWeight="medium" color="purple.700">{t('bonuses')}</FormLabel>
              <ChakraInput
                type="number"
                value={formData.bonuses}
                onChange={(e) => setFormData({ ...formData, bonuses: parseFloat(e.target.value) || 0 })}
                bg="purple.50"
                borderRadius="lg"
                borderColor="purple.300"
                _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px purple.500' }}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel fontWeight="medium" color="purple.700">{t('deductions')}</FormLabel>
              <ChakraInput
                type="number"
                value={formData.deductions}
                onChange={(e) => setFormData({ ...formData, deductions: parseFloat(e.target.value) || 0 })}
                bg="purple.50"
                borderRadius="lg"
                borderColor="purple.300"
                _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px purple.500' }}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel fontWeight="medium" color="purple.700">{t('notes')}</FormLabel>
              <ChakraInput
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                bg="purple.50"
                borderRadius="lg"
                borderColor="purple.300"
                _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px purple.500' }}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              onClick={onEditClose}
              mr={3}
              borderColor="purple.300"
              color="purple.600"
              borderRadius="full"
              _hover={{ bg: 'purple.50' }}
            >
              {t('cancel')}
            </Button>
            <Button
              bg="purple.600"
              color="white"
              borderRadius="full"
              onClick={handleSubmit}
              _hover={{ bg: 'purple.700' }}
              _active={{ bg: 'purple.800' }}
            >
              {t('update')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent borderRadius="2xl" boxShadow="xl" bg={colorMode === 'light' ? 'white' : 'gray.800'}>
          <ModalHeader fontFamily="'Inter', sans-serif" fontWeight="bold" color="purple.600">
            {t('confirmDeletion')}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontFamily="'Inter', sans-serif" color="gray.600">
              {t('confirmDeletion')}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              onClick={onDeleteClose}
              mr={3}
              borderColor="purple.300"
              color="purple.600"
              borderRadius="full"
              _hover={{ bg: 'purple.50' }}
            >
              {t('cancel')}
            </Button>
            <Button
              bg="red.600"
              color="white"
              borderRadius="full"
              onClick={handleDelete}
              _hover={{ bg: 'red.700' }}
              _active={{ bg: 'red.800' }}
            >
              {t('deleteSalary')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Details Modal */}
      <Modal isOpen={isDetailsOpen} onClose={onDetailsClose}>
        <ModalOverlay />
        <ModalContent borderRadius="2xl" boxShadow="xl" bg={colorMode === 'light' ? 'white' : 'gray.800'}>
          <ModalHeader fontFamily="'Inter', sans-serif" fontWeight="bold" color="purple.600">
            {t('viewDetails')}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {detailsData && (
              <>
                <Text fontFamily="'Inter', sans-serif" mb={3} color="gray.700"><strong>{t('employeeId')}:</strong> {detailsData.employeeId}</Text>
                <Text fontFamily="'Inter', sans-serif" mb={3} color="gray.700"><strong>{t('employeeName')}:</strong> {detailsData.employeeName}</Text>
                <Text fontFamily="'Inter', sans-serif" mb={3} color="gray.700"><strong>{t('salaryAmount')}:</strong> LKR {detailsData.salaryAmount.toLocaleString()}</Text>
                <Text fontFamily="'Inter', sans-serif" mb={3} color="gray.700"><strong>{t('netPay')}:</strong> LKR {detailsData.netPay.toLocaleString()}</Text>
                <Text fontFamily="'Inter', sans-serif" mb={3} color="gray.700"><strong>{t('paymentFrequency')}:</strong> {detailsData.paymentFrequency}</Text>
                <Text fontFamily="'Inter', sans-serif" mb={3} color="gray.700"><strong>{t('paymentDate')}:</strong> {new Date(detailsData.paymentDate).toLocaleDateString()}</Text>
                <Text fontFamily="'Inter', sans-serif" mb={3} color="gray.700"><strong>{t('bonuses')}:</strong> LKR {detailsData.bonuses.toLocaleString()}</Text>
                <Text fontFamily="'Inter', sans-serif" mb={3} color="gray.700"><strong>{t('deductions')}:</strong> LKR {detailsData.deductions.toLocaleString()}</Text>
                <Text fontFamily="'Inter', sans-serif" mb={3} color="gray.700"><strong>{t('status')}:</strong> {detailsData.status}</Text>
                <Text fontFamily="'Inter', sans-serif" mb={3} color="gray.700"><strong>{t('notes')}:</strong> {detailsData.notes || 'N/A'}</Text>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              onClick={onDetailsClose}
              mr={3}
              borderColor="purple.300"
              color="purple.600"
              borderRadius="full"
              _hover={{ bg: 'purple.50' }}
            >
              {t('cancel')}
            </Button>
            <Button
              bg="purple.600"
              color="white"
              borderRadius="full"
              onClick={handleExportPDF}
              _hover={{ bg: 'purple.700' }}
              _active={{ bg: 'purple.800' }}
            >
              {t('exportPDF')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default SalaryManagement;