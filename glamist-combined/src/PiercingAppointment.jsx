import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  FormControl,
  FormLabel,
  Select,
  Input,
  Button,
  useToast,
  Image,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import axios from 'axios';

const MotionBox = motion(Box);

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box p={4} color="red.500" textAlign="center">
          <h2>Something went wrong.</h2>
          <p>{this.state.error.message}</p>
        </Box>
      );
    }
    return this.props.children;
  }
}

// Seasonal themes with purple as default
const themes = {
  spring: { primaryColor: 'purple.600', secondaryColor: 'purple.200', bgGradient: 'linear(to-r, purple.900, purple.400)', sectionBg: 'white' },
  summer: { primaryColor: 'purple.600', secondaryColor: 'purple.200', bgGradient: 'linear(to-r, purple.900, purple.400)', sectionBg: 'white' },
  fall: { primaryColor: 'purple.600', secondaryColor: 'purple.200', bgGradient: 'linear(to-r, purple.900, purple.400)', sectionBg: 'white' },
  winter: { primaryColor: 'purple.600', secondaryColor: 'purple.200', bgGradient: 'linear(to-r, purple.900, purple.400)', sectionBg: 'white' },
  default: { primaryColor: 'purple.600', secondaryColor: 'purple.200', bgGradient: 'linear(to-r, purple.900, purple.400)', sectionBg: 'white' },
};

const getThemeKey = (date) => {
  const month = date.getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  if (month === 11 || month <= 1) return 'winter';
  return 'default';
};

const piercingServices = [
  { name: 'Earlobe Piercing', price: 25 },
  { name: 'Cartilage Piercing', price: 35 },
  { name: 'Nose Piercing', price: 40 },
  { name: 'Eyebrow Piercing', price: 45 },
  { name: 'Lip Piercing', price: 50 },
];

const staff = [
  { name: 'Luna Carter', role: 'Piercing Specialist', image: 'https://images.unsplash.com/photo-1524504388940-b6f0c3a87e7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
  { name: 'Ava Singh', role: 'Body Art Expert', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
  { name: 'Sofia Mendes', role: 'Piercing Artist', image: 'https://images.unsplash.com/photo-1517841902196-6e2e28734b3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
];

const piercingTools = [
  'Piercing Needle',
  'Piercing Gun',
  'Sterile Clamp',
  'Marking Pen',
];

const PiercingAppointment = () => {
  const toast = useToast();

  // Form state
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    email: '',
    selectedService: '',
    selectedStaff: '',
    date: '',
    time: '',
    piercingTool: '',
    imageFile: null,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Theme setup
  const currentDate = new Date();
  const themeKey = getThemeKey(currentDate);
  const currentTheme = themes[themeKey];

  // Price calculation
  const selectedServicePrice = piercingServices.find(service => service.name === formData.selectedService)?.price || 0;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid File',
        description: 'Please upload an image file.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setFormData(prev => ({ ...prev, imageFile: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { customerName, phoneNumber, email, selectedService, selectedStaff, date, time, piercingTool, imageFile } = formData;

    if (!customerName || !phoneNumber || !email || !selectedService || !selectedStaff || !date || !time) {
      toast({
        title: 'Incomplete Form',
        description: 'Please fill out all required fields.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!/^\d{9,12}$/.test(phoneNumber)) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Please enter a valid phone number (9-12 digits).',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formattedDate = new Date(date).toISOString();
    if (isNaN(new Date(formattedDate))) {
      toast({
        title: 'Error',
        description: 'Invalid date format. Please use YYYY-MM-DD.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('customerName', customerName);
    formDataToSend.append('phoneNumber', phoneNumber);
    formDataToSend.append('email', email);
    formDataToSend.append('service', selectedService);
    formDataToSend.append('staff', selectedStaff);
    formDataToSend.append('date', formattedDate);
    formDataToSend.append('time', time);
    formDataToSend.append('price', selectedServicePrice);
    formDataToSend.append('piercingTool', piercingTool);
    if (imageFile) {
      formDataToSend.append('image', imageFile);
    }

    console.log([...formDataToSend.entries()]); // Debug the sent data
    try {
      const response = await axios.post('http://127.0.0.1:4000/api/hair-appointments/book', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setIsSubmitted(true);
      toast({
        title: 'Appointment Booked!',
        description: response.data.message || `Your ${selectedService} with ${selectedStaff} on ${date} at ${time} is scheduled.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to book appointment. Please try again.';
      toast({
        title: 'Error',
        description: errorMessage.includes('Route not found') 
          ? 'Backend route is unavailable. Please check the server or contact support.'
          : errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Error booking appointment:', error.response?.data || error.message);
    }
  };

  const handleBookAnother = () => {
    setFormData({
      customerName: '',
      phoneNumber: '',
      email: '',
      selectedService: '',
      selectedStaff: '',
      date: '',
      time: '',
      piercingTool: '',
      imageFile: null,
    });
    setIsSubmitted(false);
  };

  const handleFormChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <ErrorBoundary>
      <Box minH="100vh" bg="white" py={{ base: 12, md: 16 }}>
        <Container maxW="container.xl">
          <VStack spacing={10} align="stretch">
            <MotionBox initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <Heading as="h1" size={{ base: 'xl', md: '2xl' }} color="purple.600" textAlign="center" fontFamily="'Playfair Display', serif">
                Book Your Piercing Appointment
              </Heading>
              <Text fontSize={{ base: 'md', md: 'lg' }} color="purple.600" textAlign="center" mt={2} fontFamily="'Montserrat', sans-serif">
                Schedule your perfect piercing experience!
              </Text>
            </MotionBox>

            {!isSubmitted ? (
              <MotionBox
                p={{ base: 6, md: 8 }}
                bg="white"
                borderRadius="xl"
                boxShadow="lg"
                border="1px solid"
                borderColor={currentTheme.secondaryColor}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <form onSubmit={handleSubmit}>
                  <VStack spacing={6} align="stretch">
                    <FormControl isRequired>
                      <FormLabel color="purple.600" fontFamily="'Montserrat', sans-serif">Your Name</FormLabel>
                      <Input
                        type="text"
                        value={formData.customerName}
                        onChange={handleFormChange('customerName')}
                        placeholder="Enter your full name"
                        bg="gray.100"
                        borderColor={currentTheme.secondaryColor}
                        _focus={{ borderColor: currentTheme.primaryColor }}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel color="purple.600" fontFamily="'Montserrat', sans-serif">Phone Number</FormLabel>
                      <Input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handleFormChange('phoneNumber')}
                        placeholder="Enter your phone number"
                        bg="gray.100"
                        borderColor={currentTheme.secondaryColor}
                        _focus={{ borderColor: currentTheme.primaryColor }}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel color="purple.600" fontFamily="'Montserrat', sans-serif">Email</FormLabel>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={handleFormChange('email')}
                        placeholder="Enter your email"
                        bg="gray.100"
                        borderColor={currentTheme.secondaryColor}
                        _focus={{ borderColor: currentTheme.primaryColor }}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel color="purple.600" fontFamily="'Montserrat', sans-serif">Piercing Service</FormLabel>
                      <Select
                        value={formData.selectedService}
                        onChange={handleFormChange('selectedService')}
                        placeholder="Select a piercing service"
                        bg="gray.100"
                        borderColor={currentTheme.secondaryColor}
                        _focus={{ borderColor: currentTheme.primaryColor }}
                      >
                        {piercingServices.map((service) => (
                          <option key={service.name} value={service.name}>
                            {service.name} - ${service.price}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel color="purple.600" fontFamily="'Montserrat', sans-serif">Piercing Specialist</FormLabel>
                      <Select
                        value={formData.selectedStaff}
                        onChange={handleFormChange('selectedStaff')}
                        placeholder="Choose a specialist"
                        bg="gray.100"
                        borderColor={currentTheme.secondaryColor}
                        _focus={{ borderColor: currentTheme.primaryColor }}
                      >
                        {staff.map((member) => (
                          <option key={member.name} value={member.name}>
                            {member.name} - {member.role}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel color="purple.600" fontFamily="'Montserrat', sans-serif">Piercing Tool</FormLabel>
                      <Select
                        value={formData.piercingTool}
                        onChange={handleFormChange('piercingTool')}
                        placeholder="Select a piercing tool"
                        bg="gray.100"
                        borderColor={currentTheme.secondaryColor}
                        _focus={{ borderColor: currentTheme.primaryColor }}
                      >
                        {piercingTools.map((tool) => (
                          <option key={tool} value={tool}>{tool}</option>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel color="purple.600" fontFamily="'Montserrat', sans-serif">Appointment Date</FormLabel>
                      <Input
                        type="date"
                        value={formData.date}
                        onChange={handleFormChange('date')}
                        min={new Date().toISOString().split('T')[0]}
                        bg="gray.100"
                        borderColor={currentTheme.secondaryColor}
                        _focus={{ borderColor: currentTheme.primaryColor }}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel color="purple.600" fontFamily="'Montserrat', sans-serif">Appointment Time</FormLabel>
                      <Select
                        value={formData.time}
                        onChange={handleFormChange('time')}
                        placeholder="Select a time slot"
                        bg="gray.100"
                        borderColor={currentTheme.secondaryColor}
                        _focus={{ borderColor: currentTheme.primaryColor }}
                      >
                        {['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'].map((slot) => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel color="purple.600" fontFamily="'Montserrat', sans-serif">Upload Reference Image (Optional)</FormLabel>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        bg="gray.100"
                        borderColor={currentTheme.secondaryColor}
                        _focus={{ borderColor: currentTheme.primaryColor }}
                        p={1}
                      />
                      {formData.imageFile && (
                        <Box mt={4}>
                          <Image
                            src={URL.createObjectURL(formData.imageFile)}
                            alt="Uploaded reference"
                            maxH="200px"
                            borderRadius="md"
                            border="2px solid"
                            borderColor={currentTheme.secondaryColor}
                          />
                          <Button
                            mt={2}
                            size="sm"
                            variant="outline"
                            colorScheme="purple"
                            onClick={() => setFormData(prev => ({ ...prev, imageFile: null }))}
                            fontFamily="'Montserrat', sans-serif"
                          >
                            Remove Image
                          </Button>
                        </Box>
                      )}
                    </FormControl>

                    <Button
                      type="submit"
                      colorScheme="purple"
                      size="lg"
                      borderRadius="full"
                      _hover={{ transform: 'scale(1.05)', boxShadow: 'lg' }}
                      fontFamily="'Montserrat', sans-serif"
                    >
                      Confirm Booking
                    </Button>
                  </VStack>
                </form>
              </MotionBox>
            ) : (
              <MotionBox
                p={{ base: 6, md: 8 }}
                bg="white"
                borderRadius="xl"
                boxShadow="lg"
                border="1px solid"
                borderColor={currentTheme.secondaryColor}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                textAlign="center"
              >
                <VStack spacing={6}>
                  <Image
                    src={formData.imageFile ? URL.createObjectURL(formData.imageFile) : "https://via.placeholder.com/150"}
                    alt="Piercing Appointment Confirmation"
                    boxSize="150px"
                    borderRadius="full"
                    objectFit="cover"
                    border="3px solid"
                    borderColor={currentTheme.primaryColor}
                  />
                  <Heading as="h2" size="lg" color="purple.600" fontFamily="'Playfair Display', serif">
                    Booking Confirmed!
                  </Heading>
                  <Text fontSize="md" color="purple.600" fontFamily="'Montserrat', sans-serif">
                    <strong>{formData.customerName}</strong> ({formData.phoneNumber}), your <strong>{formData.selectedService}</strong> with <strong>{formData.selectedStaff}</strong> is scheduled for <strong>{formData.date}</strong> at <strong>{formData.time}</strong>.
                    <br />
                    Total: <strong>${selectedServicePrice}</strong>
                    {formData.imageFile && <><br />Reference image attached.</>}
                  </Text>
                  <Button
                    onClick={handleBookAnother}
                    colorScheme="purple"
                    size="md"
                    borderRadius="full"
                    _hover={{ transform: 'scale(1.05)', boxShadow: 'lg' }}
                    fontFamily="'Montserrat', sans-serif"
                  >
                    Schedule Another Appointment
                  </Button>
                </VStack>
              </MotionBox>
            )}

            <VStack spacing={6}>
              <Heading as="h2" size="lg" color="purple.600" textAlign="center" fontFamily="'Playfair Display', serif">
                Our Piercing Specialists
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {staff.map((member) => (
                  <MotionBox
                    key={member.name}
                    p={4}
                    bg="white"
                    borderRadius="xl"
                    boxShadow="md"
                    border="2px solid"
                    borderColor={currentTheme.secondaryColor}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    _hover={{ transform: 'translateY(-10px)', boxShadow: `0 8px 20px ${currentTheme.secondaryColor}` }}
                  >
                    <VStack spacing={4}>
                      <Image
                        src={member.image}
                        alt={member.name}
                        borderRadius="full"
                        boxSize="120px"
                        objectFit="cover"
                        border="3px solid"
                        borderColor={currentTheme.primaryColor}
                        fallbackSrc="https://i0.wp.com/blog.appointy.com/wp-content/uploads/2020/01/aw-creative-fI-TKWjKYls-unsplash-scaled.jpg?resize=1140%2C660&ssl=1"
                      />
                      <Text fontSize="lg" fontWeight="bold" color="purple.600" fontFamily="'Montserrat', sans-serif">
                        {member.name}
                      </Text>
                      <Text fontSize="md" color="purple.600" fontFamily="'Montserrat', sans-serif">
                        {member.role}
                      </Text>
                    </VStack>
                  </MotionBox>
                ))}
              </SimpleGrid>
            </VStack>
          </VStack>
        </Container>
      </Box>
    </ErrorBoundary>
  );
};

export default PiercingAppointment;