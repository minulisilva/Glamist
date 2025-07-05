import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  VStack,
  Button, // Added Button to imports
  useColorMode,
  useToast,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from './ThemeContext';
import Papa from 'papaparse'; // Import papaparse for CSV generation

const MotionBox = motion(Box);

const Messages = () => {
  const { colorMode } = useColorMode();
  const { currentTheme } = useTheme();
  const toast = useToast();
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([]);

  // Fetch user role
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

  // Fetch messages if user is admin
  useEffect(() => {
    const fetchMessages = async () => {
      if (userRole === 'admin') {
        try {
          const response = await axios.get('http://localhost:4000/api/contact/messages', {
            withCredentials: true,
          });
          if (response.data.success) {
            setMessages(response.data.data);
          } else {
            toast({
              title: 'Error',
              description: 'Failed to fetch messages.',
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
          }
        } catch (error) {
          console.error('Error fetching messages:', error);
          toast({
            title: 'Network Error',
            description: 'Unable to fetch messages. Please check your connection.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      }
    };
    if (!isLoading && userRole === 'admin') {
      fetchMessages();
    }
  }, [userRole, isLoading, toast]);

  // Function to handle CSV download
  const handleDownloadCSV = () => {
    if (messages.length === 0) {
      toast({
        title: 'No Data',
        description: 'There are no messages to download.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Prepare data for CSV
    const csvData = messages.map((msg) => ({
      Name: msg.name,
      Email: msg.email,
      Phone: msg.phone,
      Message: msg.message,
      Received: new Date(msg.createdAt).toLocaleString(),
    }));

    // Convert to CSV using PapaParse
    const csv = Papa.unparse(csvData);

    // Create a downloadable link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `messages_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <Box>Loading...</Box>;
  }

  // Redirect non-admin users to home
  if (userRole !== 'admin') {
    toast({
      title: 'Access Denied',
      description: 'You do not have permission to view this page.',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
    return <Navigate to="/home" replace />;
  }

  return (
    <Box
      minH="100vh"
      bg={colorMode === 'light' ? currentTheme.sectionBg : 'gray.900'}
      py={{ base: 10, md: 14 }}
      position="relative"
      overflow="hidden"
    >
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      >
        <Container maxW="container.xl">
          <VStack spacing={6} align="stretch">
            <Heading
              as="h1"
              size="2xl"
              fontFamily="'Playfair Display', serif"
              color={colorMode === 'light' ? currentTheme.primaryColor : currentTheme.secondaryColor}
              textAlign="center"
            >
              Received Messages
            </Heading>
            {/* Download CSV Button */}
            <Button
              colorScheme="purple"
              alignSelf="flex-end"
              onClick={handleDownloadCSV}
              isDisabled={messages.length === 0}
            >
              Download CSV
            </Button>
            {messages.length === 0 ? (
              <Text
                fontSize="md"
                color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
                fontFamily="'Montserrat', sans-serif"
                textAlign="center"
              >
                No messages received yet.
              </Text>
            ) : (
              <TableContainer
                bg={colorMode === 'light' ? 'white' : 'gray.700'}
                borderRadius="lg"
                boxShadow="md"
                p={4}
              >
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Email</Th>
                      <Th>Phone</Th>
                      <Th>Message</Th>
                      <Th>Received</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {messages.map((msg) => (
                      <Tr key={msg._id}>
                        <Td>{msg.name}</Td>
                        <Td>{msg.email}</Td>
                        <Td>{msg.phone}</Td>
                        <Td maxW="300px" isTruncated>
                          {msg.message}
                        </Td>
                        <Td>{new Date(msg.createdAt).toLocaleString()}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
          </VStack>
        </Container>
      </MotionBox>
    </Box>
  );
};

export default Messages;