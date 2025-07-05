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
  GridItem,
  Text,
  Image,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useToast,
  Flex,
  IconButton,
} from '@chakra-ui/react';
import { FaCheckCircle, FaExclamationCircle, FaDownload } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useLanguage } from './LanguageContext';
import { useTheme } from './ThemeContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MotionBox = motion(Box);

function MarkAttendance() {
  const { t } = useLanguage();
  const { currentTheme } = useTheme();
  const toast = useToast();
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportStartDate, setReportStartDate] = useState('');
  const [reportEndDate, setReportEndDate] = useState('');
  const [reportData, setReportData] = useState([]);
  const [savedAttendance, setSavedAttendance] = useState([]);
  const [isRotated, setIsRotated] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/employee', { withCredentials: true });
        setEmployees(response.data.employees);
      } catch (error) {
        console.error('Error fetching employees:', error);
        toast({
          title: t('error'),
          description: t('failedToFetchEmployees'),
          status: 'error',
          duration: 3000,
          isClosable: true,
          icon: <FaExclamationCircle />,
        });
      }
    };
    fetchEmployees();
  }, [t, toast]);

  const fetchAttendance = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/attendance/date/${selectedDate}`, { withCredentials: true });
      const attendanceData = response.data.attendance.reduce((acc, item) => {
        acc[item.EmployeeId._id] = item.Status;
        return acc;
      }, {});
      setAttendance(attendanceData);
      setSavedAttendance(response.data.attendance);
    } catch (error) {
      console.error('Error fetching attendance:', error.response?.data || error.message);
      setSavedAttendance([]);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate]);

  const handleAttendanceChange = (employeeId, status) => {
    setAttendance((prev) => ({ ...prev, [employeeId]: status }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const promises = Object.entries(attendance).map(([employeeId, status]) =>
        axios.post('http://localhost:4000/api/attendance', {
          EmployeeId: employeeId,
          attendanceDate: selectedDate,
          Status: status,
        }, { withCredentials: true })
      );
      await Promise.all(promises);
      toast({
        title: t('success'),
        description: t('attendanceUpdated'),
        status: 'success',
        duration: 3000,
        isClosable: true,
        icon: <FaCheckCircle />,
      });
      fetchAttendance();
    } catch (error) {
      console.error('Error marking attendance:', error.response?.data || error.message);
      toast({
        title: t('error'),
        description: t('failedToUpdateAttendance'),
        status: 'error',
        duration: 3000,
        isClosable: true,
        icon: <FaExclamationCircle />,
      });
    }
  };

  const handleReport = async (e) => {
    e.preventDefault();
    if (!reportStartDate || !reportEndDate) {
      toast({
        title: t('error'),
        description: t('selectDateRange'),
        status: 'error',
        duration: 3000,
        isClosable: true,
        icon: <FaExclamationCircle />,
      });
      return;
    }
    try {
      const response = await axios.get('http://localhost:4000/api/attendance/report', {
        params: { startDate: reportStartDate, endDate: reportEndDate },
        withCredentials: true,
      });
      setReportData(response.data.attendance || []);
      toast({
        title: t('success'),
        description: t('reportGenerated'),
        status: 'success',
        duration: 3000,
        isClosable: true,
        icon: <FaCheckCircle />,
      });
    } catch (error) {
      console.error('Error generating report:', error.response?.data || error.message);
      setReportData([]);
      toast({
        title: t('error'),
        description: t('failedToGenerateReport'),
        status: 'error',
        duration: 3000,
        isClosable: true,
        icon: <FaExclamationCircle />,
      });
    }
  };

  const downloadCSV = () => {
    if (reportData.length === 0) {
      toast({
        title: t('error'),
        description: t('noReportData'),
        status: 'error',
        duration: 3000,
        isClosable: true,
        icon: <FaExclamationCircle />,
      });
      return;
    }
    const csvContent = [
      'Employee Name,Date,Status',
      ...reportData.map((record) =>
        `"${record.EmployeeId.EmployeeName}",${new Date(record.Date).toLocaleDateString()},${record.Status}`
      ),
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attendance_report_${reportStartDate}_to_${reportEndDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const toggleReportView = () => {
    setIsRotated(!isRotated);
  };

  const chartData = {
    labels: employees.map(emp => emp.EmployeeName),
    datasets: [
      {
        label: t('presentDays'),
        data: employees.map(emp =>
          reportData.filter(record => record.EmployeeId?._id === emp._id && record.Status === 'Present').length
        ),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
        borderRadius: 5,
      },
      {
        label: t('absentDays'),
        data: employees.map(emp =>
          reportData.filter(record => record.EmployeeId?._id === emp._id && record.Status === 'Absent').length
        ),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { size: 14, family: "'Montserrat', sans-serif" }, color: currentTheme.primaryColor },
      },
      title: {
        display: true,
        text: `${t('attendanceReport')} (${reportStartDate} to ${reportEndDate})`,
        font: { size: 18, family: "'Playfair Display', serif" },
        color: currentTheme.primaryColor,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: t('days'), font: { size: 14, family: "'Montserrat', sans-serif" }, color: currentTheme.primaryColor },
        ticks: { stepSize: 1, precision: 0, font: { size: 12, family: "'Montserrat', sans-serif" }, color: currentTheme.primaryColor },
      },
      x: {
        title: { display: true, text: t('employees'), font: { size: 14, family: "'Montserrat', sans-serif" }, color: currentTheme.primaryColor },
        ticks: { font: { size: 12, family: "'Montserrat', sans-serif" }, color: currentTheme.primaryColor, maxRotation: 45, minRotation: 45 },
      },
    },
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
            {t('markAttendance')}
          </Heading>
          <Box>
            <FormControl>
              <FormLabel fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>
                {t('selectDate')}
              </FormLabel>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                borderRadius="lg"
                focusBorderColor={currentTheme.primaryColor}
                bg="white"
                max={new Date().toISOString().split('T')[0]}
              />
            </FormControl>
          </Box>
          <form onSubmit={handleSubmit}>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
              {employees.map((emp) => (
                <Box
                  key={emp._id}
                  bg="white"
                  p={4}
                  borderRadius="xl"
                  boxShadow="lg"
                  _hover={{ boxShadow: 'xl' }}
                >
                  <Flex align="center" justify="space-between">
                    <Flex align="center" gap={4}>
                      {emp.ProfilePicture ? (
                        <Image
                          src={`http://localhost:4000${emp.ProfilePicture}`}
                          alt={emp.EmployeeName}
                          boxSize="50px"
                          borderRadius="full"
                          objectFit="cover"
                        />
                      ) : (
                        <Box
                          boxSize="50px"
                          borderRadius="full"
                          bg="gray.200"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Text fontSize="sm" color="gray.500">{t('noImage')}</Text>
                        </Box>
                      )}
                      <Text fontFamily="'Montserrat', sans-serif" fontWeight="semibold" color={currentTheme.primaryColor}>
                        {emp.EmployeeName}
                      </Text>
                    </Flex>
                    <Flex gap={4}>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`attendance-${emp._id}`}
                          value="Present"
                          checked={attendance[emp._id] === 'Present'}
                          onChange={() => handleAttendanceChange(emp._id, 'Present')}
                          className="form-radio"
                        />
                        <Text fontFamily="'Montserrat', sans-serif">{t('present')}</Text>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`attendance-${emp._id}`}
                          value="Absent"
                          checked={attendance[emp._id] === 'Absent'}
                          onChange={() => handleAttendanceChange(emp._id, 'Absent')}
                          className="form-radio"
                        />
                        <Text fontFamily="'Montserrat', sans-serif">{t('absent')}</Text>
                      </label>
                    </Flex>
                  </Flex>
                </Box>
              ))}
            </Grid>
            <Button
              type="submit"
              bg={currentTheme.primaryColor}
              color="white"
              borderRadius="full"
              _hover={{ bg: `${currentTheme.primaryColor.split('.')[0]}.700`, transform: 'scale(1.05)' }}
              boxShadow="md"
              fontFamily="'Montserrat', sans-serif"
              size="lg"
              mt={6}
              w="full"
            >
              {t('saveAttendance')}
            </Button>
          </form>
          {savedAttendance.length > 0 && (
            <Box>
              <Heading
                as="h2"
                size="lg"
                fontFamily="'Playfair Display', serif"
                color={currentTheme.primaryColor}
                mb={4}
              >
                {t('attendanceSummary')} {new Date(selectedDate).toLocaleDateString()}
              </Heading>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
                {employees.map((emp) => {
                  const status = savedAttendance.find((a) => a.EmployeeId._id === emp._id)?.Status || t('notMarked');
                  return (
                    <Box
                      key={emp._id}
                      bg="white"
                      p={4}
                      borderRadius="xl"
                      boxShadow="lg"
                      borderLeft="4px"
                      borderColor={
                        status === 'Present' ? 'green.500' : status === 'Absent' ? 'red.500' : 'gray.300'
                      }
                    >
                      <Flex align="center" justify="space-between">
                        <Flex align="center" gap={4}>
                          {emp.ProfilePicture ? (
                            <Image
                              src={`http://localhost:4000${emp.ProfilePicture}`}
                              alt={emp.EmployeeName}
                              boxSize="50px"
                              borderRadius="full"
                              objectFit="cover"
                            />
                          ) : (
                            <Box
                              boxSize="50px"
                              borderRadius="full"
                              bg="gray.200"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Text fontSize="sm" color="gray.500">{t('noImage')}</Text>
                            </Box>
                          )}
                          <Text fontFamily="'Montserrat', sans-serif" fontWeight="semibold" color={currentTheme.primaryColor}>
                            {emp.EmployeeName}
                          </Text>
                        </Flex>
                        <Text
                          fontFamily="'Montserrat', sans-serif"
                          fontWeight="semibold"
                          color={status === 'Present' ? 'green.500' : status === 'Absent' ? 'red.500' : 'gray.500'}
                        >
                          {status}
                        </Text>
                      </Flex>
                    </Box>
                  );
                })}
              </Grid>
            </Box>
          )}
          <Heading
            as="h2"
            size="lg"
            fontFamily="'Playfair Display', serif"
            color={currentTheme.primaryColor}
            mb={4}
          >
            {t('generateAttendanceReport')}
          </Heading>
          <form onSubmit={handleReport}>
            <Flex gap={4} align="center" flexWrap="wrap">
              <Input
                type="date"
                value={reportStartDate}
                onChange={(e) => setReportStartDate(e.target.value)}
                borderRadius="lg"
                focusBorderColor={currentTheme.primaryColor}
                bg="white"
                max={new Date().toISOString().split('T')[0]}
              />
              <Text fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>{t('to')}</Text>
              <Input
                type="date"
                value={reportEndDate}
                onChange={(e) => setReportEndDate(e.target.value)}
                borderRadius="lg"
                focusBorderColor={currentTheme.primaryColor}
                bg="white"
                max={new Date().toISOString().split('T')[0]}
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
                {t('generateReport')}
              </Button>
            </Flex>
          </form>
          <MotionBox
            bg="white"
            p={6}
            borderRadius="xl"
            boxShadow="lg"
            minH="400px"
            position="relative"
            cursor="pointer"
            onClick={toggleReportView}
            animate={{ rotateY: isRotated ? 180 : 0 }}
            transition={{ duration: 0.5 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <Box position="absolute" w="full" h="full" visibility={isRotated ? 'hidden' : 'visible'}>
              <Flex justify="space-between" align="center" mb={4}>
                <Heading
                  as="h3"
                  size="md"
                  fontFamily="'Playfair Display', serif"
                  color={currentTheme.primaryColor}
                >
                  {reportStartDate && reportEndDate
                    ? `${t('attendanceReport')} (${reportStartDate} to ${reportEndDate})`
                    : t('attendanceReport')}
                </Heading>
                {reportData.length > 0 && (
                  <IconButton
                    icon={<FaDownload />}
                    onClick={(e) => { e.stopPropagation(); downloadCSV(); }}
                    bg={currentTheme.primaryColor}
                    color="white"
                    borderRadius="full"
                    _hover={{ bg: `${currentTheme.primaryColor.split('.')[0]}.700` }}
                    aria-label={t('downloadCSV')}
                  />
                )}
              </Flex>
              {reportData.length > 0 ? (
                <Table variant="simple">
                  <Thead>
                    <Tr bg={currentTheme.primaryColor}>
                      <Th color="white" fontFamily="'Montserrat', sans-serif">{t('employeeName')}</Th>
                      <Th color="white" fontFamily="'Montserrat', sans-serif">{t('date')}</Th>
                      <Th color="white" fontFamily="'Montserrat', sans-serif">{t('status')}</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {reportData.map((record) => (
                      <Tr
                        key={record._id}
                        bg={record.Status === 'Present' ? 'green.50' : 'red.50'}
                        _hover={{ bg: `${currentTheme.primaryColor.split('.')[0]}.50` }}
                      >
                        <Td fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>
                          {record.EmployeeId.EmployeeName}
                        </Td>
                        <Td fontFamily="'Montserrat', sans-serif" color="gray.700">
                          {new Date(record.Date).toLocaleDateString()}
                        </Td>
                        <Td>
                          <Badge
                            colorScheme={record.Status === 'Present' ? 'green' : 'red'}
                            borderRadius="full"
                            px={3}
                            py={1}
                          >
                            {record.Status}
                          </Badge>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              ) : (
                <Text fontFamily="'Montserrat', sans-serif" color="gray.500" textAlign="center" py={4}>
                  {t('noAttendanceData')}
                </Text>
              )}
            </Box>
            <Box
              position="absolute"
              w="full"
              h="full"
              transform="rotateY(180deg)"
              visibility={isRotated ? 'visible' : 'hidden'}
            >
              {reportData.length > 0 ? (
                <Box h="100%">
                  <Bar data={chartData} options={chartOptions} />
                </Box>
              ) : (
                <Text fontFamily="'Montserrat', sans-serif" color="gray.500" textAlign="center" py={4}>
                  {t('noDataForGraph')}
                </Text>
              )}
            </Box>
          </MotionBox>
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

export default MarkAttendance;