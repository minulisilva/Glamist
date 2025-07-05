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
import { EmailIcon } from '@chakra-ui/icons';

const SendResetOtp = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const resetOtpUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:4000/api/auth/send-reset-otp'
        : '/api/auth/send-reset-otp';
      console.log('Attempting OTP request at URL:', resetOtpUrl);
      console.log('OTP Request Data:', { email });

      const response = await axios.post(
        resetOtpUrl,
        { email },
        { withCredentials: true }
      );
      console.log('OTP Response:', response.data);

      if (response.data.success) {
        toast({
          title: 'OTP Sent',
          description: 'Check your email for the OTP.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/reset-password'); // Redirect to enter OTP
      } else {
        toast({
          title: 'Request Failed',
          description: response.data.message || 'Something went wrong',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('OTP Request Error Details:', {
        message: error.message,
        code: error.code,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data,
        } : null,
        requestUrl: error.config?.url,
      });
      toast({
        title: 'Network Error',
        description: error.message === 'Network Error'
          ? 'Cannot connect to backend. Check server and endpoint.'
          : error.response?.data?.message || error.message || 'Unable to send OTP',
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
      bgGradient="linear(to-r, purple.900, gray.50)"
      p={4}
    >
      <Box
        maxW="md"
        w="full"
        bg="white"
        p={8}
        borderRadius="full"
        boxShadow="lg"
        mt={{ base: '70px', md: 0 }}
      >
        <VStack spacing={6} align="stretch">
          <Text fontSize="2xl" fontWeight="medium" textAlign="center" color="purple.600">
            Request Password Reset OTP
          </Text>
          <form onSubmit={onSubmitHandler}>
            <VStack spacing={4}>
              <FormControl id="email" isRequired>
                <FormLabel srOnly>Email</FormLabel>
                <InputGroup bg="#333A5C" borderRadius="full" px={5} py={2.5}>
                  <InputLeftElement pointerEvents="none">
                    <EmailIcon color="white" />
                  </InputLeftElement>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    border="none"
                    color="white"
                    _focus={{ outline: 'none' }}
                    _placeholder={{ color: 'gray.300' }}
                    disabled={isLoading}
                  />
                </InputGroup>
              </FormControl>
              <Button
                type="submit"
                w="full"
                py={2.5}
                borderRadius="full"
                bgGradient="linear(to-r, indigo.500, indigo.900)"
                color="white"
                fontWeight="medium"
                isLoading={isLoading}
                loadingText="Sending..."
                _hover={{ bgGradient: 'linear(to-r, indigo.600, indigo.800)' }}
              >
                Send OTP
              </Button>
            </VStack>
          </form>
          <Text textAlign="center">
            Back to{' '}
            <Link as={RouterLink} to="/login" color="indigo.500" _hover={{ textDecoration: 'underline' }}>
              Login
            </Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default SendResetOtp;