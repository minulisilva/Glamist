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
import axios from 'axios';
import Chatbot from './Chatbot';
import { useLanguage } from './LanguageContext';
import { useTheme } from './ThemeContext'; // Import useTheme

const MotionBox = motion(Box);
const MotionIcon = motion(Icon);

// Sample data for Featured Services with Bridal added
const services = [
  { title: 'Hair Styling', description: 'Transform your look with expert cuts, colors, and styles.', img: 'https://cdn.pixabay.com/photo/2016/11/29/11/32/woman-1869208_1280.jpg', link: '/hair' },
  { title: 'Nail Art', description: 'Pamper your hands and feet with stunning nail designs.', img: 'https://cdn.pixabay.com/photo/2020/10/14/07/03/nail-art-5653459_1280.jpg', link: '/nail' },
  { title: 'Tattoo Design', description: 'Express yourself with custom, high-quality tattoos.', img: 'https://cdn.pixabay.com/photo/2017/10/27/13/40/tattoo-2894318_1280.jpg', link: '/tattoo' },
  { title: 'Piercings', description: 'Add a bold touch with professional piercing services.', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZbqdgyKfgYjlRJ7hebe9TatpgzuyodaPpiA&s', link: '/piercings' },
  { title: 'Skin Care', description: 'Glow with personalized skin treatments and facials.', img: 'data:image/jpeg;base64,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', link: '/skin' },
  { title: 'Bridal', description: 'Look stunning on your special day with our bridal packages.', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeazM4xcbEO_fWh2gufx9cpIOacnpcjHHIMg&s', link: '/bridal' },
];

// Sample data for Awards
const awards = [
  { title: 'Best Salon 2024', description: 'Awarded by Beauty Magazine for excellence in service.', icon: FaAward },
  { title: 'Top Hair Styling Award', description: 'Recognized by Hair Trends for innovative styles.', icon: FaAward },
  { title: 'Customer Choice 2023', description: 'Voted #1 by our loyal clients.', icon: FaAward },
];

// Sample data for testimonials
const testimonials = [
  { name: 'Jane Doe', text: 'Glamist transformed my salon experience!', img: 'https://images.healthshots.com/healthshots/en/uploads/2023/04/06185648/hair-care.jpg' },
  { name: 'Joana Smith', text: 'The best salon I’ve ever gone to.', img: 'https://www.perfocal.com/blog/content/images/size/w960/2021/01/Perfocal_17-11-2019_TYWFAQ_100_standard-3.jpg' },
  { name: 'Alex Carter', text: 'Amazing service and incredible results!', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80' },
];

// Animation Variants
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

const Home = () => {
  const { colorMode } = useColorMode();
  const buttonSize = useBreakpointValue({ base: 'sm', md: 'md', lg: 'lg' });
  const headingSize = useBreakpointValue({ base: '2xl', md: '4xl', lg: '5xl' });
  const { t } = useLanguage();
  const { themeKey, currentTheme, currentBackgroundImages } = useTheme(); // Use theme from context

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [userName, setUserName] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/user/data', {
          withCredentials: true,
        });
        if (response.data.success) {
          setUserName(response.data.userData.name);
          setIsLoggedIn(true);
        }
      } catch (error) {
        setIsLoggedIn(false);
        setUserName(null);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % currentBackgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentBackgroundImages]);

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
      {themeKey === 'valentines' && (
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
        ))
      )}
      {themeKey === 'newYear' && (
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
        ))
      )}
      {themeKey === 'halloween' && (
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
            <Box position="absolute" bottom="15px" left="50%" transform="translateX(-50%)" w="20px" h="15px" bg="black" borderRadius="0 0 50% 50%" />
            <Box position="absolute" top="-10px" left="50%" transform="translateX(-50%)" w="10px" h="15px" bg="green.700" borderRadius="50% 50% 0 0" />
          </MotionBox>
        ))
      )}
      {themeKey === 'christmas' && (
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
        ))
      )}

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
            {isLoggedIn && userName && (
              <Text
                fontSize={{ base: 'lg', md: 'xl' }}
                fontFamily="'Montserrat', sans-serif"
                textShadow="1px 1px 4px rgba(0, 0, 0, 0.2)"
              >
                Hi {userName}!
              </Text>
            )}
            <Heading
              as="h2"
              size={headingSize}
              fontFamily="'Playfair Display', serif"
              fontWeight="extrabold"
              textShadow="2px 2px 8px rgba(0, 0, 0, 0.3)"
            >
              {t('welcome')}
            </Heading>
            <Text
              fontSize={{ base: 'xl', md: '2xl' }}
              fontFamily="'Montserrat', sans-serif"
              maxW="700px"
              textShadow="1px 1px 4px rgba(0, 0, 0, 0.2)"
            >
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

      <Box py={{ base: 16, md: 24 }} bg={colorMode === 'light' ? 'white' : 'gray.800'}>
        <Container maxW="container.xl">
          <VStack spacing={12} align="center">
            <Heading
              as="h3"
              size="2xl"
              fontFamily="'Playfair Display', serif"
              color={colorMode === 'light' ? currentTheme.primaryColor : currentTheme.secondaryColor}
              textAlign="center"
            >
              {t('servicesTitle')}
            </Heading>
            <Text
              fontSize="lg"
              fontFamily="'Montserrat', sans-serif"
              color={colorMode === 'light' ? 'gray.600' : 'gray.300'}
              textAlign="center"
              maxW="600px"
            >
              {t('servicesText')}
            </Text>
            <Grid
              templateColumns={{
                base: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(6, 1fr)',
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
                    <Heading
                      as="h4"
                      size={{ base: 'sm', md: 'md' }}
                      fontFamily="'Playfair Display', serif"
                      color={currentTheme.primaryColor}
                      mb={2}
                    >
                      {service.title}
                    </Heading>
                    <Text
                      fontFamily="'Montserrat', sans-serif"
                      color="gray.600"
                      fontSize={{ base: 'sm', md: 'md' }}
                      mb={4}
                    >
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

      <Box py={{ base: 16, md: 24 }} bg={colorMode === 'light' ? currentTheme.sectionBg : 'gray.900'}>
        <Container maxW="container.xl">
          <VStack spacing={12} align="center">
            <Heading
              as="h3"
              size="2xl"
              fontFamily="'Playfair Display', serif"
              color={colorMode === 'light' ? currentTheme.primaryColor : currentTheme.secondaryColor}
              textAlign="center"
            >
              {t('awardsTitle')}
            </Heading>
            <Text
              fontSize="lg"
              fontFamily="'Montserrat', sans-serif"
              color={colorMode === 'light' ? 'gray.600' : 'gray.300'}
              textAlign="center"
              maxW="600px"
            >
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
                    <Heading
                      as="h4"
                      size="md"
                      fontFamily="'Playfair Display', serif"
                      color={currentTheme.primaryColor}
                      mb={2}
                    >
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

      <Box py={{ base: 16, md: 24 }} bg={colorMode === 'light' ? currentTheme.sectionBg : `${currentTheme.primaryColor.split('.')[0]}.900`}>
        <Container maxW="container.xl">
          <VStack spacing={12} align="center">
            <Heading
              as="h3"
              size="2xl"
              fontFamily="'Playfair Display', serif"
              color={colorMode === 'light' ? currentTheme.primaryColor : currentTheme.secondaryColor}
            >
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
                  <Text
                    fontFamily="'Montserrat', sans-serif"
                    fontWeight="bold"
                    color={colorMode === 'light' ? currentTheme.primaryColor : currentTheme.secondaryColor}
                  >
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

      <Chatbot />
    </Box>
  );
};

export default Home;