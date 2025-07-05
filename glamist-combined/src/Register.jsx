import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Text,
  Link,
  Checkbox,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { EmailIcon, LockIcon, InfoIcon } from '@chakra-ui/icons';

const Register = ({ setIsLoggedIn, setUserData }) => { // Added setUserData prop
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [showAdminCode, setShowAdminCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  // Password validation function
  const isPasswordStrong = (pwd) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasLowerCase = /[a-z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);

    return (
      pwd.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar
    );
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'The passwords do not match. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Check for strong password
    if (!isPasswordStrong(password)) {
      toast({
        title: 'Weak Password',
        description:
          'Password must be at least 8 characters long and include an uppercase letter, lowercase letter, number, and special character (e.g., !@#$%).',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const requestData = { name, email, password };
      if (showAdminCode) requestData.adminCode = adminCode;

      const signupUrl =
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:4000/api/auth/register'
          : '/api/auth/register';
      console.log('Attempting signup at URL:', signupUrl);
      console.log('Signup Request Data:', requestData);

      const response = await axios.post(signupUrl, requestData, { withCredentials: true });
      console.log('Signup Response:', response.data);

      if (response.data.success) {
        setIsLoggedIn(true);
        // Set user data to reflect role in app.jsx
        setUserData({ role: response.data.role || (response.data.isAdmin ? 'admin' : 'customer') });
        const isAdmin = response.data.isAdmin || response.data.role === 'admin';
        toast({
          title: 'Registration Successful',
          description: isAdmin ? 'Registered as Admin' : 'Registered as Customer',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        if (isAdmin) {
          console.log('Redirecting to OwnerDashboard as Admin');
          navigate('/owner-dashboard');
        } else {
          console.log('Redirecting to Home as Customer');
          navigate('/');
        }
      } else {
        toast({
          title: 'Registration Failed',
          description: response.data.message || 'Something went wrong',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Signup Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url,
      });
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'Unable to connect to the server',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgGradient="linear(to-r, purple.900, transparent)"
      p={{ base: 4, md: 6 }}
    >
      <Box
        maxW="md"
        w="full"
        bg="whiteAlpha.900"
        p={{ base: 6, md: 8 }}
        borderRadius="3xl"
        boxShadow="lg"
        border="1px solid"
        borderColor="purple.200"
        mt={{ base: '70px', md: 0 }}
      >
        <VStack spacing={8} align="stretch">
          <Text
            fontSize={{ base: '2xl', md: '3xl' }}
            fontWeight="bold"
            textAlign="center"
            color="purple.600"
            fontFamily="'Playfair Display', serif"
          >
            Join Glamist
          </Text>
          <Text
            fontSize="md"
            textAlign="center"
            color="gray.600"
            fontFamily="'Montserrat', sans-serif"
          >
            Create your account
          </Text>
          <form onSubmit={onSubmitHandler}>
            <VStack spacing={6}>
              <FormControl id="name" isRequired>
                <FormLabel
                  fontSize="sm"
                  color="purple.700"
                  fontFamily="'Montserrat', sans-serif"
                >
                  Full Name
                </FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <InfoIcon color="purple.500" />
                  </InputLeftElement>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    bg="gray.50"
                    borderColor="purple.200"
                    borderRadius="full"
                    color="gray.800"
                    _focus={{ borderColor: 'purple.500', bg: 'white' }}
                    _placeholder={{ color: 'gray.400' }}
                    disabled={isLoading}
                    fontFamily="'Montserrat', sans-serif"
                  />
                </InputGroup>
              </FormControl>
              <FormControl id="email" isRequired>
                <FormLabel
                  fontSize="sm"
                  color="purple.700"
                  fontFamily="'Montserrat', sans-serif"
                >
                  Email
                </FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <EmailIcon color="purple.500" />
                  </InputLeftElement>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    bg="gray.50"
                    borderColor="purple.200"
                    borderRadius="full"
                    color="gray.800"
                    _focus={{ borderColor: 'purple.500', bg: 'white' }}
                    _placeholder={{ color: 'gray.400' }}
                    disabled={isLoading}
                    fontFamily="'Montserrat', sans-serif"
                  />
                </InputGroup>
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel
                  fontSize="sm"
                  color="purple.700"
                  fontFamily="'Montserrat', sans-serif"
                >
                  Password
                </FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <LockIcon color="purple.500" />
                  </InputLeftElement>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    bg="gray.50"
                    borderColor="purple.200"
                    borderRadius="full"
                    color="gray.800"
                    _focus={{ borderColor: 'purple.500', bg: 'white' }}
                    _placeholder={{ color: 'gray.400' }}
                    disabled={isLoading}
                    fontFamily="'Montserrat', sans-serif"
                  />
                </InputGroup>
              </FormControl>
              <FormControl id="confirmPassword" isRequired>
                <FormLabel
                  fontSize="sm"
                  color="purple.700"
                  fontFamily="'Montserrat', sans-serif"
                >
                  Confirm Password
                </FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <LockIcon color="purple.500" />
                  </InputLeftElement>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    bg="gray.50"
                    borderColor="purple.200"
                    borderRadius="full"
                    color="gray.800"
                    _focus={{ borderColor: 'purple.500', bg: 'white' }}
                    _placeholder={{ color: 'gray.400' }}
                    disabled={isLoading}
                    fontFamily="'Montserrat', sans-serif"
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <Checkbox
                  isChecked={showAdminCode}
                  onChange={(e) => setShowAdminCode(e.target.checked)}
                  colorScheme="purple"
                  size="md"
                >
                  <Text
                    color="purple.700"
                    fontSize="sm"
                    fontFamily="'Montserrat', sans-serif"
                  >
                    Admin Registration
                  </Text>
                </Checkbox>
              </FormControl>
              {showAdminCode && (
                <FormControl id="adminCode" isRequired>
                  <FormLabel
                    fontSize="sm"
                    color="purple.700"
                    fontFamily="'Montserrat', sans-serif"
                  >
                    Admin Code
                  </FormLabel>
                  <InputGroup>
                    <Input
                      type="password"
                      value={adminCode}
                      onChange={(e) => setAdminCode(e.target.value)}
                      placeholder="Enter admin code"
                      bg="gray.50"
                      borderColor="purple.200"
                      borderRadius="full"
                      color="gray.800"
                      _focus={{ borderColor: 'purple.500', bg: 'white' }}
                      _placeholder={{ color: 'gray.400' }}
                      disabled={isLoading}
                      fontFamily="'Montserrat', sans-serif"
                    />
                  </InputGroup>
                </FormControl>
              )}
              <Button
                type="submit"
                w="full"
                py={6}
                px={8}
                borderRadius="full"
                bg="purple.600"
                color="white"
                fontWeight="bold"
                fontSize="lg"
                boxShadow="md"
                isLoading={isLoading}
                loadingText="Signing up..."
                _hover={{ bg: 'purple.700', boxShadow: 'lg' }}
                _active={{ bg: 'purple.800' }}
                fontFamily="'Montserrat', sans-serif"
              >
                Sign Up
              </Button>
            </VStack>
          </form>
          <Text
            textAlign="center"
            fontSize="sm"
            color="gray.600"
            fontFamily="'Montserrat', sans-serif"
          >
            Already have an account?{' '}
            <Link
              as={RouterLink}
              to="/login"
              color="purple.500"
              _hover={{ color: 'purple.700', textDecoration: 'underline' }}
            >
              Log in
            </Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default Register;