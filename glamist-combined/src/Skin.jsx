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

const Skin = () => {
  const { colorMode } = useColorMode();
  const { themeKey, currentTheme, currentBackgroundImages } = useTheme(); // Use theme from context
  const currentBackgroundImage = currentBackgroundImages[0]; // Use the first image from the array

  // Array of skin care services
  const skinServices = [
    {
      title: 'Facial Treatments',
      description: 'Revitalize your skin with our customized facial treatments.',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2AKzoiL86ocQij_nQ0JM3dF3aTtJinVvM0w&s', // Placeholder, replace with real URL
    },
    {
      title: 'Chemical Peels',
      description: 'Exfoliate and renew your skin with our professional chemical peels.',
      image: 'https://www.askinclinic.co.uk/wp-content/uploads/2019/10/t4q.jpg', // Placeholder, replace with real URL
    },
    {
      title: 'Microdermabrasion',
      description: 'Smooth and brighten your complexion with microdermabrasion.',
      image: 'https://facelogicdallas.com/wp-content/uploads/Chemical-Peel.png', // Placeholder, replace with real URL
    },
    {
      title: 'Hydrating Masks',
      description: 'Deeply nourish your skin with our luxurious hydrating masks.',
      image: 'https://static.wixstatic.com/media/81d013_777e13340ff84717aee9a6e63574828e~mv2.jpg/v1/fill/w_568,h_298,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/81d013_777e13340ff84717aee9a6e63574828e~mv2.jpg', // Placeholder, replace with real URL
    },
  ];

  // Array of trending skin treatments
  const trendingTreatments = [
    {
      title: 'LED Light Therapy',
      description: 'Boost collagen and reduce acne with LED light therapy.',
      image: 'https://images.squarespace-cdn.com/content/v1/58178a4515d5dbcebad3dff8/1502896818748-PVIWK2FB2R4N0UU6P2HJ/image-asset.jpeg?format=1500w', // Placeholder, replace with real URL
    },
    {
      title: 'Microneedling',
      description: 'Stimulate skin renewal with this minimally invasive treatment.',
      image: 'https://images.squarespace-cdn.com/content/v1/5d6b3013248be40001de4764/1567588578206-MZRQS3F3PRZJ9AZA2103/get-a-facial.png', // Placeholder, replace with real URL
    },
    {
      title: 'Oxygen Facials',
      description: 'Infuse your skin with oxygen for a radiant, hydrated glow.',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl_n5EG2xScYVBhNcWr_2LqelEgxMYCnWiPQ&s', // Placeholder, replace with real URL
    },
  ];

  // Array of skin specialists with Instagram links and usernames
  const specialists = [
    {
      name: 'Evelyn Brooks',
      specialty: 'Facial Treatments',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300',
      instagram: 'https://www.instagram.com/evelynbrooks_skin',
      username: '@evelynbrooks_skin',
    },
    {
      name: 'Nora James',
      specialty: 'Chemical Peels',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
      instagram: 'https://www.instagram.com/norajames_skin',
      username: '@norajames_skin',
    },
    {
      name: 'Lila Chen',
      specialty: 'Microdermabrasion',
      image: 'https://img.freepik.com/free-photo/young-beautiful-woman-pink-warm-sweater-natural-look-smiling-portrait-isolated-long-hair_285396-896.jpg?semt=ais_hybrid&w=740',
      instagram: 'https://www.instagram.com/lilachen_skin',
      username: '@lilachen_skin',
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
                Radiant Skin Care with Glamist
              </Heading>
              <Text
                fontFamily="'Montserrat', sans-serif'"
                fontSize={{ base: 'md', md: 'lg' }}
                color="white"
                maxW="md"
                textShadow="1px 1px 4px rgba(0, 0, 0, 0.2)"
              >
                At Glamist, we offer premium skin care services to rejuvenate and enhance your natural glow. From facials to advanced treatments, we’ve got you covered.
              </Text>
              <Button
                bg={currentTheme.primaryColor}
                color="white"
                size="lg"
                fontFamily="'Montserrat', sans-serif'"
                _hover={{ bg: `${currentTheme.primaryColor.split('.')[0]}.600`, transform: 'scale(1.05)', transition: 'all 0.3s ease' }}
                as="a"
                href="/skinapp"
              >
                Book Your Skin Care Session
              </Button>
            </VStack>
            <MotionBox
              flex="1"
              w={{ base: '100%', md: '50%' }}
              h={{ base: '300px', md: '500px' }}
              bgImage="url('https://images.pexels.com/photos/457701/pexels-photo-457701.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')"
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

      {/* Skin Care Services Section */}
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
            Our Skin Care Services
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={10}>
            {skinServices.map((service, index) => (
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

      {/* Trending Skin Treatments Section */}
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
            Trending Skin Treatments
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            {trendingTreatments.map((treatment, index) => (
              <MotionBox
                key={treatment.title}
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
                    bgImage={`url('${treatment.image}')`}
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
                    {treatment.title}
                  </Heading>
                  <Text
                    fontFamily="'Montserrat', sans-serif'"
                    fontSize="sm"
                    color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
                    textAlign="center"
                  >
                    {treatment.description}
                  </Text>
                </VStack>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Our Skin Specialists Section */}
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
            Meet Our Skin Specialists
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            {specialists.map((specialist, index) => (
              <MotionBox
                key={specialist.name}
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
                      src={specialist.image}
                      alt={specialist.name}
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
                    {specialist.name}
                  </Heading>
                  <Text
                    fontFamily="'Montserrat', sans-serif'"
                    fontSize="sm"
                    color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
                    textAlign="center"
                  >
                    {specialist.specialty}
                  </Text>
                  <Flex align="center" gap={2}>
                    <Link
                      href={specialist.instagram}
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
                      {specialist.username}
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

export default Skin;