
import React, { useState, useEffect } from 'react';
import {
  Box, Heading, SimpleGrid, VStack, Input, Textarea, Button, Image, Text, Modal,
  ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  useColorMode, useToast, FormControl, FormLabel,
} from '@chakra-ui/react';
import axios from 'axios';
import { useLanguage } from './LanguageContext';
import { useTheme } from './ThemeContext';

const ProductShowcase = ({ isAdmin }) => {
  const { colorMode } = useColorMode();
  const { t } = useLanguage();
  const { currentTheme } = useTheme();
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', image: '' });
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: t('error'),
        description: t('fetchProductsError'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleAddProduct = async () => {
    try {
      await axios.post('http://localhost:3000/api/products', newProduct);
      setNewProduct({ name: '', description: '', price: '', image: '' });
      fetchProducts();
      toast({
        title: t('success'),
        description: t('productAdded'),
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: t('error'),
        description: t('addProductError'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEditProduct = async () => {
    try {
      await axios.put(`http://localhost:3000/api/products/${editingProduct._id}`, editingProduct);
      setEditingProduct(null);
      fetchProducts();
      toast({
        title: t('success'),
        description: t('productUpdated'),
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error editing product:', error);
      toast({
        title: t('error'),
        description: t('editProductError'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/products/${id}`);
      fetchProducts();
      toast({
        title: t('success'),
        description: t('productDeleted'),
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: t('error'),
        description: t('deleteProductError'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box py={10} px={{ base: 4, md: 8 }} bg={colorMode === 'light' ? 'white' : 'gray.800'}>
      <Heading as="h1" size="xl" mb={6} textAlign="center" color={currentTheme.primaryColor}>
        {t('productShowcase')}
      </Heading>

      {isAdmin && (
        <VStack spacing={4} mb={8} align="start" maxW="container.sm" mx="auto">
          <Heading as="h2" size="md" color={currentTheme.primaryColor}>
            {t('addProduct')}
          </Heading>
          <FormControl>
            <FormLabel>{t('productName')}</FormLabel>
            <Input
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              placeholder={t('productName')}
              bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
            />
          </FormControl>
          <FormControl>
            <FormLabel>{t('description')}</FormLabel>
            <Textarea
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              placeholder={t('description')}
              bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
            />
          </FormControl>
          <FormControl>
            <FormLabel>{t('price')}</FormLabel>
            <Input
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              placeholder={t('price')}
              bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
            />
          </FormControl>
          <FormControl>
            <FormLabel>{t('imageUrl')}</FormLabel>
            <Input
              value={newProduct.image}
              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
              placeholder={t('imageUrl')}
              bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
            />
          </FormControl>
          <Button
            onClick={handleAddProduct}
            bg={currentTheme.primaryColor}
            color="white"
            _hover={{ bg: currentTheme.secondaryColor }}
          >
            {t('addProduct')}
          </Button>
        </VStack>
      )}

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {products.map((product) => (
          <VStack
            key={product._id}
            p={4}
            borderWidth="1px"
            borderRadius="md"
            bg={colorMode === 'light' ? 'white' : 'gray.700'}
            boxShadow="md"
            align="start"
          >
            <Image
              src={product.image || 'https://via.placeholder.com/150'}
              alt={product.name}
              boxSize="200px"
              objectFit="cover"
              borderRadius="md"
              mb={4}
            />
            <Heading as="h3" size="md" color={currentTheme.primaryColor}>
              {product.name}
            </Heading>
            <Text color={colorMode === 'light' ? 'gray.600' : 'gray.300'}>{product.description}</Text>
            <Text fontWeight="bold" color={currentTheme.secondaryColor}>
              ${product.price}
            </Text>
            {isAdmin && (
              <VStack spacing={2} mt={4}>
                <Button
                  size="sm"
                  bg={currentTheme.primaryColor}
                  color="white"
                  _hover={{ bg: currentTheme.secondaryColor }}
                  onClick={() => setEditingProduct(product)}
                >
                  {t('edit')}
                </Button>
                <Button
                  size="sm"
                  bg="red.500"
                  color="white"
                  _hover={{ bg: 'red.600' }}
                  onClick={() => handleDeleteProduct(product._id)}
                >
                  {t('delete')}
                </Button>
              </VStack>
            )}
          </VStack>
        ))}
      </SimpleGrid>

      {editingProduct && (
        <Modal isOpen={!!editingProduct} onClose={() => setEditingProduct(null)}>
          <ModalOverlay />
          <ModalContent bg={colorMode === 'light' ? 'white' : 'gray.800'}>
            <ModalHeader color={currentTheme.primaryColor}>{t('editProduct')}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>{t('productName')}</FormLabel>
                  <Input
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>{t('description')}</FormLabel>
                  <Textarea
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>{t('price')}</FormLabel>
                  <Input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>{t('imageUrl')}</FormLabel>
                  <Input
                    value={editingProduct.image}
                    onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                    bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button
                mr={3}
                onClick={() => setEditingProduct(null)}
                bg="gray.500"
                color="white"
                _hover={{ bg: 'gray.600' }}
              >
                {t('cancel')}
              </Button>
              <Button
                bg={currentTheme.primaryColor}
                color="white"
                _hover={{ bg: currentTheme.secondaryColor }}
                onClick={handleEditProduct}
              >
                {t('save')}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default ProductShowcase;
