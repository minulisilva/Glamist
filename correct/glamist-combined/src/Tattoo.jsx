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

const Tattoo = () => {
  const { colorMode } = useColorMode();
  const { themeKey, currentTheme, currentBackgroundImages } = useTheme(); // Use theme from context
  const currentBackgroundImage = currentBackgroundImages[0]; // Use the first image from the array

  // Array of tattoo services
  const tattooServices = [
    {
      title: 'Custom Tattoo Design',
      description: 'Work with our artists to create a unique tattoo that reflects your style.',
      image: 'https://i.pinimg.com/736x/88/78/34/8878341362a60a740f2b6c7e09577a42.jpg',
    },
    {
      title: 'Cover-Up Tattoos',
      description: 'Transform old tattoos with our expert cover-up techniques.',
      image: 'https://i.pinimg.com/736x/b8/4e/38/b84e38f4bf99e1e54cd84c27cdd36a32.jpg',
    },
    {
      title: 'Tattoo Touch-Ups',
      description: 'Refresh your existing tattoos with professional touch-ups.',
      image: 'https://i.pinimg.com/736x/42/69/b3/4269b36641d892e3b70d1ab95e5462c0.jpg',
    },
    {
      title: 'Tattoo Removal',
      description: 'Safely remove unwanted tattoos with our advanced laser technology.',
      image: 'https://i.pinimg.com/736x/f7/14/04/f71404892b5b411e1fe232211af2f9ec.jpg',
    },
  ];

  // Array of trending tattoo styles
  const trendingStyles = [
    {
      title: 'Minimalist Tattoos',
      description: 'Simple, elegant designs with clean lines and subtle details.',
      image: 'https://whiteiristattoo.com/wp-content/uploads/2022/09/Minimalist-Tattoos.jpg', // Placeholder, replace with real URL
    },
    {
      title: 'Watercolor Tattoos',
      description: 'Vibrant, artistic tattoos with a painterly effect.',
      image: 'https://www.instyle.com/thmb/y-uIN6Fuol_1X_b513zdKMPLnms=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/watercolortattoo-c50a7b43e0a443ea9fb9d2961ee34d01.jpg', // Placeholder, replace with real URL
    },
    {
      title: 'Geometric Tattoos',
      description: 'Bold, symmetrical designs with intricate patterns.',
      image: 'https://i.etsystatic.com/6584961/r/il/291fc8/5340718931/il_1080xN.5340718931_hxwz.jpg', // Placeholder, replace with real URL
    },
  ];

  // Array of tattoo artists with Instagram links and usernames
  const artists = [
    {
      name: 'Jake Pierce',
      specialty: 'Custom Designs',
      image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=300',
      instagram: 'https://www.instagram.com/jakepierce_tattoos',
      username: '@jakepierce_tattoos',
    },
    {
      name: 'Luna Hart',
      specialty: 'Watercolor Tattoos',
      image: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=300',
      instagram: 'https://www.instagram.com/lunahart_ink',
      username: '@lunahart_ink',
    },
    {
      name: 'Zane Cole',
      specialty: 'Cover-Ups & Touch-Ups',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
      instagram: 'https://www.instagram.com/zanecole_tattoo',
      username: '@zanecole_tattoo',
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
                Artistic Tattoo Services with Glamist
              </Heading>
              <Text
                fontFamily="'Montserrat', sans-serif'"
                fontSize={{ base: 'md', md: 'lg' }}
                color="white"
                maxW="md"
                textShadow="1px 1px 4px rgba(0, 0, 0, 0.2)"
              >
                At Glamist, our skilled tattoo artists bring your vision to life with custom designs, cover-ups, touch-ups, and safe removal services.
              </Text>
              <Button
                bg={currentTheme.primaryColor}
                color="white"
                size="lg"
                fontFamily="'Montserrat', sans-serif'"
                _hover={{ bg: `${currentTheme.primaryColor.split('.')[0]}.600`, transform: 'scale(1.05)', transition: 'all 0.3s ease' }}
                as="a"
                href="/tattoo-schedule"
              >
                Book Your Tattoo Session
              </Button>
            </VStack>
            <MotionBox
              flex="1"
              w={{ base: '100%', md: '50%' }}
              h={{ base: '300px', md: '500px' }}
              bgImage="url('https://i.pinimg.com/736x/35/eb/47/35eb47fa6b671e4ed13b10236649a63a.jpg')"
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

      {/* Tattoo Services Section */}
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
            Our Tattoo Services
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={10}>
            {tattooServices.map((service, index) => (
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

      {/* Trending Tattoo Styles Section */}
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
            Trending Tattoo Styles
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

      {/* Our Tattoo Artists Section */}
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
            Meet Our Tattoo Artists
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            {artists.map((artist, index) => (
              <MotionBox
                key={artist.name}
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
                      src={artist.image}
                      alt={artist.name}
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
                    {artist.name}
                  </Heading>
                  <Text
                    fontFamily="'Montserrat', sans-serif'"
                    fontSize="sm"
                    color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
                    textAlign="center"
                  >
                    {artist.specialty}
                  </Text>
                  <Flex align="center" gap={2}>
                    <Link
                      href={artist.instagram}
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
                      {artist.username}
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

export default Tattoo;