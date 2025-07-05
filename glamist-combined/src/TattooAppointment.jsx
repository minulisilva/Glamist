import React, { useState, useEffect, useRef } from 'react';
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
  useColorMode,
  useToast,
  Image,
  Flex,
  HStack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import axios from 'axios';

const MotionBox = motion(Box);

// Themes
const themes = {
  default: { primaryColor: 'purple.600', secondaryColor: 'purple.200', bgGradient: 'linear(to-r, purple.900, transparent)', sectionBg: 'gray.50' },
  halloween: { primaryColor: 'orange.500', secondaryColor: 'purple.700', bgGradient: 'linear(to-r, orange.600, purple.800)', sectionBg: 'orange.50' },
};

const getThemeKey = (date) => {
  const month = date.getMonth();
  const day = date.getDate();
  if (month === 9 && day === 31) return 'halloween';
  return 'default';
};

// Tattoo services
const tattooServices = [
  { name: 'Small Tattoo', price: 50 },
  { name: 'Medium Tattoo', price: 100 },
  { name: 'Full Sleeve', price: 300 },
  { name: 'Custom Design', price: 150 },
  { name: 'Piercing', price: 40 },
];

// Tattoo staff
const staff = [
  { name: 'Jake Black', role: 'Tattoo Artist', image: 'https://images.unsplash.com/photo-1519241045447-1a6137399439?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
  { name: 'Mia Thorn', role: 'Piercing Specialist', image: 'https://images.unsplash.com/photo-1525874684015-0c9b7e1b51d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
  { name: 'Leo Ink', role: 'Senior Tattoo Artist', image: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d41?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
];

// Realistic skin tones
const skinTones = {
  veryLight: '#f4e4d0',
  light: '#e8d5b9',
  mediumLight: '#d4b996',
  medium: '#c68e70',
  mediumDark: '#a67458',
  dark: '#7e4e38',
  veryDark: '#4a2c1f',
};

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

const TattooAppointment = () => {
  const { colorMode } = useColorMode();
  const toast = useToast();

  // Form state
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Design studio state
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushType, setBrushType] = useState('fineLine');
  const [brushSize, setBrushSize] = useState(5);
  const [brushOpacity, setBrushOpacity] = useState(1);
  const [eraserSize, setEraserSize] = useState(5);
  const [skinTone, setSkinTone] = useState('medium');
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [history, setHistory] = useState([]);

  // Theme setup
  const currentDate = new Date();
  const themeKey = getThemeKey(currentDate);
  const currentTheme = themes[themeKey];

  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    contextRef.current = context;
    redrawCanvas();
  }, [skinTone, brushSize, brushOpacity, eraserSize]);

  const drawSkinBase = (context, tone) => {
    context.fillStyle = skinTones[tone];
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  };

  const redrawCanvas = () => {
    const context = contextRef.current;
    if (!context) return;
    drawSkinBase(context, skinTone);
    history.forEach(action => {
      if (action.type === 'draw') {
        context.beginPath();
        context.strokeStyle = action.isEraser ? skinTones[action.skinTone] : action.color;
        context.globalAlpha = action.opacity;
        context.lineWidth = action.isEraser ? action.eraserSize : action.size;
        context.moveTo(action.x, action.y);
        action.points.forEach(point => {
          context.lineTo(point.x, point.y);
          if (action.brushType === 'stippling' && !action.isEraser) {
            context.beginPath();
            context.arc(point.x, point.y, action.size / 4, 0, Math.PI * 2);
            context.fillStyle = action.color;
            context.fill();
          }
        });
        if ((action.brushType === 'fineLine' || action.brushType === 'shading') || action.isEraser) {
          context.stroke();
        }
        context.globalAlpha = 1.0;
      }
    });
  };

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    const context = contextRef.current;
    if (!context) return;

    context.beginPath();
    context.moveTo(offsetX, offsetY);
    const isEraser = brushType === 'eraser';
    context.strokeStyle = isEraser ? skinTones[skinTone] : color;
    context.lineWidth = isEraser ? eraserSize : brushSize;
    context.globalAlpha = isEraser ? 1 : brushOpacity;

    if (brushType === 'shading' && !isEraser) {
      context.lineWidth = brushSize * 2;
      context.globalAlpha = brushOpacity * 0.5;
    } else if (brushType === 'stippling' && !isEraser) {
      context.beginPath();
      context.arc(offsetX, offsetY, brushSize / 4, 0, Math.PI * 2);
      context.fillStyle = color;
      context.fill();
    }

    setIsDrawing(true);
    setHistory([...history, { 
      type: 'draw', 
      brushType: isEraser ? 'fineLine' : brushType,
      isEraser,
      x: offsetX, 
      y: offsetY, 
      color, 
      size: brushSize, 
      eraserSize: eraserSize,
      opacity: isEraser ? 1 : brushOpacity, 
      skinTone, 
      points: [{ x: offsetX, y: offsetY }]
    }]);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing || !contextRef.current) return;
    const { offsetX, offsetY } = nativeEvent;
    const context = contextRef.current;

    context.lineTo(offsetX, offsetY);
    const isEraser = brushType === 'eraser';
    if ((brushType === 'fineLine' || brushType === 'shading') || isEraser) {
      context.stroke();
    } else if (brushType === 'stippling' && !isEraser) {
      context.beginPath();
      context.arc(offsetX, offsetY, brushSize / 4, 0, Math.PI * 2);
      context.fillStyle = color;
      context.fill();
    }

    setHistory(history => {
      const last = history[history.length - 1];
      if (last && last.type === 'draw') {
        return [...history.slice(0, -1), { ...last, points: [...last.points, { x: offsetX, y: offsetY }] }];
      }
      return history;
    });
  };

  const stopDrawing = () => {
    if (contextRef.current) {
      contextRef.current.closePath();
      contextRef.current.globalAlpha = 1.0;
    }
    setIsDrawing(false);
    redrawCanvas();
  };

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, context.canvas.height);
      drawSkinBase(context, skinTone);
      setHistory([]);
    }
  };

  const downloadDesign = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'tattoo-design.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerName || !phoneNumber || !email || !selectedService || !selectedStaff || !date || !time || !price) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
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

    const formData = new FormData();
    formData.append('customerName', customerName);
    formData.append('phoneNumber', phoneNumber);
    formData.append('email', email);
    formData.append('service', selectedService);
    formData.append('staff', selectedStaff);
    formData.append('date', formattedDate);
    formData.append('time', time);
    formData.append('price', price);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const response = await axios.post('http://127.0.0.1:4000/api/hair-appointments/book', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast({
        title: 'Success',
        description: response.data.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setIsSubmitted(true);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to book appointment. Please try again.';
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error('Error booking appointment:', error.response?.data || error.message);
    }
  };

  const handleBookAnother = () => {
    setCustomerName('');
    setPhoneNumber('');
    setEmail('');
    setSelectedService('');
    setSelectedStaff('');
    setDate('');
    setTime('');
    setPrice('');
    setImageFile(null);
    setIsSubmitted(false);
  };

  return (
    <Box minH="100vh" bg={colorMode === 'light' ? currentTheme.sectionBg : 'gray.900'} py={{ base: 12, md: 16 }}>
      <Container maxW="container.xl">
        <VStack spacing={10} align="stretch">
          {/* Header */}
          <MotionBox initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Heading as="h1" size={{ base: 'xl', md: '2xl' }} fontFamily="'Playfair Display', serif" color={currentTheme.primaryColor} textAlign="center">
              Book Your Tattoo Appointment
            </Heading>
            <Text fontSize={{ base: 'md', md: 'lg' }} color={colorMode === 'light' ? 'gray.600' : 'gray.300'} fontFamily="'Montserrat', sans-serif" textAlign="center" mt={2}>
              Design your perfect tattoo with our expert artists!
            </Text>
          </MotionBox>

          {/* Tattoo Design Studio */}
          <MotionBox
            p={{ base: 6, md: 8 }}
            bg={colorMode === 'light' ? 'white' : 'gray.800'}
            borderRadius="xl"
            boxShadow="lg"
            border="1px solid"
            borderColor={currentTheme.secondaryColor}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            w="full"
            maxW="500px"
            mx="auto"
          >
            <VStack spacing={4} align="center">
              <Heading as="h2" size="md" fontFamily="'Playfair Display', serif" color={currentTheme.primaryColor}>
                Tattoo Design Studio
              </Heading>
              <Text fontSize="sm" color={colorMode === 'light' ? 'gray.600' : 'gray.300'} fontFamily="'Montserrat', sans-serif">
                Sketch your tattoo with different brushes or erase mistakes!
              </Text>
              <canvas
                ref={canvasRef}
                width={400}
                height={300}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
                style={{ border: `2px solid ${currentTheme.primaryColor}`, borderRadius: '8px', cursor: 'crosshair' }}
              />
              <VStack spacing={3} w="full">
                <HStack spacing={2} justify="center">
                  <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} w="40px" h="40px" p={0} border="none" />
                  <Select value={brushType} onChange={(e) => setBrushType(e.target.value)} size="sm" w="120px">
                    <option value="fineLine">Fine Line</option>
                    <option value="shading">Shading</option>
                    <option value="stippling">Stippling</option>
                    <option value="eraser">Eraser</option>
                  </Select>
                  <Button onClick={resetCanvas} variant="outline" colorScheme={currentTheme.primaryColor.split('.')[0]} size="sm" minW="70px">
                    Reset
                  </Button>
                  <Button onClick={downloadDesign} colorScheme={currentTheme.primaryColor.split('.')[0]} size="sm" minW="70px">
                    Download
                  </Button>
                </HStack>
                {brushType !== 'eraser' ? (
                  <>
                    <HStack w="full" align="center" spacing={4}>
                      <Text fontSize="sm" color={currentTheme.primaryColor} minW="80px">Brush Size:</Text>
                      <Slider value={brushSize} min={1} max={20} onChange={(val) => setBrushSize(val)} w="full">
                        <SliderTrack bg="gray.200"><SliderFilledTrack bg={currentTheme.primaryColor} /></SliderTrack>
                        <SliderThumb boxSize={6} />
                      </Slider>
                    </HStack>
                    <HStack w="full" align="center" spacing={4}>
                      <Text fontSize="sm" color={currentTheme.primaryColor} minW="80px">Opacity:</Text>
                      <Slider value={brushOpacity * 100} min={10} max={100} onChange={(val) => setBrushOpacity(val / 100)} w="full">
                        <SliderTrack bg="gray.200"><SliderFilledTrack bg={currentTheme.primaryColor} /></SliderTrack>
                        <SliderThumb boxSize={6} />
                      </Slider>
                    </HStack>
                  </>
                ) : (
                  <HStack w="full" align="center" spacing={4}>
                    <Text fontSize="sm" color={currentTheme.primaryColor} minW="80px">Eraser Size:</Text>
                    <Slider value={eraserSize} min={1} max={20} onChange={(val) => setEraserSize(val)} w="full">
                      <SliderTrack bg="gray.200"><SliderFilledTrack bg={currentTheme.primaryColor} /></SliderTrack>
                      <SliderThumb boxSize={6} />
                    </Slider>
                  </HStack>
                )}
                <HStack spacing={2} justify="center">
                  <Text fontSize="sm" color={currentTheme.primaryColor}>Skin Tone:</Text>
                  <Select value={skinTone} onChange={(e) => setSkinTone(e.target.value)} size="sm" w="120px">
                    <option value="veryLight">Very Light</option>
                    <option value="light">Light</option>
                    <option value="mediumLight">Medium Light</option>
                    <option value="medium">Medium</option>
                    <option value="mediumDark">Medium Dark</option>
                    <option value="dark">Dark</option>
                    <option value="veryDark">Very Dark</option>
                  </Select>
                </HStack>
              </VStack>
            </VStack>
          </MotionBox>

          {/* Booking Form or Confirmation */}
          <ErrorBoundary>
            {!isSubmitted ? (
              <MotionBox
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                p={{ base: 6, md: 8 }}
                bg={colorMode === 'light' ? 'white' : 'gray.800'}
                borderRadius="xl"
                boxShadow="lg"
                border="1px solid"
                borderColor={currentTheme.secondaryColor}
                maxW="500px"
                mx="auto"
              >
                <form onSubmit={handleSubmit}>
                  <VStack spacing={6} align="stretch">
                    <FormControl isRequired>
                      <FormLabel fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>Customer Name</FormLabel>
                      <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} borderColor={currentTheme.secondaryColor} _focus={{ borderColor: currentTheme.primaryColor }} />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>Phone Number</FormLabel>
                      <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} borderColor={currentTheme.secondaryColor} _focus={{ borderColor: currentTheme.primaryColor }} />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>Email</FormLabel>
                      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} borderColor={currentTheme.secondaryColor} _focus={{ borderColor: currentTheme.primaryColor }} />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>Tattoo Service</FormLabel>
                      <Select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} placeholder="Select a service" bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} borderColor={currentTheme.secondaryColor} _focus={{ borderColor: currentTheme.primaryColor }}>
                        {tattooServices.map((service) => (
                          <option key={service.name} value={service.name}>{service.name}</option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>Artist</FormLabel>
                      <Select value={selectedStaff} onChange={(e) => setSelectedStaff(e.target.value)} placeholder="Choose an artist" bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} borderColor={currentTheme.secondaryColor} _focus={{ borderColor: currentTheme.primaryColor }}>
                        {staff.map((member) => (
                          <option key={member.name} value={member.name}>{member.name}</option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>Date</FormLabel>
                      <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} borderColor={currentTheme.secondaryColor} _focus={{ borderColor: currentTheme.primaryColor }} />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>Time</FormLabel>
                      <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} borderColor={currentTheme.secondaryColor} _focus={{ borderColor: currentTheme.primaryColor }} />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>Price</FormLabel>
                      <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} borderColor={currentTheme.secondaryColor} _focus={{ borderColor: currentTheme.primaryColor }} />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>Upload Reference Image (Optional)</FormLabel>
                      <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} borderColor={currentTheme.secondaryColor} _focus={{ borderColor: currentTheme.primaryColor }} p={1} />
                      {imageFile && <Image src={URL.createObjectURL(imageFile)} alt="Preview" maxH="200px" mt={2} borderRadius="md" border="2px solid" borderColor={currentTheme.secondaryColor} />}
                    </FormControl>
                    <Button type="submit" colorScheme={currentTheme.primaryColor.split('.')[0]} size="lg" borderRadius="full" _hover={{ transform: 'scale(1.05)', boxShadow: 'lg' }} fontFamily="'Montserrat', sans-serif">
                      Book Appointment
                    </Button>
                  </VStack>
                </form>
              </MotionBox>
            ) : (
              <MotionBox
                p={{ base: 6, md: 8 }}
                bg={colorMode === 'light' ? 'white' : 'gray.800'}
                borderRadius="xl"
                boxShadow="lg"
                border="1px solid"
                borderColor={currentTheme.secondaryColor}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                textAlign="center"
                maxW="500px"
                mx="auto"
              >
                <VStack spacing={6}>
                  <Image
                    src={imageFile ? URL.createObjectURL(imageFile) : 'https://images.unsplash.com/photo-1519241045447-1a6137399439?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'}
                    alt="Tattoo Appointment Confirmation"
                    boxSize="150px"
                    borderRadius="full"
                    objectFit="cover"
                    border="3px solid"
                    borderColor={currentTheme.primaryColor}
                  />
                  <Heading as="h2" size="lg" fontFamily="'Playfair Display', serif" color={currentTheme.primaryColor}>Booking Confirmed!</Heading>
                  <Text fontSize="md" color={colorMode === 'light' ? 'gray.600' : 'gray.300'} fontFamily="'Montserrat', sans-serif">
                    <strong>{customerName}</strong> ({phoneNumber}), your <strong>{selectedService}</strong> with <strong>{selectedStaff}</strong> is scheduled for <strong>{date}</strong> at <strong>{time}</strong>.
                    <br />
                    Total: <strong>${price}</strong> - Please proceed to payment.
                    {imageFile && <><br />Reference image attached.</>}
                  </Text>
                  <Button as="a" href="/payment" colorScheme={currentTheme.primaryColor.split('.')[0]} size="md" borderRadius="full" _hover={{ transform: 'scale(1.05)', boxShadow: 'lg' }} fontFamily="'Montserrat', sans-serif">
                    Go to Payment
                  </Button>
                  <Button onClick={handleBookAnother} variant="outline" colorScheme={currentTheme.primaryColor.split('.')[0]} size="md" borderRadius="full" _hover={{ transform: 'scale(1.05)', boxShadow: 'lg' }} fontFamily="'Montserrat', sans-serif">
                    Schedule Another Appointment
                  </Button>
                </VStack>
              </MotionBox>
            )}
          </ErrorBoundary>

          {/* Staff Preview */}
          <VStack spacing={6}>
            <Heading as="h2" size="lg" fontFamily="'Playfair Display', serif" color={currentTheme.primaryColor} textAlign="center">
              Our Tattoo Artists
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {staff.map((member) => (
                <MotionBox
                  key={member.name}
                  p={4}
                  bg={colorMode === 'light' ? 'white' : 'gray.800'}
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
                    <Text fontSize="lg" fontWeight="bold" fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>{member.name}</Text>
                    <Text fontSize="md" color={colorMode === 'light' ? 'gray.600' : 'gray.300'} fontFamily="'Montserrat', sans-serif">{member.role}</Text>
                  </VStack>
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default TattooAppointment;