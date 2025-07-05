import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Button,
  SimpleGrid,
  VStack,
  Link,
  Icon,
  Image,
} from '@chakra-ui/react';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaHeart } from 'react-icons/fa';
import { useColorMode } from '@chakra-ui/react';
import { motion } from 'framer-motion';
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

const Nail = () => {
  const { colorMode } = useColorMode();
  const { themeKey, currentTheme, currentBackgroundImages } = useTheme(); // Use theme from context
  const currentBackgroundImage = currentBackgroundImages[0]; // Use the first image from the array

  // Array of nail care services
  const nailServices = [
    {
      title: 'Manicure',
      description: 'Pamper your hands with a luxurious manicure, including nail shaping and polish.',
      image: 'https://i.pinimg.com/474x/20/e4/ca/20e4ca45873b7c3d776d71d537aa717c.jpg',
    },
    {
      title: 'Pedicure',
      description: 'Treat your feet to a relaxing pedicure with exfoliation and vibrant polish.',
      image: 'https://i.pinimg.com/736x/f0/f7/f1/f0f7f1f6be04e57e86712ad90a17e197.jpg',
    },
    {
      title: 'Nail Art',
      description: 'Express your style with custom nail art designs for any occasion.',
      image: 'https://i.pinimg.com/236x/dd/fd/67/ddfd6708f32d2e0685320b2d45a49bf5.jpg',
    },
    {
      title: 'Nail Extensions',
      description: 'Get longer, stronger nails with our professional nail extension services.',
      image: 'https://i.pinimg.com/474x/bb/86/f4/bb86f4713ee6671ff1774cdbb2514616.jpg',
    },
  ];

  // Array of trending nail styles
  const trendingStyles = [
    {
      title: 'French Tips',
      description: 'Classic elegance with a modern twist on the timeless French manicure.',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMu9MIKAJKKcc92bTaXtvK-Y8u36GCqE8b9g&s',
    },
    {
      title: 'Chrome Nails',
      description: 'Shiny, reflective nails for a bold and futuristic look.',
      image: 'https://www.instyle.com/thmb/TFdElf67BPes3fq0p6ikhgTyHCk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/ombrefrenchchromeprinary-399b95dd623c45f88eac69edaf93773b.jpg',
    },
    {
      title: 'Matte Finish',
      description: 'Sleek, understated nails with a velvety matte topcoat.',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFGaJS0Qis6OaqLwHhSHfmc0ePG00c-IOxmg&s', // Placeholder, replace with real URL
    },
  ];

  // Array of nail stylists with Instagram links and usernames
  const stylists = [
    {
      name: 'Emma Stone',
      specialty: 'Nail Art',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300',
      instagram: 'https://www.instagram.com/emmastone_nails',
      username: '@emmastone_nails',
    },
    {
      name: 'Olivia Jade',
      specialty: 'Nail Extensions',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
      instagram: 'https://www.instagram.com/oliviajade_nails',
      username: '@oliviajade_nails',
    },
    {
      name: 'Mia Lee',
      specialty: 'Manicure & Pedicure',
      image: 'https://www.realsimple.com/thmb/JX3oX-3rTCceLnaK49U_7Dj_QO4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/best-pixie-cuts-2-2000-464e8228e7ca43a3bb9f7be92e5dd5a4.jpg',
      instagram: 'https://www.instagram.com/mialee_nails',
      username: '@mialee_nails',
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

      {/* Main Section */}
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
          <Flex direction={{ base: 'column', md: 'row' }} align="center" justify="space-between" gap={{ base: 10, md: 20 }}>
            <VStack align={{ base: 'center', md: 'start' }} spacing={6} flex="1" textAlign={{ base: 'center', md: 'left' }}>
              <Heading
                as="h1"
                size={{ base: '2xl', md: '3xl' }}
                fontFamily="'Playfair Display', serif"
                color="white"
                lineHeight="1.2"
                textShadow="2px 2px 8px rgba(0, 0, 0, 0.3)"
              >
                Stunning Nail Care with Glamist
              </Heading>
              <Text
                fontFamily="'Montserrat', sans-serif'"
                fontSize={{ base: 'md', md: 'lg' }}
                color="white"
                maxW="md"
                textShadow="1px 1px 4px rgba(0, 0, 0, 0.2)"
              >
                At Glamist, we offer top-notch nail care services to keep your hands and feet looking fabulous. From manicures to nail art, we’ve got it all.
              </Text>
              <Button
                bg={currentTheme.primaryColor}
                color="white"
                size="lg"
                fontFamily="'Montserrat', sans-serif'"
                _hover={{ bg: `${currentTheme.primaryColor.split('.')[0]}.600`, transform: 'scale(1.05)', transition: 'all 0.3s ease' }}
                as="a"
                href="/nail-schedule"
              >
                Book Your Nail Care Session
              </Button>
            </VStack>
            <MotionBox
              flex="1"
              w={{ base: '100%', md: '50%' }}
              h={{ base: '300px', md: '500px' }}
              bgImage="url('https://i.pinimg.com/236x/0d/40/98/0d4098da9e99ffe1018c99013effd23a.jpg')"
              bgSize="cover"
              bgPosition="center"
              borderRadius="md"
              boxShadow="lg"
              position="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bg: 'rgba(0, 0, 0, 0.1)',
                borderRadius: 'md',
              }}
            />
          </Flex>
        </Container>
      </MotionBox>

      {/* Nail Care Services Section */}
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
            Our Nail Care Services
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={10}>
            {nailServices.map((service, index) => (
              <MotionBox
                key={service.title}
                spacing={4}
                align="center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <VStack>
                  <MotionBox
                    w="200px"
                    h="200px"
                    bgImage={`url('${service.image}')`}
                    bgSize="cover"
                    bgPosition="center"
                    borderRadius="md"
                    boxShadow="md"
                    position="relative"
                    whileHover={{ scale: 1.05, boxShadow: 'lg' }}
                    transition={{ duration: 0.3 }}
                    _before={{
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bg: 'rgba(0, 0, 0, 0.1)',
                      borderRadius: 'md',
                    }}
                  />
                  <Heading
                    as="h3"
                    size="md"
                    fontFamily="'Playfair Display', serif"
                    color={colorMode === 'light' ? currentTheme.primaryColor : currentTheme.secondaryColor}
                  >
                    {service.title}
                  </Heading>
                  <Text
                    fontFamily="'Montserrat', sans-serif'"
                    fontSize="sm"
                    color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
                    textAlign="center"
                  >
                    {service.description}
                  </Text>
                </VStack>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Trending Styles Section */}
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
            Trending Nail Styles
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            {trendingStyles.map((style, index) => (
              <MotionBox
                key={style.title}
                spacing={4}
                align="center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <VStack>
                  <MotionBox
                    w="250px"
                    h="250px"
                    bgImage={`url('${style.image}')`}
                    bgSize="cover"
                    bgPosition="center"
                    borderRadius="md"
                    boxShadow="md"
                    position="relative"
                    whileHover={{ scale: 1.05, boxShadow: 'lg' }}
                    transition={{ duration: 0.3 }}
                    _before={{
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bg: 'rgba(0, 0, 0, 0.1)',
                      borderRadius: 'md',
                    }}
                  />
                  <Heading
                    as="h3"
                    size="md"
                    fontFamily="'Playfair Display', serif"
                    color={colorMode === 'light' ? currentTheme.primaryColor : currentTheme.secondaryColor}
                  >
                    {style.title}
                  </Heading>
                  <Text
                    fontFamily="'Montserrat', sans-serif'"
                    fontSize="sm"
                    color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
                    textAlign="center"
                  >
                    {style.description}
                  </Text>
                </VStack>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Our Stylists Section */}
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
            Meet Our Nail Stylists
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            {stylists.map((stylist, index) => (
              <MotionBox
                key={stylist.name}
                spacing={4}
                align="center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <VStack>
                  <MotionBox
                    w="200px"
                    h="200px"
                    borderRadius="full"
                    overflow="hidden"
                    boxShadow="md"
                    position="relative"
                    whileHover={{ scale: 1.05, boxShadow: 'lg' }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={stylist.image}
                      alt={stylist.name}
                      w="full"
                      h="full"
                      objectFit="cover"
                      fallbackSrc="https://via.placeholder.com/200?text=Image+Not+Found"
                    />
                  </MotionBox>
                  <Heading
                    as="h3"
                    size="md"
                    fontFamily="'Playfair Display', serif"
                    color={colorMode === 'light' ? currentTheme.primaryColor : currentTheme.secondaryColor}
                  >
                    {stylist.name}
                  </Heading>
                  <Text
                    fontFamily="'Montserrat', sans-serif'"
                    fontSize="sm"
                    color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
                    textAlign="center"
                  >
                    {stylist.specialty}
                  </Text>
                  <Flex align="center" gap={2}>
                    <Link
                      href={stylist.instagram}
                      isExternal
                      color={colorMode === 'light' ? currentTheme.primaryColor : currentTheme.secondaryColor}
                      _hover={{ color: colorMode === 'light' ? `${currentTheme.primaryColor.split('.')[0]}.700` : `${currentTheme.secondaryColor.split('.')[0]}.500` }}
                    >
                      <Icon as={FaInstagram} w={6} h={6} />
                    </Link>
                    <Text
                      fontFamily="'Montserrat', sans-serif'"
                      fontSize="sm"
                      color={colorMode === 'light' ? currentTheme.primaryColor : currentTheme.secondaryColor}
                    >
                      {stylist.username}
                    </Text>
                  </Flex>
                </VStack>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  );
};

export default Nail;