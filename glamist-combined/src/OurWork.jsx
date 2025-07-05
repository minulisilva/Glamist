import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Icon,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from '@chakra-ui/react';
import { FaHeart } from 'react-icons/fa';
import { useColorMode } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeContext';
import WorkForm from './WorkForm';
import axios from 'axios';

const MotionBox = motion(Box);
const MotionIcon = motion(Icon);

// Animation Variants (unchanged)
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

const featuredArtistVariants = {
  animate: {
    rotate: [0, 2, -2, 0],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
};

const OurWork = () => {
  const { colorMode } = useColorMode();
  const { themeKey, currentTheme, currentBackgroundImages } = useTheme();
  const currentBackgroundImage = currentBackgroundImages[0];
  const [pastWork, setPastWork] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedWork, setSelectedWork] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Fetch user role
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/user/data', {
          withCredentials: true,
        });
        setUserRole(response.data.success ? response.data.userData.role : null);
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserRole();
  }, []);

  // Fetch works from the backend
  const fetchWorks = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/works');
      const { success, data, message } = await response.json();
      if (success) {
        console.log('Fetched works:', data); // Debug: Log the fetched works to check IDs
        setPastWork(data);
        setFetchError(null);
      } else {
        console.error('Error fetching works:', message);
        setFetchError(message || 'Failed to fetch works.');
      }
    } catch (err) {
      console.error('Error fetching works:', err.message);
      setFetchError('A network error occurred while fetching works.');
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  // Handle delete
  const handleDelete = async (id) => {
    console.log('Attempting to delete ID:', id); // Debug: Log the ID being deleted
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      console.error('Invalid work ID:', id);
      return;
    }
    try {
      const response = await fetch(`http://localhost:4000/api/works/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const { success, message } = await response.json();
      if (success) {
        fetchWorks();
      } else {
        console.error('Error deleting work:', message);
      }
    } catch (err) {
      console.error('Error deleting work:', err.message);
    }
  };

  // Handle form open/close
  const openForm = (work = null) => {
    console.log('Opening form for work ID:', work?._id); // Debug: Log the ID when opening form
    setSelectedWork(work);
    setIsOpen(true);
  };

  const closeForm = () => {
    setSelectedWork(null);
    setIsOpen(false);
    fetchWorks();
  };

  // Featured artist data
  const featuredArtist = {
    name: 'Maya',
    bio: 'Specializing in vibrant hair transformations and radiant skin treatments, Maya brings bold creativity to every project.',
    works: pastWork.filter((work) => work.artist === 'Maya'),
  };

  // Placeholder image for missing images
  const placeholderImage = '/images/placeholder.jpg';

  // Check if user is admin or owner
  const isAdminOrOwner = ['admin', 'owner'].includes(userRole);

  if (isLoading) {
    return <Box>Loading...</Box>;
  }

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
          <VStack spacing={6} textAlign="center">
            <Heading
              as="h1"
              size={{ base: '2xl', md: '3xl' }}
              fontFamily="'Playfair Display', serif"
              color="white"
              lineHeight="1.2"
              textShadow="2px 2px 8px rgba(0, 0, 0, 0.3)"
            >
              Glamist Lookbook
            </Heading>
            <Text
              fontFamily="'Montserrat', sans-serif'"
              fontSize={{ base: 'md', md: 'lg' }}
              color="white"
              maxW="2xl"
              textShadow="1px 1px 4px rgba(0, 0, 0, 0.2)"
            >
              Dive into the creative world of Glamist. Discover our artists’ masterpieces!
            </Text>
            {isAdminOrOwner && (
              <Button colorScheme="teal" onClick={() => openForm()}>
                Add New Work
              </Button>
            )}
          </VStack>
        </Container>
      </MotionBox>

      {/* Form Modal */}
      {isAdminOrOwner && (
        <Modal isOpen={isOpen} onClose={closeForm}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedWork ? 'Edit Work' : 'Add New Work'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <WorkForm work={selectedWork} onSave={closeForm} onCancel={closeForm} />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}

      {/* Gallery Section */}
      <Box as="section" py={{ base: 10, md: 14 }} bg={colorMode === 'light' ? 'white' : 'gray.800'}>
        <Container maxW="container.xl">
          {fetchError && (
            <Text color="red.500" textAlign="center" mb={4}>
              {fetchError}
            </Text>
          )}
          {/* Featured Artist Section */}
          <Heading
            as="h2"
            size="lg"
            fontFamily="'Playfair Display', serif"
            color={colorMode === 'light' ? currentTheme.primaryColor : currentTheme.secondaryColor}
            textAlign="center"
            mb={8}
          >
            Featured Artist: {featuredArtist.name}
          </Heading>
          <MotionBox
            mb={12}
            p={6}
            bg={colorMode === 'light' ? `${currentTheme.sectionBg}` : 'gray.700'}
            borderRadius="lg"
            boxShadow="md"
            variants={featuredArtistVariants}
            animate="animate"
          >
            <VStack spacing={4}>
              <Text
                fontFamily="'Montserrat', sans-serif'"
                fontSize="md"
                color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
                textAlign="center"
                maxW="md"
              >
                {featuredArtist.bio}
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {featuredArtist.works.map((work, index) => (
                  <MotionBox
                    key={work._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                  >
                    <VStack spacing={3} align="center">
                      <MotionBox
                        w="100%"
                        h={work.height}
                        bgImage={work.image ? `url('http://localhost:4000/uploads/${work.image.split('/uploads/')[1]}')` : `url('${placeholderImage}')`}
                        bgSize="cover"
                        bgPosition="center"
                        borderRadius="lg"
                        boxShadow="xl"
                        position="relative"
                        whileHover={{ scale: 1.05, boxShadow: '2xl', rotate: 2 }}
                        transition={{ duration: 0.3 }}
                        _before={{
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          bg: 'rgba(0, 0, 0, 0.2)',
                          borderRadius: 'lg',
                        }}
                      >
                        <Text
                          position="absolute"
                          top={2}
                          left={2}
                          bg={currentTheme.primaryColor}
                          color="white"
                          px={2}
                          py={1}
                          borderRadius="md"
                          fontSize="sm"
                          fontFamily="'Montserrat', sans-serif'"
                        >
                          {work.category}
                        </Text>
                      </MotionBox>
                      <Heading
                        as="h3"
                        size="md"
                        fontFamily="'Playfair Display', serif"
                        color={colorMode === 'light' ? currentTheme.primaryColor : currentTheme.secondaryColor}
                      >
                        {work.title}
                      </Heading>
                      <Text
                        fontFamily="'Montserrat', sans-serif'"
                        fontSize="sm"
                        color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
                        textAlign="center"
                      >
                        {work.description}
                      </Text>
                      {isAdminOrOwner && (
                        <Box>
                          <Button size="sm" colorScheme="teal" onClick={() => openForm(work)} mr={2}>
                            Edit
                          </Button>
                          <Button size="sm" colorScheme="red" onClick={() => handleDelete(work._id)}>
                            Delete
                          </Button>
                        </Box>
                      )}
                    </VStack>
                  </MotionBox>
                ))}
              </SimpleGrid>
            </VStack>
          </MotionBox>

          {/* All Works Section */}
          <Heading
            as="h2"
            size="lg"
            fontFamily="'Playfair Display', serif"
            color={colorMode === 'light' ? currentTheme.primaryColor : currentTheme.secondaryColor}
            textAlign="center"
            mb={8}
          >
            Explore All Creations
          </Heading>
          <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
            {pastWork.map((work, index) => (
              <MotionBox
                key={work._id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <VStack spacing={3} align="center">
                  <MotionBox
                    w="100%"
                    h={work.height}
                    bgImage={work.image ? `url('http://localhost:4000/uploads/${work.image.split('/uploads/')[1]}')` : `url('${placeholderImage}')`}
                    bgSize="cover"
                    bgPosition="center"
                    borderRadius="lg"
                    boxShadow="md"
                    position="relative"
                    whileHover={{ scale: 1.03, boxShadow: 'lg', rotate: 1 }}
                    transition={{ duration: 0.3 }}
                    _before={{
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bg: 'rgba(0, 0, 0, 0.1)',
                      borderRadius: 'lg',
                    }}
                  >
                    <Text
                      position="absolute"
                      top={2}
                      left={2}
                      bg={currentTheme.primaryColor}
                      color="white"
                      px={2}
                      py={1}
                      borderRadius="md"
                      fontSize="sm"
                      fontFamily="'Montserrat', sans-serif'"
                    >
                      {work.category}
                    </Text>
                  </MotionBox>
                  <Heading
                    as="h3"
                    size="md"
                    fontFamily="'Playfair Display', serif"
                    color={colorMode === 'light' ? currentTheme.primaryColor : currentTheme.secondaryColor}
                  >
                    {work.title}
                  </Heading>
                  <Text
                    fontFamily="'Montserrat', sans-serif'"
                    fontSize="sm"
                    color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
                    textAlign="center"
                  >
                    {work.description}
                  </Text>
                  <Text
                    fontFamily="'Montserrat', sans-serif'"
                    fontSize="xs"
                    color={colorMode === 'light' ? 'gray.500' : 'gray.400'}
                  >
                    By {work.artist}
                  </Text>
                  {isAdminOrOwner && (
                    <Box>
                      <Button size="sm" colorScheme="teal" onClick={() => openForm(work)} mr={2}>
                        Edit
                      </Button>
                      <Button size="sm" colorScheme="red" onClick={() => handleDelete(work._id)}>
                        Delete
                      </Button>
                    </Box>
                  )}
                </VStack>
              </MotionBox>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default OurWork;