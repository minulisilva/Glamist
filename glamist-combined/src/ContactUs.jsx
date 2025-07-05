import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useColorMode,
  FormErrorMessage,
  Select,
  HStack,
  Icon,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';
import { useTheme } from './ThemeContext';

const MotionBox = motion(Box);
const MotionIcon = motion(Icon);

// Animation Variants (unchanged)
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

const ContactUs = () => {
  const { colorMode } = useColorMode();
  const { themeKey, currentTheme, currentBackgroundImages } = useTheme();
  const currentBackgroundImage = currentBackgroundImages[0];
  const toast = useToast();

  const [name, setName] = useState('');
  const [isNameInvalid, setIsNameInvalid] = useState(false);
  const [email, setEmail] = useState('');
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+94');
  const [isPhoneInvalid, setIsPhoneInvalid] = useState(false);
  const [message, setMessage] = useState('');
  const [isMessageInvalid, setIsMessageInvalid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const countryCodes = [
    { code: '+94', label: 'Sri Lanka (+94)' },
    { code: '+1', label: 'USA (+1)' },
    { code: '+44', label: 'UK (+44)' },
    { code: '+91', label: 'India (+91)' },
  ];

  const inappropriateWords = [
    'fuck',
    'bitch',
    'nigga',
    'shit',
    'asshole',
    'damn',
    'cunt',
    'bastard',
  ];

  const validateName = (value) => value.trim().length > 0;

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return value.length > 0 && emailRegex.test(value);
  };

  const validatePhone = (value) => {
    const phoneRegex = /^[0-9]{7,15}$/;
    return value.length > 0 && phoneRegex.test(value);
  };

  const validateMessage = (value) => {
    if (!value) return false;
    const words = value.toLowerCase().split(/\s+/);
    return !inappropriateWords.some((word) => words.includes(word));
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    setIsNameInvalid(!validateName(newName));
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsEmailInvalid(!validateEmail(newEmail));
  };

  const handlePhoneChange = (e) => {
    const newPhone = e.target.value;
    setPhone(newPhone);
    setIsPhoneInvalid(!validatePhone(newPhone));
  };

  const handleCountryCodeChange = (e) => {
    setCountryCode(e.target.value);
  };

  const handleMessageChange = (e) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
    setIsMessageInvalid(!validateMessage(newMessage));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nameValid = validateName(name);
    const emailValid = validateEmail(email);
    const phoneValid = validatePhone(phone);
    const messageValid = validateMessage(message);

    setIsNameInvalid(!nameValid);
    setIsEmailInvalid(!emailValid);
    setIsPhoneInvalid(!phoneValid);
    setIsMessageInvalid(!messageValid);

    if (nameValid && emailValid && phoneValid && messageValid) {
      setIsSubmitting(true);
      try {
        const response = await fetch(
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:4000/api/contact'
            : 'https://your-production-domain.com/api/contact',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name,
              email,
              phone: `${countryCode}${phone}`,
              message,
            }),
          }
        );
        const data = await response.json();
        if (response.ok && data.success) {
          toast({
            title: 'Message Sent',
            description: 'Your message has been successfully sent!',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          // Reset form
          setName('');
          setEmail('');
          setPhone('');
          setCountryCode('+94');
          setMessage('');
          setIsNameInvalid(false);
          setIsEmailInvalid(false);
          setIsPhoneInvalid(false);
          setIsMessageInvalid(false);
        } else {
          toast({
            title: 'Error',
            description: data.error || 'Failed to send message. Please try again.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        toast({
          title: 'Network Error',
          description: 'Unable to connect to the server. Please check your connection.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Box
      minH="100vh"
      bg={colorMode === 'light' ? currentTheme.sectionBg : 'gray.900'}
      py={{ base: 10, md: 14 }}
      position="relative"
      overflow="hidden"
    >
      {/* Holiday Animations (unchanged) */}
      {themeKey === 'valentines' &&
        Array.from({ length: 10 }).map((_, i) => (
          <MotionIcon
            key={i}
            as={FaHeart}
            color="red.500"
            boxSize={6}
            position="absolute"
            top={`${Math.random() * 50}%`}
            left={`${Math.random() * 100}%`}
            variants={heartVariants}
            animate="animate"
            zIndex={1}
          />
        ))}
      {themeKey === 'newYear' &&
        Array.from({ length: 10 }).map((_, i) => (
          <MotionBox
            key={i}
            w="30px"
            h="30px"
            bg="gold.400"
            position="absolute"
            top={`${Math.random() * 80}%`}
            left={`${Math.random() * 100}%`}
            variants={fireworkVariants}
            animate="animate"
            zIndex={10}
            boxShadow="0 0 15px rgba(255, 215, 0, 0.8)"
          />
        ))}
      {themeKey === 'halloween' &&
        Array.from({ length: 6 }).map((_, i) => (
          <MotionBox
            key={i}
            w="50px"
            h="50px"
            bg="orange.500"
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
        ))}
      {themeKey === 'christmas' &&
        Array.from({ length: 15 }).map((_, i) => (
          <MotionBox
            key={i}
            w="8px"
            h="8px"
            bg="white"
            borderRadius="full"
            position="absolute"
            top={`${Math.random() * 50}%`}
            left={`${Math.random() * 100}%`}
            variants={snowflakeVariants}
            animate="animate"
            zIndex={1}
          />
        ))}

      {/* Hero Background (unchanged) */}
      <MotionBox
        bgImage={`url(${currentBackgroundImage})`}
        bgSize="cover"
        bgPosition="center"
        minH="40vh"
        position="relative"
        display="flex"
        alignItems="center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      >
        <Box position="absolute" top={0} left={0} right={0} bottom={0} bgGradient={currentTheme.bgGradient} opacity={0.7} />
        <Container maxW="container.lg" zIndex={2}>
          <VStack spacing={4} align="center" color="white">
            <Heading
              as="h1"
              size="2xl"
              fontFamily="'Playfair Display', serif"
              textShadow="2px 2px 8px rgba(0, 0, 0, 0.3)"
            >
              Contact Us
            </Heading>
            <Text
              fontSize="xl"
              fontFamily="'Montserrat', sans-serif"
              textShadow="1px 1px 4px rgba(0, 0, 0, 0.2)"
              maxW="2xl"
              textAlign="center"
            >
              We’d love to hear from you! Reach out with any questions or inquiries.
            </Text>
          </VStack>
        </Container>
      </MotionBox>

      <Container maxW="container.xl" py={{ base: 10, md: 14 }}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
          <MotionBox
            as="form"
            onSubmit={handleSubmit}
            spacing={6}
            p={6}
            bg={colorMode === 'light' ? 'white' : 'gray.700'}
            borderRadius="lg"
            boxShadow="md"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <VStack spacing={6}>
              <Heading
                as="h2"
                size="lg"
                fontFamily="'Playfair Display', serif"
                color={colorMode === 'light' ? currentTheme.primaryColor : currentTheme.secondaryColor}
              >
                Send Us a Message
              </Heading>
              <FormControl isInvalid={isNameInvalid} isRequired>
                <FormLabel fontFamily="'Montserrat', sans-serif" color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
                  Name
                </FormLabel>
                <Input
                  placeholder="Your Name"
                  value={name}
                  onChange={handleNameChange}
                  bg={colorMode === 'light' ? 'gray.100' : 'gray.600'}
                  border="none"
                  _focus={{ borderColor: currentTheme.primaryColor, boxShadow: `0 0 0 1px ${currentTheme.primaryColor}` }}
                />
                <FormErrorMessage fontFamily="'Montserrat', sans-serif">Name is required</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={isEmailInvalid} isRequired>
                <FormLabel fontFamily="'Montserrat', sans-serif" color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
                  Email
                </FormLabel>
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={handleEmailChange}
                  bg={colorMode === 'light' ? 'gray.100' : 'gray.600'}
                  border="none"
                  _focus={{ borderColor: currentTheme.primaryColor, boxShadow: `0 0 0 1px ${currentTheme.primaryColor}` }}
                />
                <FormErrorMessage fontFamily="'Montserrat', sans-serif">
                  Please enter a valid email address
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={isPhoneInvalid} isRequired>
                <FormLabel fontFamily="'Montserrat', sans-serif" color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
                  Phone Number
                </FormLabel>
                <HStack>
                  <Select
                    value={countryCode}
                    onChange={handleCountryCodeChange}
                    bg={colorMode === 'light' ? 'gray.100' : 'gray.600'}
                    border="none"
                    w="40%"
                    _focus={{ borderColor: currentTheme.primaryColor, boxShadow: `0 0 0 1px ${currentTheme.primaryColor}` }}
                  >
                    {countryCodes.map((option) => (
                      <option key={option.code} value={option.code}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={handlePhoneChange}
                    bg={colorMode === 'light' ? 'gray.100' : 'gray.600'}
                    border="none"
                    _focus={{ borderColor: currentTheme.primaryColor, boxShadow: `0 0 0 1px ${currentTheme.primaryColor}` }}
                  />
                </HStack>
                <FormErrorMessage fontFamily="'Montserrat', sans-serif">
                  Please enter a valid phone number (7-15 digits)
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={isMessageInvalid} isRequired>
                <FormLabel fontFamily="'Montserrat', sans-serif" color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
                  Message
                </FormLabel>
                <Textarea
                  placeholder="Your Message"
                  value={message}
                  onChange={handleMessageChange}
                  bg={colorMode === 'light' ? 'gray.100' : 'gray.600'}
                  border="none"
                  _focus={{ borderColor: currentTheme.primaryColor, boxShadow: `0 0 0 1px ${currentTheme.primaryColor}` }}
                  rows={5}
                />
                <FormErrorMessage fontFamily="'Montserrat', sans-serif">
                  {message.length === 0
                    ? 'Message is required'
                    : 'Inappropriate language detected. Please revise your message.'}
                </FormErrorMessage>
              </FormControl>
              <Button
                type="submit"
                colorScheme={currentTheme.primaryColor.split('.')[0]}
                w="full"
                fontFamily="'Montserrat', sans-serif"
                _hover={{ bg: `${currentTheme.primaryColor.split('.')[0]}.600` }}
                isDisabled={isNameInvalid || isEmailInvalid || isPhoneInvalid || isMessageInvalid}
                isLoading={isSubmitting}
                loadingText="Sending"
              >
                Send Message
              </Button>
            </VStack>
          </MotionBox>

          <MotionBox
            spacing={6}
            p={6}
            bg={colorMode === 'light' ? 'white' : 'gray.700'}
            borderRadius="lg"
            boxShadow="md"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <VStack spacing={6}>
              <Heading
                as="h2"
                size="lg"
                fontFamily="'Playfair Display', serif"
                color={colorMode === 'light' ? currentTheme.primaryColor : currentTheme.secondaryColor}
              >
                Get in Touch
              </Heading>
              <Text
                fontSize="md"
                color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
                fontFamily="'Montserrat', sans-serif"
              >
                Email:{' '}
                <a href="mailto:support@glamist.com" style={{ color: currentTheme.primaryColor }}>
                  support@glamist.com
                </a>
              </Text>
              <Text
                fontSize="md"
                color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
                fontFamily="'Montserrat', sans-serif"
              >
                Phone:{' '}
                <a href="tel:+94111234567" style={{ color: currentTheme.primaryColor }}>
                  +94 11 123 4567
                </a>
              </Text>
              <Text
                fontSize="md"
                color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
                fontFamily="'Montserrat', sans-serif"
              >
                Address: SLIIT, Kandy
              </Text>
              <Box w="full" h="200px" borderRadius="lg" overflow="hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.644467621524!2d80.63290861462373!3d7.294568594731948!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3662db121363f%3A0x4a0e2e0b24e1a9e7!2sSLIIT%20Kandy%20Campus!5e0!3m2!1sen!2slk!4v1697041234567!5m2!1sen!2slk"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </Box>
            </VStack>
          </MotionBox>
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default ContactUs;