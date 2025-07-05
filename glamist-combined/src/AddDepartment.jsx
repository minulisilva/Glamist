import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  Text,
  useToast,
  useColorMode,
} from '@chakra-ui/react';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { useLanguage } from './LanguageContext';
import { useTheme } from './ThemeContext';

function AddDepartment() {
  const { t } = useLanguage();
  const { currentTheme, colorMode } = useTheme();
  const { colorMode: chakraColorMode } = useColorMode();
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    DepartmentName: '',
    Description: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.DepartmentName.trim()) newErrors.DepartmentName = t('departmentNameRequired');
    if (!formData.Description.trim()) newErrors.Description = t('descriptionRequired');

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await axios.post('http://localhost:4000/api/department', formData, {
        withCredentials: true,
      });
      setFormData({ DepartmentName: '', Description: '' });
      toast({
        title: t('success'),
        description: t('departmentAddedSuccess'),
        status: 'success',
        duration: 3000,
        isClosable: true,
        icon: <FaCheckCircle />,
      });
      navigate('/view-departments');
    } catch (error) {
      console.error('Error adding department:', error.response?.data || error.message);
      toast({
        title: t('error'),
        description: t('failedToAddDepartment'),
        status: 'error',
        duration: 3000,
        isClosable: true,
        icon: <FaExclamationCircle />,
      });
    }
  };

  return (
    <Box
      py={10}
      px={{ base: 4, md: 10 }}
      bg={chakraColorMode === 'light' ? 'gray.50' : 'gray.900'}
      minH="100vh"
    >
      <Heading
        as="h1"
        size="2xl"
        fontFamily="'Playfair Display', serif"
        color={currentTheme.primaryColor}
        mb={6}
      >
        {t('addDepartment')}
      </Heading>

      <Box maxW="lg" bg={chakraColorMode === 'light' ? 'white' : 'gray.700'} p={6} rounded="2xl" shadow="lg">
        <form onSubmit={handleSubmit}>
          <VStack spacing={6}>
            <FormControl isInvalid={!!errors.DepartmentName}>
              <FormLabel fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>
                {t('departmentName')}
              </FormLabel>
              <Input
                name="DepartmentName"
                value={formData.DepartmentName}
                onChange={handleChange}
                placeholder={t('enterDepartmentName')}
                focusBorderColor={currentTheme.primaryColor}
              />
              {errors.DepartmentName && <Text color="red.500" fontSize="sm">{errors.DepartmentName}</Text>}
            </FormControl>

            <FormControl isInvalid={!!errors.Description}>
              <FormLabel fontFamily="'Montserrat', sans-serif" color={currentTheme.primaryColor}>
                {t('description')}
              </FormLabel>
              <Textarea
                name="Description"
                value={formData.Description}
                onChange={handleChange}
                placeholder={t('enterDescription')}
                rows={4}
                focusBorderColor={currentTheme.primaryColor}
              />
              {errors.Description && <Text color="red.500" fontSize="sm">{errors.Description}</Text>}
            </FormControl>

            <Button
              type="submit"
              colorScheme={currentTheme.primaryColor.split('.')[0]}
              size="lg"
              w="full"
              borderRadius="full"
              _hover={{ transform: 'scale(1.05)' }}
            >
              {t('addDepartment')}
            </Button>
          </VStack>
        </form>
      </Box>

      <Link to="/">
        <Button
          variant="link"
          color={currentTheme.primaryColor}
          mt={6}
          _hover={{ textDecoration: 'underline' }}
        >
          {t('backToDashboard')}
        </Button>
      </Link>
    </Box>
  );
}

export default AddDepartment;