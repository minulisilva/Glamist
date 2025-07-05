import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
  Image,
  Text,
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

const HairAppointment = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    email: '',
    service: '',
    staff: '',
    date: '',
    time: '',
    hairTool: '',
    imageFile: null,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const toast = useToast();

  // Price list for services
  const servicePrices = {
    Haircut: 40,
    Coloring: 80,
    Blowout: 30,
    Updo: 60,
    Braiding: 50,
    Curling: 45,
    Straightening: 70,
    Perm: 90,
    'Hair Extensions': 150,
    'Balayage Styling': 100,
    'Keratin Treatment': 120,
    'Vintage Styling': 55,
    Manicure: 25,
    Pedicure: 30,
    'Gel Manicure': 35,
    'Acrylic Nails': 50,
    'Dip Powder Nails': 45,
    'Nail Art': 20,
    'French Manicure': 30,
    'Spa Pedicure': 40,
    'Nail Repair': 15,
    'Paraffin Treatment': 20,
    'Shellac Removal': 10,
    Facial: 60,
    HydraFacial: 100,
    'Chemical Peel': 80,
    Microdermabrasion: 90,
    'LED Light Therapy': 70,
    Microneedling: 120,
    'Acne Treatment': 50,
    'Anti-Aging Facial': 90,
    'Oxygen Facial': 80,
    Dermaplaning: 75,
    'Skin Brightening': 65,
    'Custom Tattoo': 100,
    'Cover-Up Tattoo': 150,
    'Touch-Up': 30,
    'Flash Tattoo': 50,
    'Portrait Tattoo': 200,
    'Traditional Tattoo': 120,
    'Watercolor Tattoo': 130,
    'Blackwork Tattoo': 110,
    'Script Tattoo': 80,
    'Micro Tattoo': 60,
    'Temporary Tattoo': 20,
  };

  const selectedServicePrice = servicePrices[formData.service] || 0;

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

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, imageFile: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customerName || !formData.phoneNumber || !formData.email || !formData.service || !formData.staff || !formData.date || !formData.time) {
      toast({
        title: 'Incomplete Form',
        description: 'Please fill out all required fields.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!/^\d{9,12}$/.test(formData.phoneNumber)) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Please enter a valid phone number (9-12 digits).',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formattedDate = new Date(formData.date).toISOString();
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
    formDataToSend.append('customerName', formData.customerName);
    formDataToSend.append('phoneNumber', formData.phoneNumber);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('service', formData.service);
    formDataToSend.append('staff', formData.staff);
    formDataToSend.append('date', formattedDate);
    formDataToSend.append('time', formData.time);
    formDataToSend.append('price', selectedServicePrice);
    formDataToSend.append('hairTool', formData.hairTool);
    if (formData.imageFile) {
      formDataToSend.append('image', formData.imageFile);
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
        description: response.data.message || `Your ${formData.service} with ${formData.staff} on ${formData.date} at ${formData.time} is scheduled.`,
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
      service: '',
      staff: '',
      date: '',
      time: '',
      hairTool: '',
      imageFile: null,
    });
    setIsSubmitted(false);
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <ErrorBoundary>
      <MotionBox
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        p={6}
        maxW="500px"
        mx="auto"
        mt={10}
        borderWidth="1px"
        borderRadius={8}
        boxShadow="lg"
      >
        {!isSubmitted ? (
          <VStack spacing={4} as="form" onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel>Customer Name</FormLabel>
              <Input value={formData.customerName} onChange={handleChange('customerName')} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Phone Number</FormLabel>
              <Input value={formData.phoneNumber} onChange={handleChange('phoneNumber')} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" value={formData.email} onChange={handleChange('email')} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Service</FormLabel>
              <Select value={formData.service} onChange={handleChange('service')} placeholder="Select service">
                {Object.keys(servicePrices).map((service) => (
                  <option key={service} value={service}>{service} - ${servicePrices[service]}</option>
                ))}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Staff</FormLabel>
              <Select value={formData.staff} onChange={handleChange('staff')} placeholder="Select staff">
                <option value="John Doe">John Doe</option>
                <option value="Jane Smith">Jane Smith</option>
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Hair Tool</FormLabel>
              <Select value={formData.hairTool} onChange={handleChange('hairTool')} placeholder="Select hair tool">
                <option value="Flat Iron">Flat Iron</option>
                <option value="Curling Iron">Curling Iron</option>
                <option value="Hair Dryer">Hair Dryer</option>
                <option value="Hot Brush">Hot Brush</option>
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Date</FormLabel>
              <Input type="date" value={formData.date} onChange={handleChange('date')} min={new Date().toISOString().split('T')[0]} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Time</FormLabel> {/* Corrected closing tag */}
              <Select value={formData.time} onChange={handleChange('time')} placeholder="Select time">
                {['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'].map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Image</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {formData.imageFile && (
                <Box mt={2} position="relative">
                  <Image src={URL.createObjectURL(formData.imageFile)} alt="Preview" boxSize="100px" borderRadius="md" />
                  <Button
                    size="xs"
                    colorScheme="red"
                    position="absolute"
                    top="-8px"
                    right="-8px"
                    onClick={handleRemoveImage}
                  >
                    X
                  </Button>
                </Box>
              )}
            </FormControl>
            <Button type="submit" colorScheme="teal" mt={4}>
              Book Appointment
            </Button>
          </VStack>
        ) : (
          <VStack spacing={4} textAlign="center">
            <Image
              src={formData.imageFile ? URL.createObjectURL(formData.imageFile) : "https://via.placeholder.com/150"}
              alt="Appointment Confirmation"
              boxSize="150px"
              borderRadius="full"
              objectFit="cover"
            />
            <Text fontWeight="bold">Booking Confirmed!</Text>
            <Text>
              <strong>{formData.customerName}</strong> ({formData.phoneNumber}), your <strong>{formData.service}</strong> with <strong>{formData.staff}</strong> is scheduled for <strong>{formData.date}</strong> at <strong>{formData.time}</strong>.
              <br />Total: <strong>${selectedServicePrice}</strong>
              {formData.imageFile && <br />}Reference image attached.
            </Text>
            <Button colorScheme="teal" onClick={handleBookAnother} mt={4}>
              Book Another Appointment
            </Button>
          </VStack>
        )}
      </MotionBox>
    </ErrorBoundary>
  );
};

export default HairAppointment;