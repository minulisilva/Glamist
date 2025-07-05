import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  useToast,
  Input,
  FormControl,
  FormLabel,
  InputGroup,
  useColorMode,
  Icon, // Added for MotionIcon
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';
import { useTheme } from './ThemeContext';

const MotionBox = motion(Box);
const MotionIcon = motion(Icon); // Exact match with ContactUs

// Animation Variants (copied exactly from ContactUs)
const heartVariants = {
  animate: {
    scale: [1, 1.5, 1],
    opacity: [1, 1, 0],
    y: [0, -100, -200],
    transition: { duration: 2, repeat: Infinity, repeatDelay: 0.5 },
  },
};

const fireworkVariants = {
  animate: {
    scale: [0, 2, 0],
    opacity: [0, 1, 0],
    borderRadius: ['50%', '50%', '0%'],
    transition: { duration: 1.5, repeat: Infinity, repeatDelay: Math.random() * 3 },
  },
};

const pumpkinVariants = {
  animate: {
    y: [0, -40, 0],
    rotate: [-10, 10, -10],
    opacity: [0.7, 1, 0.7],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut', repeatDelay: Math.random() * 2 },
  },
};

const snowflakeVariants = {
  animate: {
    y: [0, 200],
    opacity: [1, 0],
    transition: { duration: 4, repeat: Infinity, repeatDelay: 0.5 },
  },
};

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [otp, setOtp] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const { themeKey, currentTheme, currentBackgroundImages } = useTheme();
  const currentBackgroundImage = currentBackgroundImages[0];

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/user/data', {
          withCredentials: true,
        });
        if (response.data.success) {
          setUserData(response.data.userData);
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to fetch user data',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [navigate, toast]);

  // Send OTP for email verification
  const handleSendOtp = async () => {
    setIsSendingOtp(true);
    try {
      const response = await axios.post(
        'http://localhost:4000/api/auth/send-verify-otp',
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        toast({
          title: 'OTP Sent',
          description: 'Check your email for the verification OTP',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to send OTP',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      toast({
        title: 'Error',
        description: 'Please enter the OTP',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsVerifying(true);
    try {
      const response = await axios.post(
        'http://localhost:4000/api/auth/verify-account',
        { otp },
        { withCredentials: true }
      );
      if (response.data.success) {
        setUserData((prev) => ({ ...prev, isAccVerify: true }));
        toast({
          title: 'Email Verified',
          description: 'Your email has been successfully verified',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setOtp(''); // Clear OTP input
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to verify OTP',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  if (isLoading) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg={colorMode === 'light' ? currentTheme.sectionBg : 'gray.900'}
      >
        <Text
          fontFamily="'Montserrat', sans-serif"
          color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
        >
          Loading...
        </Text>
      </Box>
    );
  }

  if (!userData) {
    return null; // Redirect will handle this
  }

  return (
    <Box
      minH="100vh"
      bg={colorMode === 'light' ? currentTheme.sectionBg : 'gray.900'}
      py={{ base: 10, md: 14 }}
      position="relative"
      overflow="hidden"
    >
      {/* Holiday Animations - Exact Copy from ContactUs */}
      {themeKey === 'valentines' && (
        Array.from({ length: 10 }).map((_, i) => (
          <MotionIcon
            key={i}
            as={FaHeart}
            color="red.500" // Exact match with ContactUs
            boxSize={6}
            position="absolute"
            top={`${Math.random() * 50}%`}
            left={`${Math.random() * 100}%`}
            variants={heartVariants}
            animate="animate"
            zIndex={1}
          />
        ))
      )}
      {themeKey === 'newYear' && (
        Array.from({ length: 10 }).map((_, i) => (
          <MotionBox
            key={i}
            w="30px"
            h="30px"
            bg="gold.400" // Exact match with ContactUs
            position="absolute"
            top={`${Math.random() * 80}%`}
            left={`${Math.random() * 100}%`}
            variants={fireworkVariants}
            animate="animate"
            zIndex={10}
            boxShadow="0 0 15px rgba(255, 215, 0, 0.8)"
          />
        ))
      )}
      {themeKey === 'halloween' && (
        Array.from({ length: 6 }).map((_, i) => (
          <MotionBox
            key={i}
            w="50px"
            h="50px"
            bg="orange.500" // Exact match with ContactUs
            borderRadius="full"
            position="absolute"
            top={`${Math.random() * 70}%`}
            left={`${Math.random() * 100}%`}
            variants={pumpkinVariants}
            animate="animate"
            zIndex={1}
            boxShadow="0 0 10px rgba(255, 165, 0, 0.6)"
          >
            <Box position="absolute" top="15px" left="15px" w="10px" h="10px" bg="black" borderRadius="full" />
            <Box position="absolute" top="15px" right="15px" w="10px" h="10px" bg="black" borderRadius="full" />
            <Box
              position="absolute"
              bottom="15px"
              left="50%"
              transform="translateX(-50%)"
              w="20px"
              h="15px"
              bg="black"
              borderRadius="0 0 50% 50%"
            />
            <Box
              position="absolute"
              top="-10px"
              left="50%"
              transform="translateX(-50%)"
              w="10px"
              h="15px"
              bg="green.700"
              borderRadius="50% 50% 0 0"
            />
          </MotionBox>
        ))
      )}
      {themeKey === 'christmas' && (
        Array.from({ length: 15 }).map((_, i) => (
          <MotionBox
            key={i}
            w="8px"
            h="8px"
            bg="white" // Exact match with ContactUs
            borderRadius="full"
            position="absolute"
            top={`${Math.random() * 50}%`}
            left={`${Math.random() * 100}%`}
            variants={snowflakeVariants}
            animate="animate"
            zIndex={1}
          />
        ))
      )}

      {/* Hero Section */}
      <MotionBox
        bgImage={`url(${currentBackgroundImage})`}
        bgSize="cover"
        bgPosition="center"
        minH="40vh"
        position="relative"
        display="flex"
        alignItems="center"
        justifyContent="center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgGradient={currentTheme.bgGradient}
          opacity={0.7}
        />
        <Container maxW="container.lg" zIndex={2}>
          <VStack spacing={4} align="center" color="white" h="full" justify="center">
            <Heading
              as="h1"
              size="2xl"
              fontFamily="'Playfair Display', serif"
              textShadow="2px 2px 8px rgba(0, 0, 0, 0.3)"
            >
              Your Profile
            </Heading>
            <Text
              fontSize="xl"
              fontFamily="'Montserrat', sans-serif"
              textShadow="1px 1px 4px rgba(0, 0, 0, 0.2)"
              maxW="2xl"
              textAlign="center"
            >
              Manage your account details and verify your email
            </Text>
          </VStack>
        </Container>
      </MotionBox>

      {/* Profile Content */}
      <Box maxW="container.md" mx="auto" py={{ base: 10, md: 14 }}>
        <MotionBox
          bg={colorMode === 'light' ? 'white' : 'gray.700'}
          p={8}
          borderRadius="lg"
          boxShadow="md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <VStack spacing={6} align="stretch">
            <Heading
              as="h2"
              size="lg"
              fontFamily="'Playfair Display', serif"
              color={colorMode === 'light' ? currentTheme.primaryColor : currentTheme.secondaryColor}
            >
              Account Details
            </Heading>
            <Text
              fontFamily="'Montserrat', sans-serif"
              color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
            >
              <strong>Name:</strong> {userData.name}
            </Text>
            <Text
              fontFamily="'Montserrat', sans-serif"
              color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
            >
              <strong>Email:</strong> {userData.email}
            </Text>
            <Text
              fontFamily="'Montserrat', sans-serif"
              color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
            >
              <strong>Role:</strong> {userData.role}
            </Text>
            <Text
              fontFamily="'Montserrat', sans-serif"
              color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
            >
              <strong>Account Verified:</strong> {userData.isAccVerify ? 'Yes' : 'No'}
            </Text>

            {/* Email Verification Section */}
            {!userData.isAccVerify && (
              <VStack spacing={4} align="stretch">
                <Button
                  colorScheme={currentTheme.primaryColor.split('.')[0]}
                  onClick={handleSendOtp}
                  isLoading={isSendingOtp}
                  loadingText="Sending OTP..."
                  _hover={{ bg: `${currentTheme.primaryColor.split('.')[0]}.600` }}
                  fontFamily="'Montserrat', sans-serif"
                >
                  Send Verification OTP
                </Button>
                <FormControl>
                  <FormLabel
                    fontFamily="'Montserrat', sans-serif"
                    color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
                  >
                    Enter OTP
                  </FormLabel>
                  <InputGroup>
                    <Input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                      disabled={isVerifying}
                      bg={colorMode === 'light' ? 'gray.100' : 'gray.600'}
                      border="none"
                      _focus={{
                        borderColor: currentTheme.primaryColor,
                        boxShadow: `0 0 0 1px ${currentTheme.primaryColor}`,
                      }}
                    />
                  </InputGroup>
                </FormControl>
                <Button
                  colorScheme={currentTheme.primaryColor.split('.')[0]}
                  onClick={handleVerifyOtp}
                  isLoading={isVerifying}
                  loadingText="Verifying..."
                  _hover={{ bg: `${currentTheme.primaryColor.split('.')[0]}.600` }}
                  fontFamily="'Montserrat', sans-serif"
                >
                  Verify Email
                </Button>
              </VStack>
            )}

            <Button
              colorScheme={currentTheme.primaryColor.split('.')[0]}
              onClick={() => navigate('/home')}
              _hover={{ bg: `${currentTheme.primaryColor.split('.')[0]}.600` }}
              fontFamily="'Montserrat', sans-serif"
            >
              Back to Home
            </Button>
          </VStack>
        </MotionBox>
      </Box>
    </Box>
  );
};

export default Profile;