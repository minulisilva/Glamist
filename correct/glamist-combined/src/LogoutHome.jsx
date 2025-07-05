import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Link,
  Flex,
  Button,
  IconButton,
  useColorMode,
  useBreakpointValue,
  Icon,
  Grid,
  GridItem,
  Image,
} from '@chakra-ui/react';
import { FaAward, FaArrowLeft, FaArrowRight, FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Chatbot from './Chatbot'; // Adjust path as needed
import { useLanguage } from './LanguageContext'; // Adjust path as needed
import { useTheme } from './ThemeContext'; // Import ThemeContext

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

// Sample data for Featured Services with Bridal added (unchanged)
const services = [
  { title: 'Hair Styling', description: 'Transform your look with expert cuts, colors, and styles.', img: 'https://images.unsplash.com/photo-1604948913047-52e8636e6dd0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80', link: '/hair' },
  { title: 'Nail Art', description: 'Pamper your hands and feet with stunning nail designs.', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80', link: '/nail' },
  { title: 'Tattoo Design', description: 'Express yourself with custom, high-quality tattoos.', img: 'https://images.unsplash.com/photo-1530305408560-82d13781b33a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80', link: '/tattoo' },
  { title: 'Piercings', description: 'Add a bold touch with professional piercing services.', img: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80', link: '/piercings' },
  { title: 'Skin Care', description: 'Glow with personalized skin treatments and facials.', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80', link: '/skin' },
  { title: 'Bridal', description: 'Look stunning on your special day with our bridal packages.', img: 'https://images.unsplash.com/photo-1524850011238-e3f5292ae47f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80', link: '/bridal' },
];

// Sample data for Awards (unchanged)
const awards = [
  { title: 'Best Salon 2024', description: 'Awarded by Beauty Magazine for excellence in service.', icon: FaAward },
  { title: 'Top Hair Styling Award', description: 'Recognized by Hair Trends for innovative styles.', icon: FaAward },
  { title: 'Customer Choice 2023', description: 'Voted #1 by our loyal clients.', icon: FaAward },
];

// Sample data for testimonials (unchanged)
const testimonials = [
  { name: 'Jane Doe', text: 'Glamist transformed my salon experience!', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80' },
  { name: 'Joana Smith', text: 'The best salon I’ve ever gone to.', img: 'https://www.perfocal.com/blog/content/images/size/w960/2021/01/Perfocal_17-11-2019_TYWFAQ_100_standard-3.jpg' },
  { name: 'Alex Carter', text: 'Amazing service and incredible results!', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80' },
];

const Home = () => {
  const { colorMode } = useColorMode();
  const buttonSize = useBreakpointValue({ base: 'sm', md: 'md', lg: 'lg' });
  const headingSize = useBreakpointValue({ base: '2xl', md: '4xl', lg: '5xl' });
  const { t } = useLanguage();
  const { themeKey, currentTheme, currentBackgroundImages } = useTheme(); // Use ThemeContext

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  // Slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % currentBackgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentBackgroundImages]);

  // Testimonial carousel effect
  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonialIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(testimonialInterval);
  }, []);

  const goToPrevTestimonial = () => {
    setCurrentTestimonialIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1));
  };

  const goToNextTestimonial = () => {
    setCurrentTestimonialIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  return (
    <Box minH="100vh" bg={colorMode === 'light' ? 'gray.50' : 'gray.900'} overflowX="hidden" position="relative">
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
            boxShadow="0 0 15px rgba(255, 215, 0, 0.8)" // Exact match with ContactUs
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
            boxShadow="0 0 10px rgba(255, 165, 0, 0.6)" // Exact match with ContactUs
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

      {/* Hero Section with Slideshow */}
      <MotionBox
        minH={{ base: '80vh', md: '100vh' }}
        bgImage={`url(${currentBackgroundImages[currentImageIndex]})`}
        bgSize="cover"
        bgPosition="center"
        position="relative"
        display="flex"
        alignItems="center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      >
        <Box position="absolute" top={0} left={0} right={0} bottom={0} bgGradient={currentTheme.bgGradient} opacity={0.7} />
        <Container maxW="container.lg" zIndex={2}>
          <VStack spacing={8} align="start" color="white">
            <Heading as="h2" size={headingSize} fontFamily="'Playfair Display', serif" fontWeight="extrabold" textShadow="2px 2px 8px rgba(0, 0, 0, 0.3)">
              {t('welcome')}
            </Heading>
            <Text fontSize={{ base: 'xl', md: '2xl' }} fontFamily="'Montserrat', sans-serif" maxW="700px" textShadow="1px 1px 4px rgba(0, 0, 0, 0.2)">
              {t('heroText')}
            </Text>
            <Flex gap={4} flexWrap="wrap">
           
              <Button
                as={Link}
                href="/our-work"
                size={buttonSize}
                bg="transparent"
                color="white"
                border="2px solid white"
                borderRadius="full"
                _hover={{ bg: 'white', color: currentTheme.primaryColor, transform: 'scale(1.05)' }}
                boxShadow="md"
              >
                {t('ourWork')}
              </Button>
            </Flex>
          </VStack>
        </Container>
      </MotionBox>

      {/* Featured Services Section */}
      <Box py={{ base: 16, md: 24 }} bg={colorMode === 'light' ? 'white' : 'gray.800'}>
        <Container maxW="container.xl">
          <VStack spacing={12} align="center">
            <Heading as="h3" size="2xl" fontFamily="'Playfair Display', serif" color={colorMode === 'light' ? currentTheme.primaryColor : currentTheme.secondaryColor} textAlign="center">
              {t('servicesTitle')}
            </Heading>
            <Text fontSize="lg" fontFamily="'Montserrat', sans-serif" color={colorMode === 'light' ? 'gray.600' : 'gray.300'} textAlign="center" maxW="600px">
              {t('servicesText')}
            </Text>
            <Grid 
              templateColumns={{ 
                base: 'repeat(1, 1fr)', 
                sm: 'repeat(2, 1fr)', 
                md: 'repeat(3, 1fr)', 
                lg: 'repeat(6, 1fr)' 
              }} 
              gap={{ base: 4, md: 8 }} 
              w="full" 
              overflowX="auto"
            >
              {services.map((service, index) => (
                <MotionBox
                  key={index}
                  bg={colorMode === 'light' ? 'white' : 'gray.700'}
                  borderRadius="xl"
                  overflow="hidden"
                  boxShadow="lg"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  _hover={{ transform: 'translateY(-10px)', boxShadow: 'xl' }}
                  minW={{ base: '200px', md: '220px' }}
                >
                  <Image src={service.img} alt={service.title} h={{ base: '150px', md: '200px' }} objectFit="cover" />
                  <Box p={{ base: 4, md: 6 }} textAlign="center">
                    <Heading as="h4" size={{ base: 'sm', md: 'md' }} fontFamily="'Playfair Display', serif" color={currentTheme.primaryColor} mb={2}>
                      {service.title}
                    </Heading>
                    <Text fontFamily="'Montserrat', sans-serif" color="gray.600" fontSize={{ base: 'sm', md: 'md' }} mb={4}>
                      {service.description}
                    </Text>
                    <Button
                      as={Link}
                      href={service.link}
                      colorScheme={currentTheme.primaryColor.split('.')[0]}
                      size={{ base: 'xs', md: 'sm' }}
                      borderRadius="full"
                      variant="outline"
                    >
                      {t('bookNow')}
                    </Button>
                  </Box>
                </MotionBox>
              ))}
            </Grid>
          </VStack>
        </Container>
      </Box>

      {/* Awards Section */}
      <Box py={{ base: 16, md: 24 }} bg={colorMode === 'light' ? currentTheme.sectionBg : 'gray.900'}>
        <Container maxW="container.xl">
          <VStack spacing={12} align="center">
            <Heading as="h3" size="2xl" fontFamily="'Playfair Display', serif" color={colorMode === 'light' ? currentTheme.primaryColor : currentTheme.secondaryColor} textAlign="center">
              {t('awardsTitle')}
            </Heading>
            <Text fontSize="lg" fontFamily="'Montserrat', sans-serif" color={colorMode === 'light' ? 'gray.600' : 'gray.300'} textAlign="center" maxW="600px">
              {t('awardsText')}
            </Text>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={8} w="full">
              {awards.map((award, index) => (
                <MotionBox
                  key={index}
                  bg={colorMode === 'light' ? 'white' : 'gray.700'}
                  borderRadius="xl"
                  p={6}
                  boxShadow="lg"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  _hover={{ transform: 'translateY(-10px)', boxShadow: 'xl' }}
                >
                  <Flex direction="column" align="center" textAlign="center">
                    <Icon as={award.icon} boxSize={12} color={currentTheme.primaryColor} mb={4} />
                    <Heading as="h4" size="md" fontFamily="'Playfair Display', serif" color={currentTheme.primaryColor} mb={2}>
                      {award.title}
                    </Heading>
                    <Text fontFamily="'Montserrat', sans-serif" color={colorMode === 'light' ? 'gray.600' : 'gray.300'}>
                      {award.description}
                    </Text>
                  </Flex>
                </MotionBox>
              ))}
            </Grid>
          </VStack>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box py={{ base: 16, md: 24 }} bg={colorMode === 'light' ? currentTheme.sectionBg : `${currentTheme.primaryColor.split('.')[0]}.900`}>
        <Container maxW="container.xl">
          <VStack spacing={12} align="center">
            <Heading as="h3" size="2xl" fontFamily="'Playfair Display', serif" color={colorMode === 'light' ? currentTheme.primaryColor : currentTheme.secondaryColor}>
              {t('testimonialsTitle')}
            </Heading>
            <Box w="full" position="relative">
              <MotionBox
                key={currentTestimonialIndex}
                bg={colorMode === 'light' ? 'white' : 'gray.700'}
                p={6}
                borderRadius="xl"
                boxShadow="md"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                maxW={{ base: '100%', md: '600px' }}
                mx="auto"
              >
                <Flex align="center" mb={4}>
                  <Image
                    src={testimonials[currentTestimonialIndex].img}
                    alt={testimonials[currentTestimonialIndex].name}
                    boxSize="60px"
                    borderRadius="full"
                    mr={4}
                  />
                  <Text fontFamily="'Montserrat', sans-serif" fontWeight="bold" color={colorMode === 'light' ? currentTheme.primaryColor : currentTheme.secondaryColor}>
                    {testimonials[currentTestimonialIndex].name}
                  </Text>
                </Flex>
                <Text fontFamily="'Montserrat', sans-serif" color={colorMode === 'light' ? 'gray.600' : 'gray.300'} fontStyle="italic">
                  "{testimonials[currentTestimonialIndex].text}"
                </Text>
              </MotionBox>
              <IconButton
                aria-label="Previous Testimonial"
                icon={<FaArrowLeft />}
                onClick={goToPrevTestimonial}
                position="absolute"
                top="50%"
                left={{ base: '0', md: '-60px' }}
                transform="translateY(-50%)"
                colorScheme={currentTheme.primaryColor.split('.')[0]}
                borderRadius="full"
                size="md"
                zIndex={1}
              />
              <IconButton
                aria-label="Next Testimonial"
                icon={<FaArrowRight />}
                onClick={goToNextTestimonial}
                position="absolute"
                top="50%"
                right={{ base: '0', md: '-60px' }}
                transform="translateY(-50%)"
                colorScheme={currentTheme.primaryColor.split('.')[0]}
                borderRadius="full"
                size="md"
                zIndex={1}
              />
              <Flex justify="center" mt={4} gap={2}>
                {testimonials.map((_, index) => (
                  <Box
                    key={index}
                    w={2}
                    h={2}
                    bg={index === currentTestimonialIndex ? currentTheme.primaryColor : 'gray.400'}
                    borderRadius="full"
                    cursor="pointer"
                    onClick={() => setCurrentTestimonialIndex(index)}
                  />
                ))}
              </Flex>
            </Box>
          </VStack>
        </Container>
      </Box>

      {/* Chatbot Component */}
      <Chatbot />
    </Box>
  );
};

export default Home;