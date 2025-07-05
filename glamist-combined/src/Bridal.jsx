import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Button,
  SimpleGrid,
  VStack,
  Icon,
  Image,
} from '@chakra-ui/react';
import { FaHeart } from 'react-icons/fa';
import { useColorMode } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from './ThemeContext'; // Import useTheme from ThemeContext

const MotionBox = motion(Box);
const MotionIcon = motion(Icon);

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

const Bridal = () => {
  const { colorMode } = useColorMode();
  const { themeKey, currentTheme, currentBackgroundImages } = useTheme(); // Use theme from context
  const currentBackgroundImage = currentBackgroundImages[0]; // Use the first image from the array

  // Bridal Packages
  const packages = [
    {
      name: 'Luxury',
      price: '$1,500',
      description: 'The ultimate bridal experience with premium styling and care.',
      features: [
        'Custom bridal hair and makeup design',
        'Full-day stylist availability',
        'Luxury spa treatment (massage, facial)',
        'Bridal party styling (up to 4 people)',
        'Premium accessories included',
      ],
    },
    {
      name: 'Premium',
      price: '$1,000',
      description: 'A comprehensive package for a stunning bridal look.',
      features: [
        'Bridal hair and makeup consultation',
        'Half-day stylist availability',
        'Mini spa treatment (facial)',
        'Bridal party styling (up to 2 people)',
        'Standard accessories included',
      ],
    },
    {
      name: 'Essential',
      price: '$600',
      description: 'A simple yet elegant bridal styling option.',
      features: [
        'Bridal hair and makeup session',
        '2-hour stylist availability',
        'Basic skin prep',
        'No additional party styling',
        'Essential accessories included',
      ],
    },
  ];

  // Consultants
  const consultants = [
    {
      name: 'Elena Rose',
      specialty: 'Bridal Hair & Makeup',
      bio: 'With over 10 years of experience, Elena crafts timeless bridal looks with a modern twist.',
      image: 'https://images.unsplash.com/photo-1517841902196-6c14e9e2924e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Sophia Lee',
      specialty: 'Bridal Styling & Accessories',
      bio: 'Sophia specializes in creating cohesive bridal ensembles, from veils to jewelry.',
      image: 'https://images.unsplash.com/photo-1524502392439-3e6f0b8e8f42?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    },
  ];

  return (
    <Box
      position="relative"
      overflow="hidden"
      bg={colorMode === 'light' ? currentTheme.sectionBg : 'gray.900'}
    >
      {/* Holiday Animations */}
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

      {/* Hero Section */}
      <MotionBox
        as="section"
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        py={{ base: 10, md: 20 }}
        bgImage={`url(${currentBackgroundImage})`}
        bgSize="cover"
        bgPosition="center"
        position="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      >
        <Box position="absolute" top={0} left={0} right={0} bottom={0} bgGradient={currentTheme.bgGradient} opacity={0.7} />
        <Container maxW="container.xl" zIndex={2}>
          <VStack spacing={6} textAlign="center">
            <Heading
              as="h1"
              size={{ base: '2xl', md: '3xl' }}
              fontFamily="'Playfair Display', serif"
              color="white"
              lineHeight="1.2"
              textShadow="2px 2px 8px rgba(0, 0, 0, 0.3)"
            >
              Bridal Dressing Consultation
            </Heading>
            <Text
              fontFamily="'Montserrat', sans-serif'"
              fontSize={{ base: 'md', md: 'lg' }}
              color="white"
              maxW="2xl"
              textShadow="1px 1px 4px rgba(0, 0, 0, 0.2)"
            >
              Let Glamist make your wedding day unforgettable with bespoke bridal styling.
            </Text>
            <Button
              bg={currentTheme.primaryColor}
              color="white"
              size="lg"
              fontFamily="'Montserrat', sans-serif'"
              _hover={{ bg: `${currentTheme.primaryColor.split('.')[0]}.600`, transform: 'scale(1.05)', transition: 'all 0.3s ease' }}
              as={RouterLink}
              to="/bridalapp"
            >
              Book a Consultation
            </Button>
          </VStack>
        </Container>
      </MotionBox>

      {/* Packages Section */}
      <Box as="section" py={{ base: 10, md: 14 }} bg={colorMode === 'light' ? 'white' : 'gray.800'}>
        <Container maxW="container.xl">
          <Heading
            as="h2"
            size="lg"
            fontFamily="'Playfair Display', serif"
            color={colorMode === 'light' ? currentTheme.primaryColor : currentTheme.secondaryColor}
            textAlign="center"
            mb={10}
          >
            Our Bridal Packages
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            {packages.map((pkg, index) => (
              <MotionBox
                key={pkg.name}
                p={6}
                bg={colorMode === 'light' ? 'gray.50' : 'gray.700'}
                borderRadius="lg"
                boxShadow="md"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ scale: 1.03, boxShadow: 'lg' }}
              >
                <VStack spacing={4} align="start">
                  <Heading
                    as="h3"
                    size="md"
                    fontFamily="'Playfair Display', serif"
                    color={colorMode === 'light' ? currentTheme.primaryColor : currentTheme.secondaryColor}
                  >
                    {pkg.name}
                  </Heading>
                  <Text
                    fontFamily="'Montserrat', sans-serif'"
                    fontSize="xl"
                    fontWeight="bold"
                    color={colorMode === 'light' ? 'gray.800' : 'gray.200'}
                  >
                    {pkg.price}
                  </Text>
                  <Text
                    fontFamily="'Montserrat', sans-serif'"
                    fontSize="sm"
                    color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
                  >
                    {pkg.description}
                  </Text>
                  <Box>
                    {pkg.features.map((feature, i) => (
                      <Text
                        key={i}
                        fontFamily="'Montserrat', sans-serif'"
                        fontSize="sm"
                        color={colorMode === 'light' ? 'gray.500' : 'gray.300'}
                      >
                        • {feature}
                      </Text>
                    ))}
                  </Box>
                  {/* Removed "Select Package" Button */}
                </VStack>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Consultants Section */}
      <Box as="section" py={{ base: 10, md: 14 }} bg={colorMode === 'light' ? currentTheme.sectionBg : 'gray.700'}>
        <Container maxW="container.xl">
          <Heading
            as="h2"
            size="lg"
            fontFamily="'Playfair Display', serif"
            color={colorMode === 'light' ? currentTheme.primaryColor : currentTheme.secondaryColor}
            textAlign="center"
            mb={10}
          >
            Meet Our Bridal Consultants
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
            {consultants.map((consultant, index) => (
              <MotionBox
                key={consultant.name}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Flex gap={6} align="center" bg={colorMode === 'light' ? 'white' : 'gray.800'} p={6} borderRadius="lg" boxShadow="md">
                  <Image
                    src={consultant.image}
                    alt={consultant.name}
                    boxSize="150px"
                    objectFit="cover"
                    borderRadius="full"
                    border={`2px solid ${currentTheme.primaryColor}`}
                  />
                  <VStack align="start" spacing={3}>
                    <Heading
                      as="h3"
                      size="md"
                      fontFamily="'Playfair Display', serif"
                      color={colorMode === 'light' ? currentTheme.primaryColor : currentTheme.secondaryColor}
                    >
                      {consultant.name}
                    </Heading>
                    <Text
                      fontFamily="'Montserrat', sans-serif'"
                      fontSize="sm"
                      color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
                      fontStyle="italic"
                    >
                      {consultant.specialty}
                    </Text>
                    <Text
                      fontFamily="'Montserrat', sans-serif'"
                      fontSize="sm"
                      color={colorMode === 'light' ? 'gray.500' : 'gray.300'}
                    >
                      {consultant.bio}
                    </Text>
                  </VStack>
                </Flex>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box as="section" py={{ base: 10, md: 14 }} bg={colorMode === 'light' ? 'white' : 'gray.800'}>
        <Container maxW="container.xl" textAlign="center">
          <VStack spacing={6}>
            <Heading
              as="h2"
              size="lg"
              fontFamily="'Playfair Display', serif"
              color={colorMode === 'light' ? currentTheme.primaryColor : currentTheme.secondaryColor}
            >
              Your Dream Wedding Starts Here
            </Heading>
            <Text
              fontFamily="'Montserrat', sans-serif'"
              fontSize={{ base: 'md', md: 'lg' }}
              color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
              maxW="md"
            >
              Schedule a consultation with our experts to craft your perfect bridal look.
            </Text>
            <Button
              bg={currentTheme.primaryColor}
              color="white"
              size="lg"
              fontFamily="'Montserrat', sans-serif'"
              _hover={{ bg: `${currentTheme.primaryColor.split('.')[0]}.600`, transform: 'scale(1.05)', transition: 'all 0.3s ease' }}
              as={RouterLink}
              to="/bridalapp"
            >
              Get Started
            </Button>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default Bridal;