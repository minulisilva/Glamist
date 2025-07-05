import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Image,
  useColorMode,
  Icon,
  Button,
  Flex,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from './ThemeContext'; // Import useTheme from ThemeContext

const MotionBox = motion(Box);
const MotionIcon = motion(Icon);

// Animation Variants
const heartVariants = { animate: { scale: [1, 1.5, 1], opacity: [1, 1, 0], y: [0, -100, -200], transition: { duration: 2, repeat: Infinity, repeatDelay: 0.5 } } };
const fireworkVariants = { animate: { scale: [0, 2, 0], opacity: [0, 1, 0], borderRadius: ['50%', '50%', '0%'], transition: { duration: 1.5, repeat: Infinity, repeatDelay: Math.random() * 3 } } };
const pumpkinVariants = { animate: { y: [0, -40, 0], rotate: [-10, 10, -10], opacity: [0.7, 1, 0.7], transition: { duration: 4, repeat: Infinity, ease: 'easeInOut', repeatDelay: Math.random() * 2 } } };
const snowflakeVariants = { animate: { y: [0, 200], opacity: [1, 0], transition: { duration: 4, repeat: Infinity, repeatDelay: 0.5 } } };

const AboutUs = () => {
  const { colorMode } = useColorMode();
  const { themeKey, currentTheme, currentBackgroundImages } = useTheme(); // Use theme from context
  const currentBackgroundImage = currentBackgroundImages[0]; // Use the first image from the array

  // Salon Staff Data with English Names
  const salonStaff = [
    { name: 'Emma', role: 'Hair Stylist', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD16Ho1lAu7ZZK7OOk3UlgSzPchUvWGzN10Q&s' },
    { name: 'Sophie', role: 'Nail Technician', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDTUzuydPS1_QvM703GnGiWJkN-E3u1FUQcQ&s' },
    { name: 'Olivia', role: 'Tattoo Artist', image: 'https://i.pinimg.com/236x/c1/5d/02/c15d020633bd1f59d15979ae9219912c.jpg' },
    { name: 'Charlotte', role: 'Piercing Specialist', image: 'https://assets.teenvogue.com/photos/55cb59c5657d5f2b1661f592/1:1/w_640,h_640,c_limit/pTGOtBaLLG0EPdQZe2SAlBxQePA9SO5VWyOHJ8bsRAM,F85CHKXuX-tz3RU0HN5LzE4W48VbQw_vwiPGihv0fNc.jpeg' },
    { name: 'Amelia', role: 'Skin Care Expert', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAo88uMan1eRh3EHKbssInUymKlharJu1njbqNH2w2Jf0y2UwbVOfKwVzpuOHoWEG9Ivg&usqp=CAU' },
  ];

  return (
    <Box minH="100vh" bg={colorMode === 'light' ? currentTheme.sectionBg : 'gray.900'} py={{ base: 12, md: 16 }} position="relative" overflow="hidden">
      {/* Holiday Animations */}
      {themeKey === 'valentines' && Array.from({ length: 10 }).map((_, i) => (
        <MotionIcon key={i} as={FaHeart} color="red.500" boxSize={6} position="absolute" top={`${Math.random() * 50}%`} left={`${Math.random() * 100}%`} variants={heartVariants} animate="animate" zIndex={1} />
      ))}
      {themeKey === 'newYear' && Array.from({ length: 10 }).map((_, i) => (
        <MotionBox key={i} w="30px" h="30px" bg="gold.400" position="absolute" top={`${Math.random() * 80}%`} left={`${Math.random() * 100}%`} variants={fireworkVariants} animate="animate" zIndex={10} boxShadow="0 0 15px rgba(255, 215, 0, 0.8)" />
      ))}
      {themeKey === 'halloween' && Array.from({ length: 6 }).map((_, i) => (
        <MotionBox key={i} w="50px" h="50px" bg="orange.500" borderRadius="full" position="absolute" top={`${Math.random() * 70}%`} left={`${Math.random() * 100}%`} variants={pumpkinVariants} animate="animate" zIndex={1} boxShadow="0 0 10px rgba(255, 165, 0, 0.6)">
          <Box position="absolute" top="15px" left="15px" w="10px" h="10px" bg="black" borderRadius="full" />
          <Box position="absolute" top="15px" right="15px" w="10px" h="10px" bg="black" borderRadius="full" />
          <Box position="absolute" bottom="15px" left="50%" transform="translateX(-50%)" w="20px" h="15px" bg="black" borderRadius="0 0 50% 50%" />
          <Box position="absolute" top="-10px" left="50%" transform="translateX(-50%)" w="10px" h="15px" bg="green.700" borderRadius="50% 50% 0 0" />
        </MotionBox>
      ))}
      {themeKey === 'christmas' && Array.from({ length: 15 }).map((_, i) => (
        <MotionBox key={i} w="8px" h="8px" bg="white" borderRadius="full" position="absolute" top={`${Math.random() * 50}%`} left={`${Math.random() * 100}%`} variants={snowflakeVariants} animate="animate" zIndex={1} />
      ))}

      {/* Hero Section */}
      <MotionBox
        bgImage={`url(${currentBackgroundImage})`}
        bgSize="cover"
        bgPosition="center"
        minH={{ base: '50vh', md: '60vh' }}
        position="relative"
        display="flex"
        alignItems="center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      >
        <Box position="absolute" top={0} left={0} right={0} bottom={0} bgGradient={currentTheme.bgGradient} opacity={0.7} />
        <Box position="absolute" top={0} left={0} right={0} bottom={0} bg="gray.900" opacity={0.1} bgBlendMode="overlay" />
        <Container maxW="container.lg" zIndex={2}>
          <VStack spacing={6} align="center" color="white">
            <Heading as="h1" size={{ base: '2xl', md: '3xl' }} fontFamily="'Playfair Display', serif" textShadow="2px 2px 10px rgba(0, 0, 0, 0.4)">
              About Glamist
            </Heading>
            <Text fontSize={{ base: 'lg', md: 'xl' }} fontFamily="'Montserrat', sans-serif" textShadow="1px 1px 6px rgba(0, 0, 0, 0.3)" maxW="2xl" textAlign="center">
              Crafting beauty and innovation since day one—meet the team behind your ultimate salon experience.
            </Text>
            <Button as={RouterLink} to="/contact-us" colorScheme={currentTheme.primaryColor.split('.')[0]} size="lg" borderRadius="full" _hover={{ transform: 'scale(1.05)', boxShadow: 'lg' }}>
              Get in Touch
            </Button>
          </VStack>
        </Container>
      </MotionBox>

      {/* Main Content */}
      <Container maxW="container.xl" py={{ base: 12, md: 16 }}>
        <VStack spacing={16} align="stretch">
          {/* Mission Statement */}
          <MotionBox
            p={{ base: 6, md: 8 }}
            bg={colorMode === 'light' ? 'white' : 'gray.800'}
            borderRadius="xl"
            boxShadow="lg"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            border="1px solid"
            borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
          >
            <Heading as="h2" size="xl" fontFamily="'Playfair Display', serif" color={currentTheme.primaryColor} textAlign="center" mb={4}>
              Our Mission
            </Heading>
            <Text fontSize={{ base: 'md', md: 'lg' }} color={colorMode === 'light' ? 'gray.600' : 'gray.300'} fontFamily="'Montserrat', sans-serif" textAlign="center" maxW="4xl" mx="auto">
              At Glamist, we’re dedicated to revolutionizing the salon industry by blending cutting-edge technology with exceptional beauty services. Our mission is to empower salon professionals and delight clients with seamless, personalized experiences.
            </Text>
          </MotionBox>

          {/* Our Values */}
          <VStack spacing={8}>
            <Heading as="h2" size="xl" fontFamily="'Playfair Display', serif" color={currentTheme.primaryColor} textAlign="center">
              Our Values
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              {[
                { title: 'Innovation', desc: 'Pushing boundaries with technology and creativity.' },
                { title: 'Excellence', desc: 'Delivering top-notch services every time.' },
                { title: 'Community', desc: 'Building a supportive network for beauty pros.' },
              ].map((value, index) => (
                <MotionBox
                  key={value.title}
                  p={6}
                  bg={colorMode === 'light' ? 'white' : 'gray.800'}
                  borderRadius="lg"
                  boxShadow="md"
                  border="1px solid"
                  borderColor={currentTheme.secondaryColor}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  _hover={{ bgGradient: `linear(to-t, ${currentTheme.secondaryColor}, transparent)`, transform: 'translateY(-5px)' }}
                >
                  <Text fontSize="lg" fontWeight="bold" fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor} mb={2}>
                    {value.title}
                  </Text>
                  <Text fontSize="md" color={colorMode === 'light' ? 'gray.600' : 'gray.300'} fontFamily="'Montserrat', sans-serif">
                    {value.desc}
                  </Text>
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>

          {/* Salon Staff */}
          <VStack spacing={8}>
            <Heading as="h2" size="xl" fontFamily="'Playfair Display', serif" color={currentTheme.primaryColor} textAlign="center">
              Our Salon Staff
            </Heading>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 5 }} spacing={6}>
              {salonStaff.map((member, index) => (
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
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  _hover={{ transform: 'translateY(-10px)', boxShadow: `0 8px 20px ${currentTheme.secondaryColor}`, bgGradient: `linear(to-b, ${currentTheme.secondaryColor}, transparent)` }}
                >
                  <VStack spacing={4}>
                    <Image src={member.image} alt={member.name} borderRadius="full" boxSize="120px" objectFit="cover" border="3px solid" borderColor={currentTheme.primaryColor} />
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

export default AboutUs;