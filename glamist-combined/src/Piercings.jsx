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

const Piercings = () => {
  const { colorMode } = useColorMode();
  const { themeKey, currentTheme, currentBackgroundImages } = useTheme(); // Use theme from context
  const currentBackgroundImage = currentBackgroundImages[0]; // Use the first image from the array

  // Array of piercing services
  const piercingServices = [
    {
      title: 'Ear Piercings',
      description: 'From classic lobes to trendy cartilage, we offer a variety of ear piercings.',
      image: 'https://i.pinimg.com/736x/87/32/d0/8732d0c3bc762d1226a211b738a5b2dd.jpg',
    },
    {
      title: 'Nose Piercings',
      description: 'Add a touch of elegance with our professional nose piercing services.',
      image: 'https://i.pinimg.com/736x/65/65/b3/6565b357b60f1553d3d33f9b5ee4578b.jpg',
    },
    {
      title: 'Body Piercings',
      description: 'Express yourself with body piercings like navel or eyebrow piercings.',
      image: 'https://i.pinimg.com/736x/d4/39/a8/d439a86900129c48ff0e5bc42c1f3f74.jpg',
    },
    {
      title: 'Piercing Aftercare',
      description: 'Ensure your piercing heals perfectly with our expert aftercare guidance.',
      image: 'https://i.pinimg.com/736x/8b/af/7a/8baf7aff20c76a99d7057582bce9c911.jpg',
    },
  ];

  // Array of trending piercing styles
  const trendingStyles = [
    {
      title: 'Helix Piercings',
      description: 'Stylish and bold piercings along the upper ear cartilage.',
      image: 'https://skinkandy.com/cdn/shop/articles/7R506473_1_1_63ec2605-e0d9-4ab9-9978-fc109164bad2_1400x.jpg?v=1740109512', // Placeholder, replace with real URL
    },
    {
      title: 'Septum Piercings',
      description: 'Edgy and unique piercings through the nasal septum.',
      image: 'https://piercedowl.com/cdn/shop/articles/2023_1113PiercedOwlJewelry_Clay21.jpg?v=1730738673&width=1100', // Placeholder, replace with real URL
    },
    {
      title: 'Industrial Piercings',
      description: 'Dramatic double piercings connected by a single barbell.',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQv2MDcfOcRewy5f5qfQTjnX2VtVOw-Mgpm4w&s', // Placeholder, replace with real URL
    },
  ];

  // Array of piercing artists with Instagram links and usernames
  const artists = [
    {
      name: 'Riley Quinn',
      specialty: 'Ear Piercings',
      image: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=300',
      instagram: 'https://www.instagram.com/rileyquinn_piercings',
      username: '@rileyquinn_piercings',
    },
    {
      name: 'Harper Lane',
      specialty: 'Body Piercings',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300',
      instagram: 'https://www.instagram.com/harperlane_pierce',
      username: '@harperlane_pierce',
    },
    {
      name: 'Kai Reed',
      specialty: 'Nose & Specialty Piercings',
      image: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=300',
      instagram: 'https://www.instagram.com/kaireed_piercings',
      username: '@kaireed_piercings',
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
                Professional Piercing Services with Glamist
              </Heading>
              <Text
                fontFamily="'Montserrat', sans-serif'"
                fontSize={{ base: 'md', md: 'lg' }}
                color="white"
                maxW="md"
                textShadow="1px 1px 4px rgba(0, 0, 0, 0.2)"
              >
                At Glamist, we provide safe and stylish piercing services, from ear and nose to body piercings, along with expert aftercare advice.
              </Text>
              <Button
                bg={currentTheme.primaryColor}
                color="white"
                size="lg"
                fontFamily="'Montserrat', sans-serif'"
                _hover={{ bg: `${currentTheme.primaryColor.split('.')[0]}.600`, transform: 'scale(1.05)', transition: 'all 0.3s ease' }}
                as="a"
                href="/pierce"
              >
                Book Your Piercing Session
              </Button>
            </VStack>
            <MotionBox
              flex="1"
              w={{ base: '100%', md: '50%' }}
              h={{ base: '300px', md: '500px' }}
              bgImage="url('https://i.pinimg.com/736x/a1/7a/10/a17a10eea162c165af19fd933b7782e7.jpg')"
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

      {/* Piercing Services Section */}
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
            Our Piercing Services
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={10}>
            {piercingServices.map((service, index) => (
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

      {/* Trending Piercing Styles Section */}
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
            Trending Piercing Styles
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

      {/* Our Piercing Artists Section */}
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
            Meet Our Piercing Artists
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

export default Piercings;