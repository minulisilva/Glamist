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

// Holiday and default themes
const themes = {
  valentines: { primaryColor: 'red.500', secondaryColor: 'pink.300', bgGradient: 'linear(to-r, red.600, pink.400)', sectionBg: 'pink.50' },
  newYear: { primaryColor: 'gold.500', secondaryColor: 'blackAlpha.700', bgGradient: 'linear(to-r, gold.600, blackAlpha.800)', sectionBg: 'gold.50' },
  halloween: { primaryColor: 'orange.500', secondaryColor: 'purple.700', bgGradient: 'linear(to-r, orange.600, purple.800)', sectionBg: 'orange.50' },
  christmas: { primaryColor: 'green.500', secondaryColor: 'red.500', bgGradient: 'linear(to-r, green.600, red.600)', sectionBg: 'green.50' },
  default: { primaryColor: 'purple.600', secondaryColor: 'purple.200', bgGradient: 'linear(to-r, purple.900, transparent)', sectionBg: 'gray.50' },
};

const getThemeKey = (date) => {
  const month = date.getMonth();
  const day = date.getDate();
  if (month === 1 && day === 14) return 'valentines';
  if (month === 0 && day === 1) return 'newYear';
  if (month === 9 && day === 31) return 'halloween';
  if (month === 11 && day === 25) return 'christmas';
  return 'default';
};

const nailServices = [
  { name: 'Manicure', price: 25 },
  { name: 'Pedicure', price: 30 },
  { name: 'Gel Nails', price: 40 },
  { name: 'Nail Art', price: 35 },
  { name: 'Acrylic Nails', price: 45 },
];

const staff = [
  { name: 'Sophie Carter', role: 'Senior Nail Technician', image: 'https://images.unsplash.com/photo-1595955715236-3d874dc93b2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
  { name: 'Lila Nguyen', role: 'Nail Art Specialist', image: 'https://images.unsplash.com/photo-1524504388940-b539e387bb90?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
  { name: 'Emma Rodriguez', role: 'Manicure Expert', image: 'https://images.unsplash.com/photo-1534528744314-0f4679c6412b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
  { name: 'Avery Patel', role: 'Pedicure Specialist', image: 'https://images.unsplash.com/photo-1517841902196-0e72e5e000f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
];

const nailShapes = {
  square: [
    { x: 75, y: 60, w: 50, h: 100 },
    { x: 135, y: 50, w: 40, h: 120 },
    { x: 185, y: 40, w: 40, h: 130 },
    { x: 235, y: 50, w: 40, h: 120 },
    { x: 285, y: 60, w: 35, h: 100 },
  ],
  oval: [
    { x: 75, y: 60, w: 50, h: 100 },
    { x: 135, y: 50, w: 40, h: 120 },
    { x: 185, y: 40, w: 40, h: 130 },
    { x: 235, y: 50, w: 40, h: 120 },
    { x: 285, y: 60, w: 35, h: 100 },
  ],
  stiletto: [
    { x: 75, y: 60, w: 40, h: 110 },
    { x: 130, y: 50, w: 35, h: 130 },
    { x: 180, y: 40, w: 35, h: 140 },
    { x: 230, y: 50, w: 35, h: 130 },
    { x: 280, y: 60, w: 30, h: 110 },
  ],
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

const NailAppointment = () => {
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
  const [nailTool, setNailTool] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Doodle tool state
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#ff69b4');
  const [mode, setMode] = useState('draw');
  const [shape, setShape] = useState('square');
  const [decorationSize, setDecorationSize] = useState(1);
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
    context.lineWidth = 5;
    contextRef.current = context;

    drawNails(context, shape);
  }, [shape]);

  const drawNails = (context, selectedShape) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.fillStyle = '#f5e6cc';
    const coords = nailShapes[selectedShape];

    coords.forEach(({ x, y, w, h }) => {
      context.beginPath();
      if (selectedShape === 'square') {
        context.moveTo(x, y + h);
        context.lineTo(x, y);
        context.lineTo(x + w, y);
        context.lineTo(x + w, y + h);
      } else if (selectedShape === 'oval') {
        context.moveTo(x, y + h);
        context.quadraticCurveTo(x + w / 2, y, x + w, y + h);
        context.lineTo(x + w, y + h + 20);
        context.lineTo(x, y + h + 20);
      } else if (selectedShape === 'stiletto') {
        context.moveTo(x, y + h);
        context.quadraticCurveTo(x + w / 2, y, x + w, y + h);
        context.lineTo(x + w / 2, y + h + 20);
      }
      context.closePath();
      context.fill();
      context.strokeStyle = '#d3b8ae';
      context.lineWidth = 1;
      context.stroke();
    });
  };

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    const context = contextRef.current;
    if (!context) return;

    if (mode === 'draw') {
      context.beginPath();
      context.moveTo(offsetX, offsetY);
      context.strokeStyle = color;
      setIsDrawing(true);
      setHistory([...history, { type: 'drawStart', x: offsetX, y: offsetY, color }]);
    } else if (mode === 'fill') {
      fillNail(offsetX, offsetY);
    } else if (mode === 'delete') {
      undoLastAction();
    } else {
      drawDecoration(offsetX, offsetY);
    }
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing || mode !== 'draw' || !contextRef.current) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offset_)
    contextRef.current.stroke();
    setHistory(history => {
      const last = history[history.length - 1];
      if (last && last.type === 'drawStart') {
        return [...history.slice(0, -1), { ...last, type: 'draw', points: [{ x: offsetX, y: offsetY }] }];
      } else if (last && last.type === 'draw') {
        return [...history.slice(0, -1), { ...last, points: [...last.points, { x: offsetX, y: offsetY }] }];
      }
      return history;
    });
  };

  const stopDrawing = () => {
    if (contextRef.current && mode === 'draw') {
      contextRef.current.closePath();
    }
    setIsDrawing(false);
  };

  const fillNail = (x, y) => {
    const context = contextRef.current;
    const coords = nailShapes[shape];
    const nail = coords.find(n => x >= n.x && x <= n.x + n.w && y >= n.y && y <= n.y + (shape === 'stiletto' ? n.h + 20 : n.h));
    if (nail) {
      context.fillStyle = color;
      context.beginPath();
      if (shape === 'square') {
        context.moveTo(nail.x, nail.y + nail.h);
        context.lineTo(nail.x, nail.y);
        context.lineTo(nail.x + nail.w, nail.y);
        context.lineTo(nail.x + nail.w, nail.y + nail.h);
      } else if (shape === 'oval') {
        context.moveTo(nail.x, nail.y + nail.h);
        context.quadraticCurveTo(nail.x + nail.w / 2, nail.y, nail.x + nail.w, nail.y + nail.h);
        context.lineTo(nail.x + nail.w, nail.y + nail.h + 20);
        context.lineTo(nail.x, nail.y + nail.h + 20);
      } else if (shape === 'stiletto') {
        context.moveTo(nail.x, nail.y + nail.h);
        context.quadraticCurveTo(nail.x + nail.w / 2, nail.y, nail.x + nail.w, nail.y + nail.h);
        context.lineTo(nail.x + nail.w / 2, nail.y + nail.h + 20);
      }
      context.closePath();
      context.fill();
      context.strokeStyle = '#d3b8ae';
      context.lineWidth = 1;
      context.stroke();
      setHistory([...history, { type: 'fill', nailIndex: coords.indexOf(nail), color }]);
    }
  };

  const undoLastAction = () => {
    if (history.length === 0) return;

    const context = contextRef.current;
    drawNails(context, shape);
    const newHistory = history.slice(0, -1);
    setHistory(newHistory);

    newHistory.forEach(action => {
      if (action.type === 'fill') {
        fillNailFromHistory(action);
      } else if (action.type === 'draw') {
        context.beginPath();
        context.strokeStyle = action.color;
        context.moveTo(action.x, action.y);
        action.points.forEach(point => context.lineTo(point.x, point.y));
        context.stroke();
        context.closePath();
      } else if (action.type !== 'drawStart') {
        drawDecorationFromHistory(action);
      }
    });
  };

  const fillNailFromHistory = (action) => {
    const context = contextRef.current;
    const nail = nailShapes[shape][action.nailIndex]; // Fixed typo and added semicolon
    context.fillStyle = action.color;
    context.beginPath();
    if (shape === 'square') {
      context.moveTo(nail.x, nail.y + nail.h);
      context.lineTo(nail.x, nail.y);
      context.lineTo(nail.x + nail.w, nail.y);
      context.lineTo(nail.x + nail.w, nail.y + nail.h);
    } else if (shape === 'oval') {
      context.moveTo(nail.x, nail.y + nail.h);
      context.quadraticCurveTo(nail.x + nail.w / 2, nail.y, nail.x + nail.w, nail.y + nail.h);
      context.lineTo(nail.x + nail.w, nail.y + nail.h + 20);
      context.lineTo(nail.x, nail.y + nail.h + 20);
    } else if (shape === 'stiletto') {
      context.moveTo(nail.x, nail.y + nail.h);
      context.quadraticCurveTo(nail.x + nail.w / 2, nail.y, nail.x + nail.w, nail.y + nail.h);
      context.lineTo(nail.x + nail.w / 2, nail.y + nail.h + 20);
    }
    context.closePath();
    context.fill();
    context.strokeStyle = '#d3b8ae';
    context.lineWidth = 1;
    context.stroke();
  };

  const drawDecoration = (x, y) => {
    const context = contextRef.current;
    context.fillStyle = color;
    const size = 10 * decorationSize;

    if (mode === 'flower') {
      const petalSize = size;
      context.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 72 * Math.PI) / 180;
        context.arc(x + Math.cos(angle) * petalSize, y + Math.sin(angle) * petalSize, petalSize / 2, 0, 2 * Math.PI);
        context.fill();
      }
      context.fillStyle = 'yellow';
      context.beginPath();
      context.arc(x, y, size / 2.5, 0, 2 * Math.PI);
      context.fill();
      setHistory([...history, { type: 'flower', x, y, color, size: decorationSize }]);
    } else if (mode === 'bow') {
      context.beginPath();
      context.moveTo(x - size, y);
      context.quadraticCurveTo(x - size * 1.5, y - size / 2, x - size / 2, y - size);
      context.quadraticCurveTo(x, y - size / 2, x - size, y);
      context.moveTo(x + size, y);
      context.quadraticCurveTo(x + size * 1.5, y - size / 2, x + size / 2, y - size);
      context.quadraticCurveTo(x, y - size / 2, x + size, y);
      context.fill();
      context.beginPath();
      context.moveTo(x - size / 2, y);
      context.lineTo(x - size * 1.5, y + size);
      context.lineTo(x - size / 2, y + size / 2);
      context.moveTo(x + size / 2, y);
      context.lineTo(x + size * 1.5, y + size);
      context.lineTo(x + size / 2, y + size / 2);
      context.fill();
      context.fillStyle = 'white';
      context.beginPath();
      context.arc(x, y, size / 3, 0, 2 * Math.PI);
      context.fill();
      setHistory([...history, { type: 'bow', x, y, color, size: decorationSize }]);
    } else if (mode === 'star') {
      context.beginPath();
      for (let i = 0; i < 5; i++) {
        context.lineTo(x + size * Math.cos((18 + i * 72) * Math.PI / 180), y + size * Math.sin((18 + i * 72) * Math.PI / 180));
        context.lineTo(x + size / 2 * Math.cos((54 + i * 72) * Math.PI / 180), y + size / 2 * Math.sin((54 + i * 72) * Math.PI / 180));
      }
      context.closePath();
      context.fill();
      setHistory([...history, { type: 'star', x, y, color, size: decorationSize }]);
    } else if (mode === 'heart') {
      context.beginPath();
      context.moveTo(x, y + size / 2);
      context.quadraticCurveTo(x - size, y - size / 2, x - size / 2, y - size);
      context.quadraticCurveTo(x, y - size / 2, x + size / 2, y - size);
      context.quadraticCurveTo(x + size, y - size / 2, x, y + size / 2);
      context.closePath();
      context.fill();
      setHistory([...history, { type: 'heart', x, y, color, size: decorationSize }]);
    } else if (mode === 'glitter') {
      for (let i = 0; i < 10; i++) {
        const randX = x + (Math.random() - 0.5) * size * 2;
        const randY = y + (Math.random() - 0.5) * size * 2;
        context.beginPath();
        context.arc(randX, randY, Math.random() * size / 3 + 1, 0, 2 * Math.PI);
        context.fill();
      }
      setHistory([...history, { type: 'glitter', x, y, color, size: decorationSize }]);
    }
  };

  const drawDecorationFromHistory = (action) => {
    const context = contextRef.current;
    context.fillStyle = action.color;
    const size = 10 * action.size;

    if (action.type === 'flower') {
      const petalSize = size;
      context.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 72 * Math.PI) / 180;
        context.arc(action.x + Math.cos(angle) * petalSize, action.y + Math.sin(angle) * petalSize, petalSize / 2, 0, 2 * Math.PI);
        context.fill();
      }
      context.fillStyle = 'yellow';
      context.beginPath();
      context.arc(action.x, action.y, size / 2.5, 0, 2 * Math.PI);
      context.fill();
    } else if (action.type === 'bow') {
      context.beginPath();
      context.moveTo(action.x - size, action.y);
      context.quadraticCurveTo(action.x - size * 1.5, action.y - size / 2, action.x - size / 2, action.y - size);
      context.quadraticCurveTo(action.x, action.y - size / 2, action.x - size, action.y);
      context.moveTo(action.x + size, action.y);
      context.quadraticCurveTo(action.x + size * 1.5, action.y - size / 2, x + size / 2, y - size);
      context.quadraticCurveTo(action.x, action.y - size / 2, action.x + size, action.y);
      context.fill();
      context.beginPath();
      context.moveTo(action.x - size / 2, action.y);
      context.lineTo(action.x - size * 1.5, action.y + size);
      context.lineTo(action.x - size / 2, action.y + size / 2);
      context.moveTo(action.x + size / 2, action.y);
      context.lineTo(action.x + size * 1.5, action.y + size);
      context.lineTo(action.x + size / 2, action.y + size / 2);
      context.fill();
      context.fillStyle = 'white';
      context.beginPath();
      context.arc(action.x, action.y, size / 3, 0, 2 * Math.PI);
      context.fill();
    } else if (action.type === 'star') {
      context.beginPath();
      for (let i = 0; i < 5; i++) {
        context.lineTo(action.x + size * Math.cos((18 + i * 72) * Math.PI / 180), action.y + size * Math.sin((18 + i * 72) * Math.PI / 180));
        context.lineTo(action.x + size / 2 * Math.cos((54 + i * 72) * Math.PI / 180), action.y + size / 2 * Math.sin((54 + i * 72) * Math.PI / 180));
      }
      context.closePath();
      context.fill();
    } else if (action.type === 'heart') {
      context.beginPath();
      context.moveTo(action.x, action.y + size / 2);
      context.quadraticCurveTo(action.x - size, action.y - size / 2, action.x - size / 2, action.y - size);
      context.quadraticCurveTo(action.x, action.y - size / 2, action.x + size / 2, action.y - size);
      context.quadraticCurveTo(action.x + size, action.y - size / 2, action.x, action.y + size / 2);
      context.closePath();
      context.fill();
    } else if (action.type === 'glitter') {
      for (let i = 0; i < 10; i++) {
        const randX = action.x + (Math.random() - 0.5) * size * 2;
        const randY = action.y + (Math.random() - 0.5) * size * 2;
        context.beginPath();
        context.arc(randX, randY, Math.random() * size / 3 + 1, 0, 2 * Math.PI);
        context.fill();
      }
    }
  };

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawNails(context, shape);
      setHistory([]);
    }
  };

  const downloadDesign = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'nail-art-design.png';
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
    formData.append('nailTool', nailTool);
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
    setNailTool('');
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
              Book Your Nail Appointment
            </Heading>
            <Text fontSize={{ base: 'md', md: 'lg' }} color={colorMode === 'light' ? 'gray.600' : 'gray.300'} fontFamily="'Montserrat', sans-serif" textAlign="center" mt={2}>
              Design your perfect nails with our expert team!
            </Text>
          </MotionBox>

          {/* Nail Art Doodle Tool */}
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
              <Heading as="h2" size="md" fontFamily="'Playfair Display', serif" color={currentTheme.primaryColor} textAlign="center">
                Nail Art Studio
              </Heading>
              <Text fontSize="sm" color={colorMode === 'light' ? 'gray.600' : 'gray.300'} fontFamily="'Montserrat', sans-serif" textAlign="center">
                Customize your nails with shapes, colors, and decorations!
              </Text>
              <canvas
                ref={canvasRef}
                width={400}
                height={300}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
                style={{ border: `2px solid ${currentTheme.primaryColor}`, borderRadius: '8px', cursor: 'crosshair', backgroundColor: '#fff' }}
              />
              <VStack spacing={3} w="full">
                <HStack spacing={2} justify="center">
                  <Input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    w="40px"
                    h="40px"
                    p={0}
                    border="none"
                  />
                  <Button
                    onClick={() => setMode('draw')}
                    variant={mode === 'draw' ? 'solid' : 'outline'}
                    colorScheme={currentTheme.primaryColor.split('.')[0]}
                    size="sm"
                    minW="70px"
                  >
                    Draw
                  </Button>
                  <Button
                    onClick={() => setMode('fill')}
                    variant={mode === 'fill' ? 'solid' : 'outline'}
                    colorScheme={currentTheme.primaryColor.split('.')[0]}
                    size="sm"
                    minW="70px"
                  >
                    Fill
                  </Button>
                  <Button
                    onClick={() => setMode('delete')}
                    variant={mode === 'delete' ? 'solid' : 'outline'}
                    colorScheme={currentTheme.primaryColor.split('.')[0]}
                    size="sm"
                    minW="70px"
                  >
                    Undo
                  </Button>
                </HStack>
                <HStack spacing={2} justify="center" wrap="wrap">
                  <Button
                    onClick={() => setMode('flower')}
                    variant={mode === 'flower' ? 'solid' : 'outline'}
                    colorScheme={currentTheme.primaryColor.split('.')[0]}
                    size="sm"
                    minW="70px"
                  >
                    Flower
                  </Button>
                  <Button
                    onClick={() => setMode('bow')}
                    variant={mode === 'bow' ? 'solid' : 'outline'}
                    colorScheme={currentTheme.primaryColor.split('.')[0]}
                    size="sm"
                    minW="70px"
                  >
                    Bow
                  </Button>
                  <Button
                    onClick={() => setMode('star')}
                    variant={mode === 'star' ? 'solid' : 'outline'}
                    colorScheme={currentTheme.primaryColor.split('.')[0]}
                    size="sm"
                    minW="70px"
                  >
                    Star
                  </Button>
                  <Button
                    onClick={() => setMode('heart')}
                    variant={mode === 'heart' ? 'solid' : 'outline'}
                    colorScheme={currentTheme.primaryColor.split('.')[0]}
                    size="sm"
                    minW="70px"
                  >
                    Heart
                  </Button>
                  <Button
                    onClick={() => setMode('glitter')}
                    variant={mode === 'glitter' ? 'solid' : 'outline'}
                    colorScheme={currentTheme.primaryColor.split('.')[0]}
                    size="sm"
                    minW="70px"
                  >
                    Glitter
                  </Button>
                </HStack>
                <HStack spacing={2} justify="space-between" w="full">
                  <Select
                    value={shape}
                    onChange={(e) => setShape(e.target.value)}
                    size="sm"
                    w="100px"
                  >
                    <option value="square">Square</option>
                    <option value="oval">Oval</option>
                    <option value="stiletto">Stiletto</option>
                  </Select>
                  <Button
                    onClick={resetCanvas}
                    variant="outline"
                    colorScheme={currentTheme.primaryColor.split('.')[0]}
                    size="sm"
                    minW="70px"
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={downloadDesign}
                    colorScheme={currentTheme.primaryColor.split('.')[0]}
                    size="sm"
                    minW="70px"
                  >
                    Download
                  </Button>
                </HStack>
                <HStack w="full" align="center" spacing={4}>
                  <Text fontSize="sm" color={currentTheme.primaryColor} minW="100px">
                    Decoration Size:
                  </Text>
                  <Slider
                    value={decorationSize * 50}
                    min={25}
                    max={100}
                    step={5}
                    onChange={(val) => setDecorationSize(val / 50)}
                    w="full"
                  >
                    <SliderTrack bg="gray.200">
                      <SliderFilledTrack bg={currentTheme.primaryColor} />
                    </SliderTrack>
                    <SliderThumb boxSize={6} />
                  </Slider>
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
                <VStack spacing={4} as="form" onSubmit={handleSubmit}>
                  <FormControl isRequired>
                    <FormLabel fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>Customer Name</FormLabel>
                    <Input
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
                      borderColor={currentTheme.secondaryColor}
                      _focus={{ borderColor: currentTheme.primaryColor }}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>Phone Number</FormLabel>
                    <Input
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
                      borderColor={currentTheme.secondaryColor}
                      _focus={{ borderColor: currentTheme.primaryColor }}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>Email</FormLabel>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
                      borderColor={currentTheme.secondaryColor}
                      _focus={{ borderColor: currentTheme.primaryColor }}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>Service</FormLabel>
                    <Select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      placeholder="Select service"
                      bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
                      borderColor={currentTheme.secondaryColor}
                      _focus={{ borderColor: currentTheme.primaryColor }}
                    >
                      <option value="Manicure">Manicure</option>
                      <option value="Pedicure">Pedicure</option>
                      <option value="Gel Nails">Gel Nails</option>
                      <option value="Nail Art">Nail Art</option>
                      <option value="Acrylic Nails">Acrylic Nails</option>
                    </Select>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>Staff</FormLabel>
                    <Select
                      value={selectedStaff}
                      onChange={(e) => setSelectedStaff(e.target.value)}
                      placeholder="Select staff"
                      bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
                      borderColor={currentTheme.secondaryColor}
                      _focus={{ borderColor: currentTheme.primaryColor }}
                    >
                      {staff.map((member) => (
                        <option key={member.name} value={member.name}>{member.name}</option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>Nail Tool</FormLabel>
                    <Select
                      value={nailTool}
                      onChange={(e) => setNailTool(e.target.value)}
                      placeholder="Select nail tool"
                      bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
                      borderColor={currentTheme.secondaryColor}
                      _focus={{ borderColor: currentTheme.primaryColor }}
                    >
                      <option value="Nail File">Nail File</option>
                      <option value="Cuticle Pusher">Cuticle Pusher</option>
                      <option value="Nail Brush">Nail Brush</option>
                      <option value="UV Lamp">UV Lamp</option>
                    </Select>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>Date</FormLabel>
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
                      borderColor={currentTheme.secondaryColor}
                      _focus={{ borderColor: currentTheme.primaryColor }}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>Time</FormLabel>
                    <Input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
                      borderColor={currentTheme.secondaryColor}
                      _focus={{ borderColor: currentTheme.primaryColor }}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>Price</FormLabel>
                    <Input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
                      borderColor={currentTheme.secondaryColor}
                      _focus={{ borderColor: currentTheme.primaryColor }}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>Image</FormLabel>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
                      borderColor={currentTheme.secondaryColor}
                      _focus={{ borderColor: currentTheme.primaryColor }}
                      p={1}
                    />
                    {imageFile && (
                      <Image
                        src={URL.createObjectURL(imageFile)}
                        alt="Preview"
                        maxH="200px"
                        mt={2}
                        borderRadius="md"
                        border="2px solid"
                        borderColor={currentTheme.secondaryColor}
                      />
                    )}
                  </FormControl>
                  <Button
                    type="submit"
                    colorScheme={currentTheme.primaryColor.split('.')[0]}
                    mt={4}
                    size="lg"
                    borderRadius="full"
                    _hover={{ transform: 'scale(1.05)', boxShadow: 'lg' }}
                    fontFamily="'Montserrat', sans-serif"
                  >
                    Book Appointment
                  </Button>
                </VStack>
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
                    src={imageFile ? URL.createObjectURL(imageFile) : 'https://images.unsplash.com/photo-1595955715236-3d874dc93b2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'}
                    alt="Nail Appointment Confirmation"
                    boxSize="150px"
                    borderRadius="full"
                    objectFit="cover"
                    border="3px solid"
                    borderColor={currentTheme.primaryColor}
                  />
                  <Heading as="h2" size="lg" fontFamily="'Playfair Display', serif" color={currentTheme.primaryColor}>
                    Booking Confirmed!
                  </Heading>
                  <Text fontSize="md" color={colorMode === 'light' ? 'gray.600' : 'gray.300'} fontFamily="'Montserrat', sans-serif">
                    <strong>{customerName}</strong> ({phoneNumber}), your <strong>{selectedService}</strong> with <strong>{selectedStaff}</strong> is scheduled for <strong>{date}</strong> at <strong>{time}</strong>.
                    <br />
                    Tool: <strong>{nailTool}</strong>
                    <br />
                    Total: <strong>${price}</strong>
                    {imageFile && <><br />Reference image attached.</>}
                  </Text>
                  <Button
                    onClick={handleBookAnother}
                    colorScheme={currentTheme.primaryColor.split('.')[0]}
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
          </ErrorBoundary>

          {/* Staff Preview */}
          <VStack spacing={6}>
            <Heading as="h2" size="lg" fontFamily="'Playfair Display', serif" color={currentTheme.primaryColor} textAlign="center">
              Our Nail Technicians
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
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
                    <Text fontSize="lg" fontWeight="bold" fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>
                      {member.name}
                    </Text>
                    <Text fontSize="md" color={colorMode === 'light' ? 'gray.600' : 'gray.300'} fontFamily="'Montserrat', sans-serif">
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
  );
};

export default NailAppointment;