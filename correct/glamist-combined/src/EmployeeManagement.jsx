import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Flex, Button, Heading, Text, Input, Select, Textarea, SimpleGrid, VStack, HStack, Image, Avatar,
  Table, Thead, Tbody, Tr, Th, Td, FormControl, FormLabel, FormErrorMessage, Radio, RadioGroup,
  Alert, AlertIcon, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody,
  useColorMode, useBreakpointValue, useToast, IconButton, Icon,
} from '@chakra-ui/react';
import { FaCheckCircle, FaExclamationCircle, FaUsers, FaBuilding, FaCalendarCheck, FaEnvelope, FaEdit, FaTrash, FaWhatsapp, FaDownload, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useLanguage } from './LanguageContext';
import { useTheme } from './ThemeContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

// Define the backend base URL directly
const BACKEND_URL = 'http://localhost:4000';

function EmployeeManagement() {
  const { colorMode } = useColorMode();
  const { currentTheme } = useTheme();
  const { t } = useLanguage();
  const toast = useToast();
  const buttonSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const fontSize = useBreakpointValue({ base: 'sm', md: 'md' });

  // State for dashboard
  const [activeSection, setActiveSection] = useState('dashboard');
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    todayAttendance: { present: 0, absent: 0 },
  });

  // State for Add Employee
  const [employeeFormData, setEmployeeFormData] = useState({
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
  const [employeeErrors, setEmployeeErrors] = useState({});

  // State for View Employees
  const [employees, setEmployees] = useState([]);
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');
  const [editingEmp, setEditingEmp] = useState(null);
  const [editEmployeeForm, setEditEmployeeForm] = useState({});
  const [editProfilePicture, setEditProfilePicture] = useState(null);

  // State for Mark Attendance
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [savedAttendance, setSavedAttendance] = useState([]);
  const [reportStartDate, setReportStartDate] = useState('');
  const [reportEndDate, setReportEndDate] = useState('');
  const [reportData, setReportData] = useState([]);
  const [isRotated, setIsRotated] = useState(false);

  // State for Manage Departments
  const [departments, setDepartments] = useState([]);
  const [departmentFormData, setDepartmentFormData] = useState({
    DepartmentName: '',
    Description: '',
  });
  const [departmentErrors, setDepartmentErrors] = useState({});
  const [departmentSearchId, setDepartmentSearchId] = useState('');
  const [editingDept, setEditingDept] = useState(null);
  const [editDeptForm, setEditDeptForm] = useState({ DepartmentName: '', Description: '' });
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // State for Send Notice
  const [noticeMessage, setNoticeMessage] = useState('');
  const [noticeErrors, setNoticeErrors] = useState({});

  // Create axios instance with base URL and JWT header
  const axiosInstance = axios.create({
    baseURL: BACKEND_URL,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    },
  });

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeesResponse = await axiosInstance.get('/api/employees');
        const fetchedEmployees = (employeesResponse.data.employees || [])
          .filter(emp => emp && emp._id && emp.EmployeeName); // Filter out invalid entries
        setEmployees(fetchedEmployees);
        setStats((prev) => ({ ...prev, totalEmployees: fetchedEmployees.length || 0 }));

        const departmentsResponse = await axiosInstance.get('/api/departments');
        const fetchedDepartments = departmentsResponse.data.departments || [];
        setDepartments(fetchedDepartments);
        setStats((prev) => ({ ...prev, totalDepartments: fetchedDepartments.length || 0 }));

        const today = new Date().toISOString().split('T')[0];
        const attendanceResponse = await axiosInstance.get(`/api/attendance/date/${today}`);
        const fetchedAttendance = (attendanceResponse.data.attendance || [])
          .filter(item => item.EmployeeId && item.EmployeeId._id); // Filter out invalid attendance
        setSavedAttendance(fetchedAttendance);
        setAttendance(fetchedAttendance.reduce((acc, item) => {
          if (item.EmployeeId && item.EmployeeId._id) {
            acc[item.EmployeeId._id] = item.Status;
          }
          return acc;
        }, {}));
        const present = fetchedAttendance.filter((a) => a.Status === 'Present' && a.EmployeeId).length || 0;
        const absent = fetchedAttendance.filter((a) => a.Status === 'Absent' && a.EmployeeId).length || 0;
        setStats((prev) => ({ ...prev, todayAttendance: { present, absent } }));
      } catch (error) {
        console.error('Error fetching initial data:', error.response?.data || error.message, error.response?.config.url);
        toast({
          title: t('errorGeneric'),
          description: error.response?.status === 404
            ? `${t('errorNotFound')} (${error.response?.config.url})`
            : error.response?.data?.message || t('errorNoData'),
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setEmployees([]);
        setDepartments([]);
        setSavedAttendance([]);
        setAttendance({});
        setStats({
          totalEmployees: 0,
          totalDepartments: 0,
          todayAttendance: { present: 0, absent: 0 },
        });
      }
    };
    fetchData();
  }, [t, toast]);

  // Fetch attendance when date changes
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axiosInstance.get(`/api/attendance/date/${selectedDate}`);
        const fetchedAttendance = (response.data.attendance || [])
          .filter(item => item.EmployeeId && item.EmployeeId._id); // Filter out invalid attendance
        setAttendance(fetchedAttendance.reduce((acc, item) => {
          if (item.EmployeeId && item.EmployeeId._id) {
            acc[item.EmployeeId._id] = item.Status;
          }
          return acc;
        }, {}));
        setSavedAttendance(fetchedAttendance);
      } catch (error) {
        console.error('Error fetching attendance:', error.response?.data || error.message);
        setSavedAttendance([]);
        setAttendance({});
      }
    };
    fetchAttendance();
  }, [selectedDate]);

  // Add Employee Handlers
  const handleEmployeeChange = (e) => {
    const { name, value } = e.target;
    setEmployeeFormData((prev) => ({ ...prev, [name]: value }));
    if (employeeErrors[name]) setEmployeeErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!employeeFormData.EmployeeName.trim()) newErrors.EmployeeName = t('errorInvalidInput');
    if (!employeeFormData.Role.trim()) newErrors.Role = t('errorInvalidInput');
    if (!employeeFormData.Age || isNaN(employeeFormData.Age) || Number(employeeFormData.Age) <= 0) newErrors.Age = t('errorInvalidInput');
    if (!employeeFormData.Address.trim()) newErrors.Address = t('errorInvalidInput');
    if (!employeeFormData.Phone.trim()) newErrors.Phone = t('errorInvalidInput');
    if (!employeeFormData.DepartmentId) newErrors.DepartmentId = t('errorInvalidInput');
    if (!employeeFormData.Email.trim() || !/^\S+@\S+\.\S+$/.test(employeeFormData.Email)) newErrors.Email = t('errorInvalidInput');
    if (!employeeFormData.HireDate) newErrors.HireDate = t('errorInvalidInput');

    if (Object.keys(newErrors).length > 0) {
      setEmployeeErrors(newErrors);
      return;
    }

    const data = new FormData();
    const formDataToSend = {
      ...employeeFormData,
      Age: Number(employeeFormData.Age),
      HireDate: new Date(employeeFormData.HireDate).toISOString(),
    };

    Object.keys(formDataToSend).forEach((key) => {
      data.append(key, formDataToSend[key]);
    });
    if (profilePicture) data.append('ProfilePicture', profilePicture);

    try {
      const response = await axiosInstance.post('/api/employees', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setEmployees([...employees, response.data.employee]);
      setStats((prev) => ({ ...prev, totalEmployees: prev.totalEmployees + 1 }));
      setEmployeeFormData({
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
        title: t('employeeAddedSuccess'),
        description: response.data.emailSent ? t('welcomeEmailSent') : t('employeeAddedNoEmail'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error adding employee:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.response?.config?.url,
      });
      toast({
        title: t('errorGeneric'),
        description: error.response?.data?.message || t('errorInvalidInput'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // View Employees Handlers
  const handleEmployeeSearch = async (e) => {
    e.preventDefault();
    if (!employeeSearchTerm.trim()) return;

    try {
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(employeeSearchTerm);
      let response;

      if (isObjectId) {
        response = await axiosInstance.get(`/api/employees/${employeeSearchTerm}`);
        setEmployees([response.data.employee].filter(emp => emp && emp._id && emp.EmployeeName));
      } else {
        response = await axiosInstance.get(`/api/employees?name=${encodeURIComponent(employeeSearchTerm)}`);
        setEmployees((response.data.employees || []).filter(emp => emp && emp._id && emp.EmployeeName));
      }
      toast({
        title: isObjectId ? t('employeeFound') : t('employeesFound'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setEmployeeSearchTerm('');
    } catch (error) {
      console.error('Error searching employee:', error.response?.data || error.message);
      toast({
        title: t('errorNoData'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditEmployee = (emp) => {
    setEditingEmp(emp._id);
    setEditEmployeeForm({
      EmployeeName: emp.EmployeeName,
      Role: emp.Role,
      Age: emp.Age,
      Address: emp.Address,
      Phone: emp.Phone,
      HireDate: new Date(emp.HireDate).toISOString().split('T')[0],
      DepartmentId: emp.DepartmentId._id || emp.DepartmentId,
      Email: emp.Email || '',
    });
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(editEmployeeForm).forEach((key) => data.append(key, editEmployeeForm[key]));
    if (editProfilePicture) data.append('ProfilePicture', editProfilePicture);

    try {
      const response = await axiosInstance.put(`/api/employees/${editingEmp}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setEmployees(employees.map((e) => (e._id === editingEmp ? response.data.employee : e)));
      setEditingEmp(null);
      setEditProfilePicture(null);
      toast({
        title: t('employeeUpdatedSuccess'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating employee:', error.response?.data || error.message);
      toast({
        title: t('errorGeneric'),
        description: error.response?.data?.message || t('errorInvalidInput'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm(t('confirmDeleteEmployee'))) return;
    try {
      await axiosInstance.delete(`/api/employees/${id}`);
      setEmployees(employees.filter((e) => e._id !== id));
      setStats((prev) => ({ ...prev, totalEmployees: prev.totalEmployees - 1 }));
      toast({
        title: t('employeeDeletedSuccess'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting employee:', error.response?.data || error.message);
      toast({
        title: t('errorGeneric'),
        description: error.response?.data?.message || t('errorInvalidInput'),
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
    return `https://wa.me/+94${noLeadingZero}`;
  };

  // Mark Attendance Handlers
  const handleAttendanceChange = (employeeId, status) => {
    setAttendance((prev) => ({ ...prev, [employeeId]: status }));
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    try {
      const promises = Object.entries(attendance).map(([employeeId, status]) =>
        axiosInstance.post('/api/attendance', {
          EmployeeId: employeeId,
          attendanceDate: selectedDate,
          Status: status,
        })
      );
      await Promise.all(promises);
      const response = await axiosInstance.get(`/api/attendance/date/${selectedDate}`);
      const fetchedAttendance = (response.data.attendance || [])
        .filter(item => item.EmployeeId && item.EmployeeId._id); // Filter out invalid attendance
      setSavedAttendance(fetchedAttendance);
      toast({
        title: t('attendanceUpdatedSuccess'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error marking attendance:', error.response?.data || error.message);
      toast({
        title: t('errorGeneric'),
        description: error.response?.data?.error || t('errorInvalidInput'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    if (!reportStartDate || !reportEndDate) {
      toast({
        title: t('errorDatesRequired'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      const response = await axiosInstance.get('/api/attendance/report', {
        params: { startDate: reportStartDate, endDate: reportEndDate },
      });
      const fetchedReportData = (response.data.attendance || []).filter(
        record => record.EmployeeId && record.EmployeeId._id && record.EmployeeId.EmployeeName
      ); // Filter out invalid report data
      setReportData(fetchedReportData);
      toast({
        title: t('reportGeneratedSuccess'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error generating report:', error.response?.data || error.message);
      setReportData([]);
      toast({
        title: t('errorGeneric'),
        description: error.response?.data?.message || t('errorNoData'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const downloadCSV = () => {
    if (reportData.length === 0) {
      toast({
        title: t('errorNoReportData'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const csvContent = [
      'Employee Name,Date,Status',
      ...reportData.map((record) =>
        `"${record.EmployeeId.EmployeeName}",${new Date(record.attendanceDate).toLocaleDateString()},${record.Status}`
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

  // Chart data for attendance report
  const chartData = {
    labels: employees.filter(emp => emp && emp._id && emp.EmployeeName).map((emp) => emp.EmployeeName),
    datasets: [
      {
        label: t('present'),
        data: employees.filter(emp => emp && emp._id && emp.EmployeeName).map((emp) =>
          reportData.filter((record) => record.EmployeeId?._id === emp._id && record.Status === 'Present').length
        ),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(34, 197, 94, 1)',
        hoverBorderColor: 'rgba(34, 197, 94, 1)',
        borderRadius: 5,
      },
      {
        label: t('absent'),
        data: employees.filter(emp => emp && emp._id && emp.EmployeeName).map((emp) =>
          reportData.filter((record) => record.EmployeeId?._id === emp._id && record.Status === 'Absent').length
        ),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
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
      legend: {
        position: 'top',
        labels: { font: { size: 14, weight: 'bold' }, color: colorMode === 'light' ? '#6B7280' : '#A0AEC0' },
      },
      title: {
        display: true,
        text: t('attendanceReport', { start: reportStartDate, end: reportEndDate }),
        font: { size: 18, weight: 'bold' },
        color: currentTheme.primaryColor,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        padding: 10,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: t('days'), font: { size: 14, weight: 'bold' }, color: colorMode === 'light' ? '#6B7280' : '#A0AEC0' },
        ticks: { stepSize: 1, precision: 0, font: { size: 12 }, color: colorMode === 'light' ? '#6B7280' : '#A0AEC0' },
        grid: { color: colorMode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)' },
      },
      x: {
        title: { display: true, text: t('employees'), font: { size: 14, weight: 'bold' }, color: colorMode === 'light' ? '#6B7280' : '#A0AEC0' },
        ticks: { font: { size: 12 }, color: colorMode === 'light' ? '#6B7280' : '#A0AEC0', maxRotation: 45, minRotation: 45 },
        grid: { display: false },
      },
    },
    animation: { duration: 1000, easing: 'easeOutBounce' },
  };

  // Manage Departments Handlers
  const handleDepartmentChange = (e) => {
    const { name, value } = e.target;
    setDepartmentFormData((prev) => ({ ...prev, [name]: value }));
    if (departmentErrors[name]) setDepartmentErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    const newErrors = {};
    const trimmedName = departmentFormData.DepartmentName.trim();
    const trimmedDesc = departmentFormData.Description.trim();

    if (!trimmedName) {
      newErrors.DepartmentName = t('errorInvalidInput');
    } else if (trimmedName.length < 6) {
      newErrors.DepartmentName = t('errorMinLength', { length: 6 });
    }
    if (!trimmedDesc) {
      newErrors.Description = t('errorInvalidInput');
    } else if (trimmedDesc.length < 3) {
      newErrors.Description = t('errorMinLength', { length: 3 });
    }

    if (Object.keys(newErrors).length > 0) {
      setDepartmentErrors(newErrors);
      return;
    }

    const payload = {
      DepartmentName: trimmedName,
      Description: trimmedDesc,
    };

    try {
      console.log('Sending department data:', payload);
      const response = await axiosInstance.post('/api/departments', payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      setDepartments([...departments, response.data.departments]);
      setStats((prev) => ({ ...prev, totalDepartments: prev.totalDepartments + 1 }));
      setDepartmentFormData({ DepartmentName: '', Description: '' });
      toast({
        title: t('departmentAddedSuccess'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error adding department:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      const errorMessage = error.response?.data?.message || t('errorInvalidInput');
      if (errorMessage.toLowerCase().includes('unique')) {
        setDepartmentErrors({ DepartmentName: t('errorDepartmentExists') });
      } else {
        setDepartmentErrors({ DepartmentName: errorMessage });
      }
      toast({
        title: t('errorGeneric'),
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDepartmentSearch = async (e) => {
    e.preventDefault();
    if (!departmentSearchId.trim()) return;
    try {
      const response = await axiosInstance.get(`/api/departments/${departmentSearchId}`);
      setDepartments([response.data.departments].filter(dept => dept && dept._id));
      toast({
        title: t('departmentFound'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setDepartmentSearchId('');
    } catch (error) {
      console.error('Error searching department:', error.response?.data || error.message);
      toast({
        title: t('errorNoData'),
        description: error.response?.data?.message || t('errorInvalidInput'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditDepartment = (dept) => {
    setEditingDept(dept._id);
    setEditDeptForm({ DepartmentName: dept.DepartmentName, Description: dept.Description });
  };

  const handleUpdateDepartment = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(`/api/departments/${editingDept}`, editDeptForm);
      setDepartments(departments.map((d) => (d._id === editingDept ? response.data.departments : d)));
      setEditingDept(null);
      toast({
        title: t('departmentUpdatedSuccess'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating department:', error.response?.data || error.message);
      toast({
        title: t('errorGeneric'),
        description: error.response?.data?.message || t('errorInvalidInput'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteDepartment = async (id) => {
    if (!window.confirm(t('confirmDeleteDepartment'))) return;
    try {
      await axiosInstance.delete(`/api/departments/${id}`);
      setDepartments(departments.filter((d) => d._id !== id));
      setStats((prev) => ({ ...prev, totalDepartments: prev.totalDepartments - 1 }));
      toast({
        title: t('departmentDeletedSuccess'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting department:', error.response?.data || error.message);
      toast({
        title: t('errorGeneric'),
        description: error.response?.data?.message || t('errorInvalidInput'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchEmployeeDetails = async (employeeId) => {
    try {
      const response = await axiosInstance.get(`/api/employees/${employeeId}`);
      setSelectedEmployee(response.data.employee);
    } catch (error) {
      console.error('Error fetching employee details:', error.response?.data || error.message);
      toast({
        title: t('errorGeneric'),
        description: error.response?.data?.message || t('errorNoData'),
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

  // Send Notice Handler
  const handleNoticeSubmit = async (e) => {
    e.preventDefault();
    if (!noticeMessage.trim()) {
      setNoticeErrors({ noticeMessage: t('errorInvalidInput') });
      return;
    }

    try {
      await axiosInstance.post(`${BACKEND_URL}/employees/notice`, { message: noticeMessage });
      setNoticeMessage('');
      setNoticeErrors({});
      toast({
        title: t('noticeSentSuccess'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error sending notice:', error.response?.data || error.message);
      toast({
        title: t('errorGeneric'),
        description: error.response?.data?.message || t('errorInvalidInput'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Animation variants
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
    <Box
      p={{ base: 4, md: 10 }}
      minH="100vh"
      bg={colorMode === 'light' ? 'gray.50' : 'gray.800'}
      color={colorMode === 'light' ? 'gray.800' : 'white'}
    >
      <MotionBox
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Heading
          as="h1"
          size="xl"
          color={currentTheme.primaryColor}
          textAlign="center"
          mb={8}
        >
          {t('employeeManagement')}
        </Heading>
      </MotionBox>

      {/* Navigation Tabs */}
      <Flex
        flexWrap="wrap"
        justify="center"
        mb={8}
        gap={4}
      >
        {['dashboard', 'addEmployee', 'viewEmployees', 'markAttendance', 'manageDepartments', 'sendNotice'].map((section) => (
          <Button
            key={section}
            onClick={() => setActiveSection(section)}
            size={buttonSize}
            variant={activeSection === section ? 'solid' : 'outline'}
            bg={activeSection === section ? currentTheme.primaryColor : 'transparent'}
            color={activeSection === section ? 'white' : currentTheme.primaryColor}
            _hover={{ bg: currentTheme.primaryColor, color: 'white' }}
          >
            {t(section)}
          </Button>
        ))}
      </Flex>

      {/* Dashboard Section */}
      {activeSection === 'dashboard' && (
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          maxW="5xl"
          mx="auto"
        >
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
            <MotionBox
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              bg={colorMode === 'light' ? 'white' : 'gray.700'}
              p={6}
              rounded="2xl"
              shadow="lg"
              borderWidth={1}
              borderColor={colorMode === 'light' ? 'gray.200' : 'gray.600'}
              _hover={{ shadow: 'xl' }}
            >
              <Flex align="center" gap={4}>
                <Icon as={FaUsers} boxSize={10} color={currentTheme.primaryColor} />
                <VStack align="start">
                  <Text fontSize="lg" fontWeight="semibold" color={currentTheme.primaryColor}>{t('totalEmployees')}</Text>
                  <Text fontSize="3xl" fontWeight="bold">{stats.totalEmployees}</Text>
                </VStack>
              </Flex>
            </MotionBox>
            <MotionBox
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              bg={colorMode === 'light' ? 'white' : 'gray.700'}
              p={6}
              rounded="2xl"
              shadow="lg"
              borderWidth={1}
              borderColor={colorMode === 'light' ? 'gray.200' : 'gray.600'}
              _hover={{ shadow: 'xl' }}
            >
              <Flex align="center" gap={4}>
                <Icon as={FaBuilding} boxSize={10} color={currentTheme.primaryColor} />
                <VStack align="start">
                  <Text fontSize="lg" fontWeight="semibold" color={currentTheme.primaryColor}>{t('totalDepartments')}</Text>
                  <Text fontSize="3xl" fontWeight="bold">{stats.totalDepartments}</Text>
                </VStack>
              </Flex>
            </MotionBox>
            <MotionBox
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              bg={colorMode === 'light' ? 'white' : 'gray.700'}
              p={6}
              rounded="2xl"
              shadow="lg"
              borderWidth={1}
              borderColor={colorMode === 'light' ? 'gray.200' : 'gray.600'}
              _hover={{ shadow: 'xl' }}
            >
              <Flex align="center" gap={4}>
                <Icon as={FaCalendarCheck} boxSize={10} color={currentTheme.primaryColor} />
                <VStack align="start">
                  <Text fontSize="lg" fontWeight="semibold" color={currentTheme.primaryColor}>{t('todaysAttendance')}</Text>
                  <Text fontSize="lg">
                    {t('present')}: <Text as="span" fontWeight="bold">{stats.todayAttendance.present}</Text> | {t('absent')}: <Text as="span" fontWeight="bold">{stats.todayAttendance.absent}</Text>
                  </Text>
                </VStack>
              </Flex>
            </MotionBox>
          </SimpleGrid>
        </MotionBox>
      )}

      {/* Add Employee Section */}
      {activeSection === 'addEmployee' && (
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          maxW="lg"
          mx="auto"
          bg={colorMode === 'light' ? 'white' : 'gray.700'}
          p={6}
          rounded="2xl"
          shadow="lg"
          borderWidth={1}
          borderColor={colorMode === 'light' ? 'gray.200' : 'gray.600'}
        >
          <Heading as="h2" size="lg" color={currentTheme.primaryColor} mb={4}>{t('addEmployee')}</Heading>
          <form onSubmit={handleAddEmployee} encType="multipart/form-data">
            <VStack spacing={4}>
              <FormControl isInvalid={employeeErrors.EmployeeName}>
                <FormLabel color={currentTheme.primaryColor}>{t('employeeName')}</FormLabel>
                <Input
                  name="EmployeeName"
                  value={employeeFormData.EmployeeName}
                  onChange={handleEmployeeChange}
                  placeholder={t('employeeName')}
                  size={fontSize}
                />
                <FormErrorMessage>{employeeErrors.EmployeeName}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={employeeErrors.Role}>
                <FormLabel color={currentTheme.primaryColor}>{t('role')}</FormLabel>
                <Input
                  name="Role"
                  value={employeeFormData.Role}
                  onChange={handleEmployeeChange}
                  placeholder={t('role')}
                  size={fontSize}
                />
                <FormErrorMessage>{employeeErrors.Role}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={employeeErrors.Age}>
                <FormLabel color={currentTheme.primaryColor}>{t('age')}</FormLabel>
                <Input
                  type="number"
                  name="Age"
                  value={employeeFormData.Age}
                  onChange={handleEmployeeChange}
                  placeholder={t('age')}
                  size={fontSize}
                />
                <FormErrorMessage>{employeeErrors.Age}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={employeeErrors.Address}>
                <FormLabel color={currentTheme.primaryColor}>{t('address')}</FormLabel>
                <Input
                  name="Address"
                  value={employeeFormData.Address}
                  onChange={handleEmployeeChange}
                  placeholder={t('address')}
                  size={fontSize}
                />
                <FormErrorMessage>{employeeErrors.Address}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={employeeErrors.Phone}>
                <FormLabel color={currentTheme.primaryColor}>{t('phone')}</FormLabel>
                <Input
                  name="Phone"
                  value={employeeFormData.Phone}
                  onChange={handleEmployeeChange}
                  placeholder={t('phone')}
                  size={fontSize}
                />
                <FormErrorMessage>{employeeErrors.Phone}</FormErrorMessage>
              </FormControl>
              <FormControl>
                <FormLabel color={currentTheme.primaryColor}>{t('hireDate')}</FormLabel>
                <Input
                  type="date"
                  name="HireDate"
                  value={employeeFormData.HireDate}
                  onChange={handleEmployeeChange}
                  size={fontSize}
                />
              </FormControl>
              <FormControl isInvalid={employeeErrors.DepartmentId}>
                <FormLabel color={currentTheme.primaryColor}>{t('department')}</FormLabel>
                <Select
                  name="DepartmentId"
                  value={employeeFormData.DepartmentId}
                  onChange={handleEmployeeChange}
                  placeholder={t('selectDepartment')}
                  size={fontSize}
                >
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>{dept.DepartmentName}</option>
                  ))}
                </Select>
                <FormErrorMessage>{employeeErrors.DepartmentId}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={employeeErrors.Email}>
                <FormLabel color={currentTheme.primaryColor}>{t('email')}</FormLabel>
                <Input
                  type="email"
                  name="Email"
                  value={employeeFormData.Email}
                  onChange={handleEmployeeChange}
                  placeholder={t('email')}
                  size={fontSize}
                />
                <FormErrorMessage>{employeeErrors.Email}</FormErrorMessage>
              </FormControl>
              <FormControl>
                <FormLabel color={currentTheme.primaryColor}>{t('profilePicture')}</FormLabel>
                <Input
                  type="file"
                  name="ProfilePicture"
                  accept="image/*"
                  onChange={handleFileChange}
                  size={fontSize}
                  p={1}
                />
              </FormControl>
              <Button
                type="submit"
                size={buttonSize}
                bg={currentTheme.primaryColor}
                color="white"
                _hover={{ bg: 'salon.purpleDark' }}
                w="full"
              >
                {t('addEmployee')}
              </Button>
            </VStack>
          </form>
        </MotionBox>
      )}

      {/* View Employees Section */}
      {activeSection === 'viewEmployees' && (
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          maxW="5xl"
          mx="auto"
        >
          <Heading as="h2" size="lg" color={currentTheme.primaryColor} mb={4}>{t('viewEmployees')}</Heading>
          <form onSubmit={handleEmployeeSearch}>
            <Flex gap={4} mb={6}>
              <Input
                value={employeeSearchTerm}
                onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                placeholder={t('searchEmployee')}
                size={fontSize}
                w={{ base: 'full', md: '64' }}
              />
              <Button
                type="submit"
                size={buttonSize}
                bg={currentTheme.primaryColor}
                color="white"
                _hover={{ bg: 'salon.purpleDark' }}
              >
                {t('search')}
              </Button>
              <Button
                type="button"
                size={buttonSize}
                bg="gray.500"
                color="white"
                _hover={{ bg: 'gray.600' }}
                onClick={async () => {
                  const response = await axiosInstance.get('/api/employees');
                  setEmployees((response.data.employees || []).filter(emp => emp && emp._id && emp.EmployeeName));
                }}
              >
                {t('showAll')}
              </Button>
            </Flex>
          </form>
          {employees.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {employees
                .filter(emp => emp && emp._id && emp.EmployeeName)
                .map((emp) => (
                  <MotionBox
                    key={emp._id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    bg={colorMode === 'light' ? 'white' : 'gray.700'}
                    p={6}
                    rounded="2xl"
                    shadow="lg"
                    borderWidth={1}
                    borderColor={colorMode === 'light' ? 'gray.200' : 'gray.600'}
                    _hover={{ shadow: 'xl' }}
                    position="relative"
                  >
                    {editingEmp === emp._id ? (
                      <form onSubmit={handleUpdateEmployee}>
                        <VStack spacing={4}>
                          <Input
                            name="EmployeeName"
                            value={editEmployeeForm.EmployeeName}
                            onChange={(e) => setEditEmployeeForm({ ...editEmployeeForm, EmployeeName: e.target.value })}
                            placeholder={t('employeeName')}
                            size={fontSize}
                          />
                          <Input
                            name="Role"
                            value={editEmployeeForm.Role}
                            onChange={(e) => setEditEmployeeForm({ ...editEmployeeForm, Role: e.target.value })}
                            placeholder={t('role')}
                            size={fontSize}
                          />
                          <Input
                            type="number"
                            name="Age"
                            value={editEmployeeForm.Age}
                            onChange={(e) => setEditEmployeeForm({ ...editEmployeeForm, Age: e.target.value })}
                            placeholder={t('age')}
                            size={fontSize}
                          />
                          <Input
                            name="Address"
                            value={editEmployeeForm.Address}
                            onChange={(e) => setEditEmployeeForm({ ...editEmployeeForm, Address: e.target.value })}
                            placeholder={t('address')}
                            size={fontSize}
                          />
                          <Input
                            name="Phone"
                            value={editEmployeeForm.Phone}
                            onChange={(e) => setEditEmployeeForm({ ...editEmployeeForm, Phone: e.target.value })}
                            placeholder={t('phone')}
                            size={fontSize}
                          />
                          <Input
                            type="date"
                            name="HireDate"
                            value={editEmployeeForm.HireDate}
                            onChange={(e) => setEditEmployeeForm({ ...editEmployeeForm, HireDate: e.target.value })}
                            size={fontSize}
                          />
                          <Select
                            name="DepartmentId"
                            value={editEmployeeForm.DepartmentId}
                            onChange={(e) => setEditEmployeeForm({ ...editEmployeeForm, DepartmentId: e.target.value })}
                            placeholder={t('selectDepartment')}
                            size={fontSize}
                          >
                            {departments.map((dept) => (
                              <option key={dept._id} value={dept._id}>{dept.DepartmentName}</option>
                            ))}
                          </Select>
                          <Input
                            type="email"
                            name="Email"
                            value={editEmployeeForm.Email}
                            onChange={(e) => setEditEmployeeForm({ ...editEmployeeForm, Email: e.target.value })}
                            placeholder={t('email')}
                            size={fontSize}
                          />
                          <Input
                            type="file"
                            name="ProfilePicture"
                            accept="image/*"
                            onChange={(e) => setEditProfilePicture(e.target.files[0])}
                            size={fontSize}
                            p={1}
                          />
                          <HStack spacing={2}>
                            <Button
                              type="submit"
                              size={buttonSize}
                              bg={currentTheme.primaryColor}
                              color="white"
                              _hover={{ bg: 'salon.purpleDark' }}
                            >
                              {t('save')}
                            </Button>
                            <Button
                              type="button"
                              size={buttonSize}
                              bg="gray.500"
                              color="white"
                              _hover={{ bg: 'gray.600' }}
                              onClick={() => setEditingEmp(null)}
                            >
                              {t('cancel')}
                            </Button>
                          </HStack>
                        </VStack>
                      </form>
                    ) : (
                      <Flex gap={4}>
                        <Box>
                          {emp.ProfilePicture ? (
                            <Image
                              src={`${BACKEND_URL}${emp.ProfilePicture}`}
                              alt={emp.EmployeeName}
                              boxSize="24"
                              objectFit="cover"
                              rounded="full"
                              mb={2}
                            />
                          ) : (
                            <Avatar size="2xl" name={emp.EmployeeName} mb={2} />
                          )}
                        </Box>
                        <VStack align="start" flex={1}>
                          <Heading as="h3" size="md" color={currentTheme.primaryColor}>{emp.EmployeeName}</Heading>
                          <Text fontSize={fontSize}>{t('role')}: {emp.Role}</Text>
                          <Text fontSize={fontSize}>{t('age')}: {emp.Age}</Text>
                          <Text fontSize={fontSize}>{t('address')}: {emp.Address}</Text>
                          <HStack>
                            <Text fontSize={fontSize}>{t('phone')}: {emp.Phone}</Text>
                            {emp.Phone && (
                              <IconButton
                                as="a"
                                href={getWhatsAppLink(emp.Phone)}
                                target="_blank"
                                rel="noopener noreferrer"
                                icon={<FaWhatsapp />}
                                size="sm"
                                colorScheme="green"
                                aria-label="Message on WhatsApp"
                              />
                            )}
                          </HStack>
                          <Text fontSize={fontSize}>{t('hireDate')}: {new Date(emp.HireDate).toLocaleDateString()}</Text>
                          <Text fontSize={fontSize}>{t('department')}: {emp.DepartmentId?.DepartmentName || 'Unknown'}</Text>
                          <Text fontSize={fontSize}>{t('email')}: {emp.Email || 'Not set'}</Text>
                        </VStack>
                        <HStack position="absolute" top={4} right={4}>
                          <IconButton
                            icon={<FaEdit />}
                            colorScheme="purple"
                            variant="ghost"
                            onClick={() => handleEditEmployee(emp)}
                            aria-label="Edit Employee"
                          />
                          <IconButton
                            icon={<FaTrash />}
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => handleDeleteEmployee(emp._id)}
                            aria-label="Delete Employee"
                          />
                        </HStack>
                      </Flex>
                    )}
                  </MotionBox>
                ))}
            </SimpleGrid>
          ) : (
            <Text color="gray.500">{t('errorNoData')}</Text>
          )}
        </MotionBox>
      )}

      {/* Mark Attendance Section */}
      {activeSection === 'markAttendance' && (
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          maxW="5xl"
          mx="auto"
        >
          <Heading as="h2" size="lg" color={currentTheme.primaryColor} mb={4}>{t('markAttendance')}</Heading>
          <FormControl mb={6}>
            <FormLabel color={currentTheme.primaryColor}>{t('selectDate')}</FormLabel>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              size={fontSize}
            />
          </FormControl>
          <form onSubmit={handleMarkAttendance}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={10}>
              {employees
                .filter(emp => emp && emp._id && emp.EmployeeName)
                .map((emp) => (
                  <Box
                    key={emp._id}
                    bg={colorMode === 'light' ? 'white' : 'gray.700'}
                    p={4}
                    rounded="2xl"
                    shadow="lg"
                    borderWidth={1}
                    borderColor={colorMode === 'light' ? 'gray.200' : 'gray.600'}
                  >
                    <Flex justify="space-between" align="center">
                      <HStack spacing={4}>
                        {emp.ProfilePicture ? (
                          <Image
                            src={`${BACKEND_URL}${emp.ProfilePicture}`}
                            alt={emp.EmployeeName}
                            boxSize="12"
                            objectFit="cover"
                            rounded="full"
                          />
                        ) : (
                          <Avatar size="lg" name={emp.EmployeeName} />
                        )}
                        <Text fontSize="lg" fontWeight="semibold" color={currentTheme.primaryColor}>{emp.EmployeeName}</Text>
                      </HStack>
                      <RadioGroup
                        name={`attendance-${emp._id}`}
                        value={attendance[emp._id]}
                        onChange={(value) => handleAttendanceChange(emp._id, value)}
                      >
                        <HStack spacing={4}>
                          <Radio value="Present">{t('present')}</Radio>
                          <Radio value="Absent">{t('absent')}</Radio>
                        </HStack>
                      </RadioGroup>
                    </Flex>
                  </Box>
                ))}
            </SimpleGrid>
            <Button
              type="submit"
              size={buttonSize}
              bg={currentTheme.primaryColor}
              color="white"
              _hover={{ bg: 'salon.purpleDark' }}
              w="full"
            >
              {t('saveAttendance')}
            </Button>
          </form>
          {savedAttendance.length > 0 && (
            <Box mb={10}>
              <Heading as="h3" size="md" color={currentTheme.primaryColor} mb={4}>
                {t('attendanceSummary').replace('{date}', new Date(selectedDate).toLocaleDateString())}
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {employees
                  .filter(emp => emp && emp._id && emp.EmployeeName)
                  .map((emp) => {
                    const status = savedAttendance.find((a) => a.EmployeeId?._id === emp._id)?.Status || 'Not Marked';
                    return (
                      <Box
                        key={emp._id}
                        bg={colorMode === 'light' ? 'white' : 'gray.700'}
                        p={4}
                        rounded="2xl"
                        shadow="lg"
                        borderLeftWidth={4}
                        borderColor={
                          status === 'Present' ? 'green.500' : status === 'Absent' ? 'red.500' : 'gray.300'
                        }
                      >
                        <Flex justify="space-between" align="center">
                          <HStack spacing={4}>
                            {emp.ProfilePicture ? (
                              <Image
                                src={`${BACKEND_URL}${emp.ProfilePicture}`}
                                alt={emp.EmployeeName}
                                boxSize="12"
                                objectFit="cover"
                                rounded="full"
                              />
                            ) : (
                              <Avatar size="lg" name={emp.EmployeeName} />
                            )}
                            <Text fontSize="lg" fontWeight="semibold" color={currentTheme.primaryColor}>{emp.EmployeeName}</Text>
                          </HStack>
                          <Text
                            fontSize="lg"
                            fontWeight="semibold"
                            color={
                              status === 'Present' ? 'green.500' : status === 'Absent' ? 'red.500' : 'gray.500'
                            }
                          >
                            {status}
                          </Text>
                        </Flex>
                      </Box>
                    );
                  })}
              </SimpleGrid>
            </Box>
          )}
          <Heading as="h3" size="md" color={currentTheme.primaryColor} mb={4}>{t('generateReport')}</Heading>
          <form onSubmit={handleGenerateReport}>
            <Flex gap={4} align="center" mb={6}>
              <Input
                type="date"
                value={reportStartDate}
                onChange={(e) => setReportStartDate(e.target.value)}
                size={fontSize}
              />
              <Text color={currentTheme.primaryColor} fontWeight="semibold">to</Text>
              <Input
                type="date"
                value={reportEndDate}
                onChange={(e) => setReportEndDate(e.target.value)}
                size={fontSize}
              />
              <Button
                type="submit"
                size={buttonSize}
                bg={currentTheme.primaryColor}
                color="white"
                _hover={{ bg: 'salon.purpleDark' }}
              >
                {t('generateReport')}
              </Button>
            </Flex>
          </form>
          <Box
            bg={colorMode === 'light' ? 'white' : 'gray.700'}
            p={6}
            rounded="2xl"
            shadow="lg"
            borderWidth={1}
            borderColor={colorMode === 'light' ? 'gray.200' : 'gray.600'}
            onClick={toggleReportView}
            cursor="pointer"
            minH="400px"
            transform={isRotated ? 'rotateY(180deg)' : 'none'}
            transformStyle="preserve-3d"
            transition="transform 0.5s"
          >
            <Box display={isRotated ? 'none' : 'block'}>
              <Flex justify="space-between" align="center" mb={4}>
                <Heading as="h3" size="md" color={currentTheme.primaryColor}>
                  {reportStartDate && reportEndDate ? t('attendanceReport', { start: reportStartDate, end: reportEndDate }) : t('attendanceReportGeneric')}
                </Heading>
                {reportData.length > 0 && (
                  <Button
                    size={buttonSize}
                    bg={currentTheme.primaryColor}
                    color="white"
                    _hover={{ bg: 'salon.purpleDark' }}
                    leftIcon={<FaDownload />}
                    onClick={(e) => { e.stopPropagation(); downloadCSV(); }}
                  >
                    {t('downloadCSV')}
                  </Button>
                )}
              </Flex>
              {reportData.length > 0 ? (
                <Table variant="simple">
                  <Thead>
                    <Tr bg={currentTheme.primaryColor}>
                      <Th color="white" roundedTopLeft="md">{t('employeeName')}</Th>
                      <Th color="white">{t('date')}</Th>
                      <Th color="white" roundedTopRight="md">{t('status')}</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {reportData.map((record) => (
                      <Tr
                        key={record._id}
                        _hover={{ bg: 'salon.purpleLight', bgOpacity: 0.1 }}
                        bg={record.Status === 'Present' ? 'green.50' : 'red.50'}
                      >
                        <Td fontWeight="medium" color={currentTheme.primaryColor}>{record.EmployeeId.EmployeeName}</Td>
                        <Td>{new Date(record.attendanceDate).toLocaleDateString()}</Td>
                        <Td>
                          <Text
                            as="span"
                            px={3}
                            py={1}
                            rounded="full"
                            fontSize="sm"
                            fontWeight="semibold"
                            bg={record.Status === 'Present' ? 'green.200' : 'red.200'}
                            color={record.Status === 'Present' ? 'green.800' : 'red.800'}
                          >
                            {record.Status}
                          </Text>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              ) : (
                <Text color="gray.500" textAlign="center" py={4}>{t('errorNoData')}</Text>
              )}
            </Box>
            <Box
              display={isRotated ? 'block' : 'none'}
              transform="rotateY(180deg)"
              h="full"
              w="full"
            >
              {reportData.length > 0 ? (
                <Bar data={chartData} options={chartOptions} />
              ) : (
                <Text color="gray.500" textAlign="center" py={4}>{t('errorNoData')}</Text>
              )}
            </Box>
          </Box>
        </MotionBox>
      )}

      {/* Manage Departments Section */}
      {activeSection === 'manageDepartments' && (
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          maxW="5xl"
          mx="auto"
        >
          <Heading as="h2" size="lg" color={currentTheme.primaryColor} mb={4}>{t('manageDepartments')}</Heading>
          <Box mb={8}>
            <Heading as="h3" size="md" color={currentTheme.primaryColor} mb={4}>{t('addDepartment')}</Heading>
            <Box
              maxW="lg"
              bg={colorMode === 'light' ? 'white' : 'gray.700'}
              p={6}
              rounded="2xl"
              shadow="lg"
              borderWidth={1}
              borderColor={colorMode === 'light' ? 'gray.200' : 'gray.600'}
            >
              <form onSubmit={handleAddDepartment}>
                <VStack spacing={6}>
                  <FormControl isInvalid={departmentErrors.DepartmentName}>
                    <FormLabel color={currentTheme.primaryColor}>{t('departmentName')}</FormLabel>
                    <Input
                      name="DepartmentName"
                      value={departmentFormData.DepartmentName}
                      onChange={handleDepartmentChange}
                      placeholder={t('departmentName')}
                      size={fontSize}
                    />
                    <FormErrorMessage>{departmentErrors.DepartmentName}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={departmentErrors.Description}>
                    <FormLabel color={currentTheme.primaryColor}>{t('description')}</FormLabel>
                    <Textarea
                      name="Description"
                      value={departmentFormData.Description}
                      onChange={handleDepartmentChange}
                      placeholder={t('description')}
                      size={fontSize}
                      rows={4}
                    />
                    <FormErrorMessage>{departmentErrors.Description}</FormErrorMessage>
                  </FormControl>
                  <Button
                    type="submit"
                    size={buttonSize}
                    bg={currentTheme.primaryColor}
                    color="white"
                    _hover={{ bg: 'salon.purpleDark' }}
                    w="full"
                  >
                    {t('addDepartment')}
                  </Button>
                </VStack>
              </form>
            </Box>
          </Box>
          <form onSubmit={handleDepartmentSearch}>
            <Flex gap={4} justify="center" mb={8}>
              <Input
                value={departmentSearchId}
                onChange={(e) => setDepartmentSearchId(e.target.value)}
                placeholder={t('searchDepartment')}
                size={fontSize}
                w={{ base: 'full', md: '64' }}
              />
              <Button
                type="submit"
                size={buttonSize}
                bg={currentTheme.primaryColor}
                color="white"
                _hover={{ bg: 'salon.purpleDark' }}
              >
                {t('search')}
              </Button>
              <Button
                type="button"
                size={buttonSize}
                bg="gray.500"
                color="white"
                _hover={{ bg: 'gray.600' }}
                onClick={async () => {
                  const response = await axiosInstance.get('/api/departments');
                  setDepartments((response.data.departments || []).filter(dept => dept && dept._id));
                }}
              >
                {t('showAll')}
              </Button>
            </Flex>
          </form>
          <AnimatePresence>
            {departments.length > 0 ? (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {departments.map((dept) => (
                  <MotionBox
                    key={dept._id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    bg={colorMode === 'light' ? 'white' : 'gray.700'}
                    p={6}
                    rounded="2xl"
                    shadow="lg"
                    borderWidth={1}
                    borderColor={colorMode === 'light' ? 'gray.200' : 'gray.600'}
                    _hover={{ shadow: 'xl', transform: 'translateY(-2px)' }}
                    position="relative"
                  >
                    {editingDept === dept._id ? (
                      <MotionBox
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <form onSubmit={handleUpdateDepartment}>
                          <VStack spacing={4}>
                            <Input
                              value={editDeptForm.DepartmentName}
                              onChange={(e) => setEditDeptForm({ ...editDeptForm, DepartmentName: e.target.value })}
                              placeholder={t('departmentName')}
                              size={fontSize}
                            />
                            <Textarea
                              value={editDeptForm.Description}
                              onChange={(e) => setEditDeptForm({ ...editDeptForm, Description: e.target.value })}
                              placeholder={t('description')}
                              size={fontSize}
                              rows={3}
                            />
                            <HStack spacing={2}>
                              <Button
                                type="submit"
                                size={buttonSize}
                                bg={currentTheme.primaryColor}
                                color="white"
                                _hover={{ bg: 'salon.purpleDark' }}
                              >
                                {t('save')}
                              </Button>
                              <Button
                                type="button"
                                size={buttonSize}
                                bg="gray.500"
                                color="white"
                                _hover={{ bg: 'gray.600' }}
                                onClick={() => setEditingDept(null)}
                              >
                                {t('cancel')}
                              </Button>
                            </HStack>
                          </VStack>
                        </form>
                      </MotionBox>
                    ) : (
                      <>
                        <Heading as="h3" size="md" color={currentTheme.primaryColor} mb={3}>{dept.DepartmentName}</Heading>
                        <Text mb={2}>{dept.Description}</Text>
                        <Text>{t('totalEmployees')}: <Text as="span" fontWeight="semibold" color={currentTheme.primaryColor}>{dept.EmployeeCount}</Text></Text>
                        <Box mt={4}>
                          <Text mb={2}>{t('workers')}:</Text>
                          <Flex flexWrap="wrap" gap={3}>
                            {dept.employees.length > 0 ? (
                              dept.employees.map((emp) => (
                                <MotionBox
                                  key={emp._id}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleEmployeeClick(emp._id)}
                                  cursor="pointer"
                                >
                                  {emp.ProfilePicture ? (
                                    <Image
                                      src={`${BACKEND_URL}${emp.ProfilePicture}`}
                                      alt="Employee"
                                      boxSize="12"
                                      objectFit="cover"
                                      rounded="full"
                                      borderWidth={2}
                                      borderColor="salon.purpleLight"
                                      shadow="md"
                                      _hover={{ shadow: 'lg' }}
                                    />
                                  ) : (
                                    <Avatar
                                      size="lg"
                                      name={emp.EmployeeName}
                                      borderWidth={2}
                                      borderColor="salon.purpleLight"
                                      shadow="md"
                                      _hover={{ shadow: 'lg' }}
                                    />
                                  )}
                                </MotionBox>
                              ))
                            ) : (
                              <Text>{t('none')}</Text>
                            )}
                          </Flex>
                        </Box>
                        <HStack position="absolute" top={4} right={4}>
                          <IconButton
                            icon={<FaEdit />}
                            colorScheme="purple"
                            variant="ghost"
                            onClick={() => handleEditDepartment(dept)}
                            aria-label="Edit Department"
                            _hover={{ transform: 'scale(1.1) rotate(10deg)' }}
                          />
                          <IconButton
                            icon={<FaTrash />}
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => handleDeleteDepartment(dept._id)}
                            aria-label="Delete Department"
                            _hover={{ transform: 'scale(1.1) rotate(-10deg)' }}
                          />
                        </HStack>
                      </>
                    )}
                  </MotionBox>
                ))}
              </SimpleGrid>
            ) : (
              <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Text color="gray.500" textAlign="center">{t('errorNoData')}</Text>
              </MotionBox>
            )}
          </AnimatePresence>
          {/* Employee Details Modal */}
          <AnimatePresence>
            {selectedEmployee && (
              <Modal isOpen={!!selectedEmployee} onClose={closeModal}>
                <ModalOverlay />
                <MotionBox
                  variants={modalVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <ModalContent
                    bg={colorMode === 'light' ? 'white' : 'gray.800'}
                    borderWidth={1}
                    borderColor={colorMode === 'light' ? 'gray.200' : 'gray.600'}
                    rounded="2xl"
                    shadow="xl"
                    maxW="md"
                    mx="auto"
                  >
                    <ModalHeader color={currentTheme.primaryColor}>{selectedEmployee.EmployeeName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                      <VStack spacing={4} align="center">
                        {selectedEmployee.ProfilePicture ? (
                          <Image
                            src={`${BACKEND_URL}${selectedEmployee.ProfilePicture}`}
                            alt={selectedEmployee.EmployeeName}
                            boxSize="24"
                            objectFit="cover"
                            rounded="full"
                            borderWidth={4}
                            borderColor="salon.purpleLight"
                            shadow="lg"
                          />
                        ) : (
                          <Avatar
                            size="2xl"
                            name={selectedEmployee.EmployeeName}
                            borderWidth={4}
                            borderColor="salon.purpleLight"
                            shadow="lg"
                          />
                        )}
                        <Text><Text as="span" fontWeight="semibold">{t('role')}:</Text> {selectedEmployee.Role}</Text>
                        <Text><Text as="span" fontWeight="semibold">{t('age')}:</Text> {selectedEmployee.Age}</Text>
                        <Text><Text as="span" fontWeight="semibold">{t('address')}:</Text> {selectedEmployee.Address}</Text>
                        <Text><Text as="span" fontWeight="semibold">{t('phone')}:</Text> {selectedEmployee.Phone}</Text>
                        <Text><Text as="span" fontWeight="semibold">{t('hireDate')}:</Text> {new Date(selectedEmployee.HireDate).toLocaleDateString()}</Text>
                        <Text><Text as="span" fontWeight="semibold">{t('department')}:</Text> {selectedEmployee.DepartmentId?.DepartmentName || 'Unknown'}</Text>
                        <Text><Text as="span" fontWeight="semibold">{t('email')}:</Text> {selectedEmployee.Email}</Text>
                      </VStack>
                    </ModalBody>
                  </ModalContent>
                </MotionBox>
              </Modal>
            )}
          </AnimatePresence>
        </MotionBox>
      )}

      {/* Send Notice Section */}
      {activeSection === 'sendNotice' && (
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          maxW="lg"
          mx="auto"
          bg={colorMode === 'light' ? 'white' : 'gray.700'}
          p={6}
          rounded="2xl"
          shadow="lg"
          borderWidth={1}
          borderColor={colorMode === 'light' ? 'gray.200' : 'gray.600'}
        >
          <Heading as="h2" size="lg" color={currentTheme.primaryColor} mb={4}>{t('sendNotice')}</Heading>
          <form onSubmit={handleNoticeSubmit}>
            <FormControl isInvalid={noticeErrors.noticeMessage} mb={6}>
              <FormLabel color={currentTheme.primaryColor}>{t('noticeMessage')}</FormLabel>
              <Textarea
                name="noticeMessage"
                value={noticeMessage}
                onChange={(e) => {
                  setNoticeMessage(e.target.value);
                  if (noticeErrors.noticeMessage) setNoticeErrors({});
                }}
                placeholder={t('noticeMessage')}
                size={fontSize}
                rows={4}
              />
              <FormErrorMessage>{noticeErrors.noticeMessage}</FormErrorMessage>
            </FormControl>
            <Button
              type="submit"
              size={buttonSize}
              bg={currentTheme.primaryColor}
              color="white"
              _hover={{ bg: 'salon.purpleDark' }}
              w="full"
              leftIcon={<FaEnvelope />}
            >
              {t('sendNotice')}
            </Button>
          </form>
        </MotionBox>
      )}
    </Box>
  );
}

// Cleanup Invalid Attendance (Run manually in a Node.js environment with mongoose connected)
// const cleanupInvalidAttendance = async () => {
//   try {
//     const validEmployeeIds = await employeeModel.distinct('_id');
//     const invalidAttendance = await attendanceModel.find().where('EmployeeId').nin(validEmployeeIds);
//     for (const record of invalidAttendance) {
//       await attendanceModel.findByIdAndDelete(record._id);
//       console.log(`Deleted invalid attendance record: ${record._id}`);
//     }
//     console.log('Cleanup completed. Invalid attendance records removed.');
//   } catch (err) {
//     console.error('Error during cleanup:', err);
//   } finally {
//     mongoose.connection.close();
//   }
// };
// cleanupInvalidAttendance();

export default EmployeeManagement;