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
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { EmailIcon, LockIcon } from '@chakra-ui/icons';

const Login = ({ setIsLoggedIn, setUserData }) => { // Added setUserData prop
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const loginUrl =
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:4000/api/auth/login'
          : '/api/auth/login';
      console.log('Attempting login at URL:', loginUrl);
      console.log('Login Request Data:', { email, password });

      const response = await axios.post(
        loginUrl,
        { email, password },
        { withCredentials: true }
      );
      console.log('Login Response:', response.data);

      if (response.data.success) {
        setIsLoggedIn(true);
        // Set userData with role from the response
        setUserData({
          role: response.data.role || (response.data.isAdmin ? 'admin' : 'customer'),
          // Optionally add other fields like email or name if returned
        });
        const isAdmin = response.data.isAdmin || response.data.role === 'admin';
        toast({
          title: 'Login Successful',
          description: isAdmin ? 'Logged in as Admin' : 'Logged in as Customer',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        if (isAdmin) {
          console.log('Redirecting to OwnerDashboard as Admin');
          navigate('/');
        } else {
          console.log('Redirecting to Home as Customer');
          navigate('/');
        }
      } else {
        toast({
          title: 'Login Failed',
          description: response.data.message || 'Invalid credentials',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Login Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url,
      });
      toast({
        title: 'Error',
        description:
          error.response?.data?.message ||
          error.message ||
          'Unable to connect to the server',
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
            Welcome to Glamist
          </Text>
          <Text
            fontSize="md"
            textAlign="center"
            color="gray.600"
            fontFamily="'Montserrat', sans-serif"
          >
            Log in to your account
          </Text>
          <form onSubmit={onSubmitHandler}>
            <VStack spacing={6}>
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
              <Text
                as={RouterLink}
                to="/reset-password"
                color="purple.500"
                fontSize="sm"
                fontStyle="italic"
                textAlign="left"
                w="full"
                _hover={{ color: 'purple.700', textDecoration: 'underline' }}
                fontFamily="'Montserrat', sans-serif"
              >
                Forgot Password?
              </Text>
              <Button
                type="submit"
                w="full"
                py={6}
                borderRadius="full"
                bg="purple.600"
                color="white"
                fontWeight="medium"
                fontSize="lg"
                isLoading={isLoading}
                loadingText="Logging in..."
                _hover={{ bg: 'purple.700' }}
                fontFamily="'Montserrat', sans-serif"
              >
                Login
              </Button>
            </VStack>
          </form>
          <Text
            textAlign="center"
            fontSize="sm"
            color="gray.600"
            fontFamily="'Montserrat', sans-serif"
          >
            Don’t have an account?{' '}
            <Link
              as={RouterLink}
              to="/signup"
              color="purple.500"
              _hover={{ color: 'purple.700', textDecoration: 'underline' }}
            >
              Sign up
            </Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default Login;