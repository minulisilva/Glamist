import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  Button,
  useColorMode,
  IconButton,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import {
  FaMoneyBill,
  FaBox,
  FaUserTie,
  FaBook,
  FaCalendar,
  FaBars,
  FaEnvelope,
} from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from './ThemeContext';

const OwnerDashboard = () => {
  const { colorMode } = useColorMode();
  const { currentTheme } = useTheme();
  const { isOpen: isMobileMenuOpen, onToggle: toggleMobileMenu } = useDisclosure({ defaultIsOpen: true });
  const [activeSection, setActiveSection] = useState('salaries');
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/user/data', {
          withCredentials: true,
        });
        setUserRole(response.data.success ? response.data.userData.role : null);
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserRole();
  }, []);

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  if (isLoading) {
    return <Box>Loading...</Box>;
  }

  return (
    <Flex
      minH="100vh"
      bg={colorMode === 'light' ? 'gray.100' : 'gray.900'}
      direction="column"
      p={{ base: 4, md: 6 }}
    >
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" fontFamily="'Playfair Display', serif" color={colorMode === 'light' ? 'gray.800' : 'white'}>
          Owner Dashboard
        </Heading>
        <IconButton
          icon={<FaBars />}
          variant="ghost"
          color={colorMode === 'light' ? 'gray.800' : 'white'}
          display={{ base: 'block', md: 'none' }}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        />
      </Flex>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        wrap="wrap"
        gap={4}
        justify="center"
        align="center"
        flex={1}
        display={{ base: isMobileMenuOpen ? 'flex' : 'none', md: 'flex' }}
      >
        <Tooltip label="Manage staff salaries" placement="top">
          <Button
            as={NavLink}
            to="/salary-management"
            leftIcon={<FaMoneyBill />}
            variant={activeSection === 'salaries' ? 'solid' : 'outline'}
            colorScheme={activeSection === 'salaries' ? 'purple' : 'whiteAlpha'}
            bg={activeSection === 'salaries' ? 'purple.500' : 'transparent'}
            color={activeSection === 'salaries' ? 'white' : colorMode === 'light' ? 'gray.800' : 'white'}
            _hover={{ bg: 'purple.600', transform: 'scale(1.05)' }}
            transition="all 0.2s ease"
            onClick={() => handleSectionClick('salaries')}
            size="lg"
            flex={{ base: '1 1 100%', md: '1 1 200px' }}
            maxW="300px"
          >
            Salaries
          </Button>
        </Tooltip>
        <Tooltip label="Manage inventory items" placement="top">
          <Button
            as={NavLink}
            to="/inventory"
            leftIcon={<FaBox />}
            variant={activeSection === 'inventory' ? 'solid' : 'outline'}
            colorScheme={activeSection === 'inventory' ? 'purple' : 'whiteAlpha'}
            bg={activeSection === 'inventory' ? 'purple.500' : 'transparent'}
            color={activeSection === 'inventory' ? 'white' : colorMode === 'light' ? 'gray.800' : 'white'}
            _hover={{ bg: 'purple.600', transform: 'scale(1.05)' }}
            transition="all 0.2s ease"
            onClick={() => handleSectionClick('inventory')}
            size="lg"
            flex={{ base: '1 1 100%', md: '1 1 200px' }}
            maxW="300px"
          >
            Inventory
          </Button>
        </Tooltip>
        <Tooltip label="Manage staff details" placement="top">
          <Button
            as={NavLink}
            to="/employee-management"
            leftIcon={<FaUserTie />}
            variant={activeSection === 'staff' ? 'solid' : 'outline'}
            colorScheme={activeSection === 'staff' ? 'purple' : 'whiteAlpha'}
            bg={activeSection === 'staff' ? 'purple.500' : 'transparent'}
            color={activeSection === 'staff' ? 'white' : colorMode === 'light' ? 'gray.800' : 'white'}
            _hover={{ bg: 'purple.600', transform: 'scale(1.05)' }}
            transition="all 0.2s ease"
            onClick={() => handleSectionClick('staff')}
            size="lg"
            flex={{ base: '1 1 100%', md: '1 1 200px' }}
            maxW="300px"
          >
            Staff
          </Button>
        </Tooltip>
        <Tooltip label="View and edit lookbook" placement="top">
          <Button
            as={NavLink}
            to="/our-work"
            leftIcon={<FaBook />}
            variant={activeSection === 'lookbook' ? 'solid' : 'outline'}
            colorScheme={activeSection === 'lookbook' ? 'purple' : 'whiteAlpha'}
            bg={activeSection === 'lookbook' ? 'purple.500' : 'transparent'}
            color={activeSection === 'lookbook' ? 'white' : colorMode === 'light' ? 'gray.800' : 'white'}
            _hover={{ bg: 'purple.600', transform: 'scale(1.05)' }}
            transition="all 0.2s ease"
            onClick={() => handleSectionClick('lookbook')}
            size="lg"
            flex={{ base: '1 1 100%', md: '1 1 200px' }}
            maxW="300px"
          >
            Lookbook
          </Button>
        </Tooltip>
        {userRole === 'admin' && (
          <Tooltip label="View received messages" placement="top">
            <Button
              as={NavLink}
              to="/messages"
              leftIcon={<FaEnvelope />}
              variant={activeSection === 'messages' ? 'solid' : 'outline'}
              colorScheme={activeSection === 'messages' ? 'purple' : 'whiteAlpha'}
              bg={activeSection === 'messages' ? 'purple.500' : 'transparent'}
              color={activeSection === 'messages' ? 'white' : colorMode === 'light' ? 'gray.800' : 'white'}
              _hover={{ bg: 'purple.600', transform: 'scale(1.05)' }}
              transition="all 0.2s ease"
              onClick={() => handleSectionClick('messages')}
              size="lg"
              flex={{ base: '1 1 100%', md: '1 1 200px' }}
              maxW="300px"
            >
              Messages
            </Button>
          </Tooltip>
        )}
        <Tooltip label="Manage appointments" placement="top">
          <Button
            as={NavLink}
            to="/admin/appointments"
            leftIcon={<FaCalendar />}
            variant={activeSection === 'appointment' ? 'solid' : 'outline'}
            colorScheme={activeSection === 'appointment' ? 'purple' : 'whiteAlpha'}
            bg={activeSection === 'appointment' ? 'purple.500' : 'transparent'}
            color={activeSection === 'appointment' ? 'white' : colorMode === 'light' ? 'gray.800' : 'white'}
            _hover={{ bg: 'purple.600', transform: 'scale(1.05)' }}
            transition="all 0.2s ease"
            onClick={() => handleSectionClick('appointment')}
            size="lg"
            flex={{ base: '1 1 100%', md: '1 1 200px' }}
            maxW="300px"
          >
            Appointment
          </Button>
        </Tooltip>
        <Button
          as={NavLink}
          to="/home"
          variant="outline"
          colorScheme="whiteAlpha"
          color={colorMode === 'light' ? 'gray.800' : 'white'}
          _hover={{ bg: 'purple.600', color: 'white', transform: 'scale(1.05)' }}
          transition="all 0.2s ease"
          size="lg"
          flex={{ base: '1 1 100%', md: '1 1 200px' }}
          maxW="300px"
        >
          Back to Home
        </Button>
      </Flex>
    </Flex>
  );
};

export default OwnerDashboard;