import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Text,
  Alert,
  AlertIcon,
  AlertDescription,
  Flex,
  Radio,
  RadioGroup,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Image,
  HStack,
} from '@chakra-ui/react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { FaDownload } from 'react-icons/fa';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function MarkAttendance() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportStartDate, setReportStartDate] = useState('');
  const [reportEndDate, setReportEndDate] = useState('');
  const [reportData, setReportData] = useState([]);
  const [savedAttendance, setSavedAttendance] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isRotated, setIsRotated] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:3000/employees');
        setEmployees(response.data.employees);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/attendance/date/${selectedDate}`);
      const attendanceData = response.data.attendance.reduce((acc, item) => {
        acc[item.EmployeeId._id] = item.Status;
        return acc;
      }, {});
      setAttendance(attendanceData);
      setSavedAttendance(response.data.attendance);
      console.log('Fetched attendance for', selectedDate, ':', response.data.attendance);
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
        axios.post('http://localhost:3000/attendance', {
          EmployeeId: employeeId,
          attendanceDate: selectedDate,
          Status: status,
        })
      );
      await Promise.all(promises);
      setNotification({ type: 'success', message: 'Attendance updated successfully!' });
      setTimeout(() => setNotification(null), 3000);
      fetchAttendance();
    } catch (error) {
      console.error('Error marking attendance:', error.response?.data || error.message);
      setNotification({ type: 'error', message: `Failed to update attendance: ${error.response?.data?.error || error.message}` });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleReport = async (e) => {
    e.preventDefault();
    if (!reportStartDate || !reportEndDate) {
      setNotification({ type: 'error', message: 'Please select both start and end dates!' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    try {
      const response = await axios.get('http://localhost:3000/attendance/report', {
        params: { startDate: reportStartDate, endDate: reportEndDate },
      });
      console.log('Report data:', response.data.attendance);
      setReportData(response.data.attendance || []);
      setNotification({ type: 'success', message: 'Report generated successfully!' });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Error generating report:', error.response?.data || error.message);
      setReportData([]);
      setNotification({ type: 'error', message: 'Failed to generate report' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const downloadCSV = () => {
    if (reportData.length === 0) {
      setNotification({ type: 'error', message: 'No report data to download!' });
      setTimeout(() => setNotification(null), 3000);
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

  // Prepare data for the graph
  const chartData = {
    labels: employees.map((emp) => emp.EmployeeName),
    datasets: [
      {
        label: 'Present Days',
        data: employees.map((emp) =>
          reportData.filter((record) => record.EmployeeId?._id === emp._id && record.Status === 'Present').length
        ),
        backgroundColor: 'rgba(34, 197, 94, 0.8)', // Vibrant green
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(34, 197, 94, 1)',
        hoverBorderColor: 'rgba(34, 197, 94, 1)',
        borderRadius: 5,
      },
      {
        label: 'Absent Days',
        data: employees.map((emp) =>
          reportData.filter((record) => record.EmployeeId?._id === emp._id && record.Status === 'Absent').length
        ),
        backgroundColor: 'rgba(239, 68, 68, 0.8)', // Vibrant red
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(239, 68, 68, 1)',
        hoverBorderColor: 'rgba(239, 68, 68, 1)',
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { font: { size: 14, weight: 'bold' }, color: '#6B7280' } },
      title: {
        display: true,
        text: `Attendance Report (${reportStartDate} to ${reportEndDate})`,
        font: { size: 18, weight: 'bold' },
        color: '#8B5CF6',
      },
      tooltip: { backgroundColor: 'rgba(0, 0, 0, 0.8)', titleFont: { size: 14 }, bodyFont: { size: 12 }, padding: 10 },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Days', font: { size: 14, weight: 'bold' }, color: '#6B7280' },
        ticks: { stepSize: 1, precision: 0, font: { size: 12 }, color: '#6B7280' },
        grid: { color: 'rgba(0, 0, 0, 0.1)' },
      },
      x: {
        title: { display: true, text: 'Employees', font: { size: 14, weight: 'bold' }, color: '#6B7280' },
        ticks: { font: { size: 12 }, color: '#6B7280', maxRotation: 45, minRotation: 45 },
        grid: { display: false },
      },
    },
    animation: { duration: 1000, easing: 'easeOutBounce' },
  };

  return (
    <Box p={10} position="relative">
      <Heading as="h1" size="xl" color="purple.600" mb={6}>
        Mark Attendance
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

      <FormControl mb={6}>
        <FormLabel fontWeight="semibold" color="purple.600">
          Select Date
        </FormLabel>
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          focusBorderColor="purple.400"
          width="auto"
        />
      </FormControl>

      <Box as="form" onSubmit={handleSubmit} mb={10}>
        <VStack spacing={6}>
          {employees.map((emp) => (
            <Box
              key={emp._id}
              bg="white"
              p={4}
              borderRadius="2xl"
              boxShadow="xl"
              width="full"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <HStack spacing={4}>
                {emp.ProfilePicture ? (
                  <Image
                    src={`http://localhost:3000${emp.ProfilePicture}`}
                    alt={emp.EmployeeName}
                    boxSize="12"
                    borderRadius="full"
                    objectFit="cover"
                  />
                ) : (
                  <Box
                    boxSize="12"
                    borderRadius="full"
                    bg="gray.200"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text color="gray.500">No Image</Text>
                  </Box>
                )}
                <Text fontSize="lg" fontWeight="semibold" color="purple.600">
                  {emp.EmployeeName}
                </Text>
              </HStack>
              <RadioGroup
                value={attendance[emp._id] || ''}
                onChange={(value) => handleAttendanceChange(emp._id, value)}
              >
                <Stack direction="row" spacing={4}>
                  <Radio value="Present" colorScheme="purple">
                    Present
                  </Radio>
                  <Radio value="Absent" colorScheme="purple">
                    Absent
                  </Radio>
                </Stack>
              </RadioGroup>
            </Box>
          ))}
          <Button type="submit" colorScheme="purple" width="full" size="lg" fontWeight="semibold">
            Save Attendance
          </Button>
        </VStack>
      </Box>

      {savedAttendance.length > 0 && (
        <Box mb={10}>
          <Heading as="h2" size="lg" color="purple.600" mb={4}>
            Attendance Summary for {new Date(selectedDate).toLocaleDateString()}
          </Heading>
          <VStack spacing={6}>
            {employees.map((emp) => {
              const status = savedAttendance.find((a) => a.EmployeeId._id === emp._id)?.Status || 'Not Marked';
              return (
                <Box
                  key={emp._id}
                  bg="white"
                  p={4}
                  borderRadius="2xl"
                  boxShadow="xl"
                  width="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  borderLeftWidth={4}
                  borderLeftColor={
                    status === 'Present' ? 'green.500' : status === 'Absent' ? 'red.500' : 'gray.300'
                  }
                >
                  <HStack spacing={4}>
                    {emp.ProfilePicture ? (
                      <Image
                        src={`http://localhost:3000${emp.ProfilePicture}`}
                        alt={emp.EmployeeName}
                        boxSize="12"
                        borderRadius="full"
                        objectFit="cover"
                      />
                    ) : (
                      <Box
                        boxSize="12"
                        borderRadius="full"
                        bg="gray.200"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Text color="gray.500">No Image</Text>
                      </Box>
                    )}
                    <Text fontSize="lg" fontWeight="semibold" color="purple.600">
                      {emp.EmployeeName}
                    </Text>
                  </HStack>
                  <Text
                    fontSize="lg"
                    fontWeight="semibold"
                    color={status === 'Present' ? 'green.500' : status === 'Absent' ? 'red.500' : 'gray.500'}
                  >
                    {status}
                  </Text>
                </Box>
              );
            })}
          </VStack>
        </Box>
      )}

      <Heading as="h2" size="lg" color="purple.600" mb={4}>
        Generate Attendance Report
      </Heading>
      <Box as="form" onSubmit={handleReport} mb={6}>
        <HStack spacing={4} alignItems="center">
          <Input
            type="date"
            value={reportStartDate}
            onChange={(e) => setReportStartDate(e.target.value)}
            focusBorderColor="purple.400"
            width="auto"
          />
          <Text fontWeight="semibold" color="purple.600">
            to
          </Text>
          <Input
            type="date"
            value={reportEndDate}
            onChange={(e) => setReportEndDate(e.target.value)}
            focusBorderColor="purple.400"
            width="auto"
          />
          <Button type="submit" colorScheme="purple" size="md">
            Generate Report
          </Button>
        </HStack>
      </Box>

      <Box
        bg="white"
        p={6}
        borderRadius="2xl"
        boxShadow="xl"
        transition="transform 0.5s"
        transform={isRotated ? 'rotateY(180deg)' : 'rotateY(0deg)'}
        transformStyle="preserve-3d"
        cursor="pointer"
        position="relative"
        minH="400px"
        onClick={toggleReportView}
      >
        <Box position="absolute" width="full" height="full" display={isRotated ? 'none' : 'block'}>
          <Flex justify="space-between" align="center" mb={4}>
            <Heading as="h3" size="md" color="purple.600">
              {reportStartDate && reportEndDate
                ? `Attendance Report (${reportStartDate} to ${reportEndDate})`
                : 'Attendance Report'}
            </Heading>
            {reportData.length > 0 && (
              <Button
                colorScheme="purple"
                size="sm"
                leftIcon={<FaDownload />}
                onClick={(e) => {
                  e.stopPropagation();
                  downloadCSV();
                }}
              >
                Download CSV
              </Button>
            )}
          </Flex>
          {reportData.length > 0 ? (
            <Table variant="simple">
              <Thead bg="purple.600">
                <Tr>
                  <Th borderTopLeftRadius="lg" color="white">
                    Employee Name
                  </Th>
                  <Th color="white">Date</Th>
                  <Th borderTopRightRadius="lg" color="white">
                    Status
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {reportData.map((record) => (
                  <Tr
                    key={record._id}
                    bg={record.Status === 'Present' ? 'green.50' : 'red.50'}
                    _hover={{ bg: 'purple.50' }}
                  >
                    <Td fontWeight="medium" color="purple.600">
                      {record.EmployeeId.EmployeeName}
                    </Td>
                    <Td color="gray.700">{new Date(record.Date).toLocaleDateString()}</Td>
                    <Td>
                      <Badge
                        colorScheme={record.Status === 'Present' ? 'green' : 'red'}
                        px={3}
                        py={1}
                        borderRadius="full"
                      >
                        {record.Status}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          ) : (
            <Text color="gray.500" textAlign="center" py={4}>
              No attendance data available for the selected range. Mark some attendance and try again.
            </Text>
          )}
        </Box>

        <Box
          position="absolute"
          width="full"
          height="full"
          display={isRotated ? 'block' : 'none'}
          transform="rotateY(180deg)"
        >
          {reportData.length > 0 ? (
            <Box height="100%" width="100%">
              <Bar data={chartData} options={chartOptions} />
            </Box>
          ) : (
            <Text color="gray.500" textAlign="center" py={4}>
              No data available to display graph. Generate a report first.
            </Text>
          )}
        </Box>
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

export default MarkAttendance;