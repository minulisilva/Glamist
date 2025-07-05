import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  Box, Container, Heading, SimpleGrid, VStack, Button, Icon, Text,
  FormControl, FormLabel, Input, Textarea, useToast, Flex, Spinner,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody,
  ModalCloseButton, Tabs, TabList, TabPanels, Tab, TabPanel, Badge, HStack,
} from '@chakra-ui/react';
import { FaShoppingCart, FaPlusCircle, FaTrash, FaArrowRight, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { useLanguage } from './LanguageContext';
import { useTheme } from './ThemeContext';
import { useColorMode } from '@chakra-ui/react';

// Language Translations
const translations = {
  en: {
    store: 'Store',
    products: 'Products',
    customOrders: 'Custom Orders',
    orders: 'Orders',
    addToCart: 'Add to Cart',
    submit: 'Submit',
    cancel: 'Cancel',
    loading: 'Loading...',
    error: 'An error occurred.',
    success: 'Action completed successfully!',
    productName: 'Product Name',
    description: 'Description',
    price: 'Price ($)',
    category: 'Category',
    stock: 'Stock',
    image: 'Image (Optional)',
    estimatedPrice: 'Estimated Price ($)',
    submitCustomOrder: 'Submit Custom Order',
    yourCart: 'Your Cart',
    emptyCart: 'Your cart is empty.',
    total: 'Total',
    submitOrder: 'Submit Order',
    filterCategory: 'Filter by Category',
    addProduct: 'Add Product',
    noProducts: 'No products available.',
    noCustomOrders: 'No custom orders available.',
    noOrders: 'No orders available.',
    markCompleted: 'Mark as Completed',
    markPending: 'Mark as Pending',
    deleteCustomOrder: 'Delete Custom Order',
    confirmDelete: 'Are you sure you want to delete this?',
    outOfStock: 'This product is out of stock.',
    stockLimit: 'Cannot add more than available stock.',
    fillAllFields: 'Please fill in all required fields.',
    productAdded: 'Product added successfully!',
    customOrderSuccess: 'Custom order submitted successfully!',
    customOrderFailed: 'Failed to submit custom order.',
    customOrderDeleted: 'Custom order deleted successfully!',
    customOrderDeleteFailed: 'Failed to delete custom order.',
    orderSuccess: 'Order submitted successfully!',
    orderFailed: 'Failed to submit order.',
    statusUpdated: 'Order status updated successfully!',
    statusUpdateFailed: 'Failed to update order status.',
    removedFromCart: 'Item removed from cart.',
    invalidPriceStock: 'Price and stock must be valid non-negative numbers.',
  },
  es: {
    store: 'Tienda',
    products: 'Productos',
    customOrders: 'Pedidos Personalizados',
    orders: 'Pedidos',
    addToCart: 'Añadir al Carrito',
    submit: 'Enviar',
    cancel: 'Cancelar',
    loading: 'Cargando...',
    error: 'Ocurrió un error.',
    success: '¡Acción completada con éxito!',
    productName: 'Nombre del Producto',
    description: 'Descripción',
    price: 'Precio ($)',
    category: 'Categoría',
    stock: 'Inventario',
    image: 'Imagen (Opcional)',
    estimatedPrice: 'Precio Estimado ($)',
    submitCustomOrder: 'Enviar Pedido Personalizado',
    yourCart: 'Tu Carrito',
    emptyCart: 'Tu carrito está vacío.',
    total: 'Total',
    submitOrder: 'Enviar Pedido',
    filterCategory: 'Filtrar por Categoría',
    addProduct: 'Añadir Producto',
    noProducts: 'No hay productos disponibles.',
    noCustomOrders: 'No hay pedidos personalizados disponibles.',
    noOrders: 'No hay pedidos disponibles.',
    markCompleted: 'Marcar como Completado',
    markPending: 'Marcar como Pendiente',
    deleteCustomOrder: 'Eliminar Pedido Personalizado',
    confirmDelete: '¿Estás seguro de que quieres eliminar esto?',
    outOfStock: 'Este producto está fuera de stock.',
    stockLimit: 'No se puede añadir más del stock disponible.',
    fillAllFields: 'Por favor, completa todos los campos requeridos.',
    productAdded: '¡Producto añadido con éxito!',
    customOrderSuccess: '¡Pedido personalizado enviado con éxito!',
    customOrderFailed: 'No se pudo enviar el pedido personalizado.',
    customOrderDeleted: '¡Pedido personalizado eliminado con éxito!',
    customOrderDeleteFailed: 'No se pudo eliminar el pedido personalizado.',
    orderSuccess: '¡Pedido enviado con éxito!',
    orderFailed: 'No se pudo enviar el pedido.',
    statusUpdated: '¡Estado del pedido actualizado con éxito!',
    statusUpdateFailed: 'No se pudo actualizar el estado del pedido.',
    removedFromCart: 'Artículo eliminado del carrito.',
    invalidPriceStock: 'Precio e inventario deben ser números válidos no negativos.',
  },
};

// Memoized ProductCard
const ProductCard = memo(({ product, addToCart, t, currentTheme, colorMode }) => (
  <Box
    bg={colorMode === 'light' ? 'white' : 'gray.700'}
    borderRadius="lg"
    boxShadow="md"
    overflow="hidden"
    _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
    transition="all 0.3s"
    role="group"
    aria-label={`Product: ${product.name}`}
  >
    <Box
      as="img"
      src={product.image ? `http://localhost:4000${product.image}` : 'https://via.placeholder.com/300'}
      alt={product.name}
      h="200px"
      w="full"
      objectFit="cover"
      loading="lazy"
    />
    <Box p={4}>
      <Heading
        as="h3"
        size="md"
        fontFamily="'Playfair Display', serif"
        color={currentTheme.primaryColor}
        mb={2}
      >
        {product.name}
      </Heading>
      <Text
        fontFamily="'Montserrat', sans-serif"
        color={colorMode === 'light' ? 'gray.600' : 'gray.300'}
        fontSize="sm"
        noOfLines={2}
        mb={2}
      >
        {product.description || t('defaultDescription') || 'No description available.'}
      </Text>
      <Text fontFamily="'Montserrat', sans-serif" mb={1}>
        {t('category')}: {product.category}
      </Text>
      <Text fontFamily="'Montserrat', sans-serif" mb={1}>
        {t('stock')}: {product.stock}
      </Text>
      <Text
        fontFamily="'Montserrat', sans-serif"
        color={currentTheme.primaryColor}
        fontWeight="bold"
        mb={4}
      >
        ${product.price.toFixed(2)}
      </Text>
      <Button
        size="sm"
        bg={currentTheme.primaryColor}
        color="white"
        leftIcon={<FaShoppingCart />}
        _hover={{ bg: currentTheme.secondaryColor }}
        onClick={() => addToCart(product)}
        aria-label={`Add ${product.name} to cart`}
        isDisabled={product.stock < 1}
      >
        {t('addToCart')}
      </Button>
    </Box>
  </Box>
));

// Store Component
const Store = () => {
  const { t } = useLanguage();
  const { currentTheme } = useTheme();
  const { colorMode } = useColorMode();
  const toast = useToast();

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [customOrders, setCustomOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState({ products: true, customOrders: true, orders: true });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    image: null,
  });
  const [customOrderFormData, setCustomOrderFormData] = useState({
    name: '',
    description: '',
    estimatedPrice: '',
    image: null,
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isRoleLoading, setIsRoleLoading] = useState(true);

  // API Base URL
  const API_BASE_URL = 'http://localhost:4000';

  // Fetch User Role
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/user/data`, {
          withCredentials: true,
        });
        setUserRole(response.data.success ? response.data.userData.role : null);
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole(null);
      } finally {
        setIsRoleLoading(false);
      }
    };
    fetchUserRole();
  }, []);

  // Fetch Products
  const fetchProducts = useCallback(async () => {
    setLoading((prev) => ({ ...prev, products: true }));
    try {
      const response = await axios.get(`${API_BASE_URL}/products`, {
        params: { category: categoryFilter || undefined },
      });
      setProducts(response.data);
    } catch (err) {
      toast({
        title: t('error'),
        description: t('errorLoadingProducts') || 'Failed to load products.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    setLoading((prev) => ({ ...prev, products: false }));
  }, [categoryFilter, t]);

  // Fetch Custom Orders
  const fetchCustomOrders = useCallback(async () => {
    setLoading((prev) => ({ ...prev, customOrders: true }));
    try {
      const response = await axios.get(`${API_BASE_URL}/customOrders`);
      setCustomOrders(response.data);
    } catch (err) {
      toast({
        title: t('error'),
        description: t('errorLoadingCustomOrders') || 'Failed to load custom orders.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    setLoading((prev) => ({ ...prev, customOrders: false }));
  }, [t]);

  // Fetch Orders
  const fetchOrders = useCallback(async () => {
    setLoading((prev) => ({ ...prev, orders: true }));
    try {
      const response = await axios.get(`${API_BASE_URL}/orders`);
      setOrders(response.data);
    } catch (err) {
      toast({
        title: t('error'),
        description: t('errorLoadingOrders') || 'Failed to load orders.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    setLoading((prev) => ({ ...prev, orders: false }));
  }, [t]);

  useEffect(() => {
    fetchProducts();
    fetchCustomOrders();
    fetchOrders();
  }, [fetchProducts, fetchCustomOrders, fetchOrders]);

  // Handle Product Form Input
  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProductFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Handle Custom Order Form Input
  const handleCustomOrderInputChange = (e) => {
    const { name, value } = e.target;
    setCustomOrderFormData({ ...customOrderFormData, [name]: value });
  };

  const handleCustomOrderFileChange = (e) => {
    setCustomOrderFormData({ ...customOrderFormData, image: e.target.files[0] });
  };

  // Add Product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.price || !formData.stock) {
      toast({
        title: t('error'),
        description: t('fillAllFields'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const price = parseFloat(formData.price);
    const stock = parseInt(formData.stock);
    if (isNaN(price) || price < 0 || isNaN(stock) || stock < 0) {
      toast({
        title: t('error'),
        description: t('invalidPriceStock'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('price', price.toString());
    data.append('stock', stock.toString());
    if (formData.image) data.append('image', formData.image);

    try {
      const response = await axios.post(`${API_BASE_URL}/products`, data, {
        withCredentials: true,
      });
      setProducts([...products, response.data]);
      setFormData({ name: '', description: '', category: '', price: '', stock: '', image: null });
      setIsAddModalOpen(false);
      toast({
        title: t('success'),
        description: t('productAdded'),
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Error adding product:', err.response?.data || err.message);
      toast({
        title: t('error'),
        description: err.response?.data?.message || t('productAddFailed'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Submit Custom Order
  const handleCustomOrderSubmit = async (e) => {
    e.preventDefault();
    if (!customOrderFormData.name || !customOrderFormData.description || !customOrderFormData.estimatedPrice) {
      toast({
        title: t('error'),
        description: t('fillAllFields'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const estimatedPrice = parseFloat(customOrderFormData.estimatedPrice);
    if (isNaN(estimatedPrice) || estimatedPrice < 0) {
      toast({
        title: t('error'),
        description: t('invalidPriceStock'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const data = new FormData();
    data.append('name', customOrderFormData.name);
    data.append('description', customOrderFormData.description);
    data.append('estimatedPrice', estimatedPrice.toString());
    if (customOrderFormData.image) data.append('image', customOrderFormData.image);

    try {
      await axios.post(`${API_BASE_URL}/customOrders`, data);
      toast({
        title: t('success'),
        description: t('customOrderSuccess'),
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setCustomOrderFormData({ name: '', description: '', estimatedPrice: '', image: null });
      e.target.reset();
      fetchCustomOrders();
    } catch (err) {
      toast({
        title: t('error'),
        description: t('customOrderFailed'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Delete Custom Order
  const handleDeleteCustomOrder = async (customOrderId) => {
    if (!window.confirm(t('confirmDelete'))) return;
    try {
      await axios.delete(`${API_BASE_URL}/customOrders/${customOrderId}`);
      setCustomOrders(customOrders.filter((co) => co._id !== customOrderId));
      toast({
        title: t('success'),
        description: t('customOrderDeleted'),
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: t('error'),
        description: t('customOrderDeleteFailed'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Add to Cart
  const addToCart = useCallback((product) => {
    if (product.stock < 1) {
      toast({
        title: t('error'),
        description: t('outOfStock'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.productId === product._id);
      if (existingItem) {
        if (existingItem.quantity + 1 > product.stock) {
          toast({
            title: t('error'),
            description: t('stockLimit'),
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return prevCart;
        }
        return prevCart.map((item) =>
          item.productId === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prevCart,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ];
    });
    toast({
      title: t('success'),
      description: `${product.name} ${t('addedToCart')}`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  }, [t]);

  // Update Cart Quantity
  const updateQuantity = (productId, quantity) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return;
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    if (quantity > product.stock) {
      toast({
        title: t('error'),
        description: t('stockLimit'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId ? { ...item, quantity: parseInt(quantity) } : item
      )
    );
  };

  // Remove from Cart
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
    toast({
      title: t('success'),
      description: t('removedFromCart'),
      status: 'info',
      duration: 3000,
      isClosable: true,
      position: 'top-right',
    });
  };

  // Submit Order
  const submitOrder = async () => {
    if (cart.length === 0) {
      toast({
        title: t('error'),
        description: t('emptyCart'),
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    try {
      await axios.post(`${API_BASE_URL}/orders`, { items: cart, total });
      toast({
        title: t('success'),
        description: t('orderSuccess'),
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      setCart([]);
      fetchOrders();
    } catch (err) {
      toast({
        title: t('error'),
        description: t('orderFailed'),
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  // Update Order Status
  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`${API_BASE_URL}/orders/${orderId}`, { status });
      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? { ...order, status } : order))
      );
      toast({
        title: t('success'),
        description: t('statusUpdated'),
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (err) {
      toast({
        title: t('error'),
        description: t('statusUpdateFailed'),
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  if (isRoleLoading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box bg={colorMode === 'light' ? 'gray.50' : 'gray.900'} minH="100vh">
      {/* Hero Section */}
      <Box
        bgImage="url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80)"
        bgSize="cover"
        bgPosition="center"
        h={{ base: '40vh', md: '50vh' }}
        position="relative"
        display="flex"
        alignItems="center"
        aria-label="Store hero section"
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgGradient={`linear(to-r, ${currentTheme.primaryColor}, ${currentTheme.secondaryColor})`}
          opacity={0.7}
        />
        <Container maxW="container.lg" zIndex={2}>
          <VStack spacing={4} align="center" color="white">
            <Heading
              as="h1"
              size={{ base: 'xl', md: '2xl' }}
              fontFamily="'Playfair Display', serif"
              textShadow="2px 2px 8px rgba(0, 0, 0, 0.3)"
            >
              {t('store')}
            </Heading>
            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              fontFamily="'Montserrat', sans-serif"
              textShadow="1px 1px 4px rgba(0, 0, 0, 0.2)"
            >
              {t('storeTagline') || 'Discover our premium products and custom orders.'}
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="container.xl" py={12}>
        <Tabs variant="enclosed" colorScheme="teal">
          <TabList>
            <Tab>{t('products')}</Tab>
            <Tab>{t('customOrders')}</Tab>
            <Tab>{t('orders')}</Tab>
            <Tab>{t('yourCart')}</Tab>
          </TabList>

          <TabPanels>
            {/* Products Tab */}
            <TabPanel>
              <VStack spacing={8} align="stretch">
                <Flex justify="space-between" align="center">
                  <Heading
                    as="h2"
                    size="lg"
                    fontFamily="'Playfair Display', serif"
                    color={currentTheme.primaryColor}
                  >
                    {t('products')}
                  </Heading>
                  {userRole && userRole === 'admin' && (
                    <Button
                      size="md"
                      bg={currentTheme.primaryColor}
                      color="white"
                      leftIcon={<FaPlus />}
                      _hover={{ bg: currentTheme.secondaryColor }}
                      onClick={() => setIsAddModalOpen(true)}
                      aria-label="Add new product"
                    >
                      {t('addProduct')}
                    </Button>
                  )}
                </Flex>
                <FormControl>
                  <FormLabel>{t('filterCategory')}</FormLabel>
                  <Input
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    placeholder={t('filterCategory')}
                    bg={colorMode === 'light' ? 'gray.100' : 'gray.600'}
                  />
                </FormControl>
                {loading.products ? (
                  <Flex align="center" gap={2} justify="center">
                    <Spinner />
                    <Text>{t('loading')}</Text>
                  </Flex>
                ) : products.length === 0 ? (
                  <Text fontSize="lg" color={colorMode === 'light' ? 'gray.600' : 'gray.300'}>
                    {t('noProducts')}
                  </Text>
                ) : (
                  <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
                    {products.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        addToCart={addToCart}
                        t={t}
                        currentTheme={currentTheme}
                        colorMode={colorMode}
                      />
                    ))}
                  </SimpleGrid>
                )}
              </VStack>
            </TabPanel>

            {/* Custom Orders Tab */}
            <TabPanel>
              <VStack spacing={8} align="stretch">
                <Heading
                  as="h2"
                  size="lg"
                  fontFamily="'Playfair Display', serif"
                  color={currentTheme.primaryColor}
                >
                  {t('customOrders')}
                </Heading>
                <Box
                  bg={colorMode === 'light' ? 'white' : 'gray.700'}
                  p={6}
                  borderRadius="lg"
                  boxShadow="md"
                >
                  <form onSubmit={handleCustomOrderSubmit} aria-label="Custom order form">
                    <VStack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>{t('productName')}</FormLabel>
                        <Input
                          name="name"
                          value={customOrderFormData.name}
                          onChange={handleCustomOrderInputChange}
                          bg={colorMode === 'light' ? 'gray.100' : 'gray.600'}
                          aria-required="true"
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>{t('description')}</FormLabel>
                        <Textarea
                          name="description"
                          value={customOrderFormData.description}
                          onChange={handleCustomOrderInputChange}
                          bg={colorMode === 'light' ? 'gray.100' : 'gray.600'}
                          rows={4}
                          aria-required="true"
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>{t('estimatedPrice')}</FormLabel>
                        <Input
                          type="number"
                          name="estimatedPrice"
                          value={customOrderFormData.estimatedPrice}
                          onChange={handleCustomOrderInputChange}
                          bg={colorMode === 'light' ? 'gray.100' : 'gray.600'}
                          min="0"
                          step="0.01"
                          aria-required="true"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>{t('image')}</FormLabel>
                        <Input
                          type="file"
                          name="image"
                          accept="image/*"
                          onChange={handleCustomOrderFileChange}
                          bg={colorMode === 'light' ? 'gray.100' : 'gray.600'}
                          p={1}
                        />
                      </FormControl>
                      <Button
                        type="submit"
                        size="md"
                        bg={currentTheme.primaryColor}
                        color="white"
                        leftIcon={<FaPlusCircle />}
                        _hover={{ bg: currentTheme.secondaryColor }}
                        w="full"
                        aria-label="Submit custom order"
                      >
                        {t('submitCustomOrder')}
                      </Button>
                    </VStack>
                  </form>
                </Box>
                {loading.customOrders ? (
                  <Flex align="center" gap={2} justify="center">
                    <Spinner />
                    <Text>{t('loading')}</Text>
                  </Flex>
                ) : customOrders.length === 0 ? (
                  <Text fontSize="lg" color={colorMode === 'light' ? 'gray.600' : 'gray.300'}>
                    {t('noCustomOrders')}
                  </Text>
                ) : (
                  <VStack spacing={4} align="stretch">
                    {customOrders.map((customOrder) => (
                      <Box
                        key={customOrder._id}
                        bg={colorMode === 'light' ? 'white' : 'gray.700'}
                        p={4}
                        borderRadius="lg"
                        boxShadow="md"
                      >
                        <Text fontWeight="bold">{customOrder.name}</Text>
                        <Text>{customOrder.description}</Text>
                        <Text>{t('estimatedPrice')}: ${customOrder.estimatedPrice}</Text>
                        {customOrder.image && (
                          <Box
                            as="img"
                            src={`http://localhost:4000${customOrder.image}`}
                            alt={customOrder.name}
                            h="100px"
                            objectFit="cover"
                            borderRadius="md"
                            mt={2}
                          />
                        )}
                        <Button
                          size="sm"
                          colorScheme="red"
                          leftIcon={<FaTrash />}
                          mt={2}
                          onClick={() => handleDeleteCustomOrder(customOrder._id)}
                          aria-label={`Delete custom order ${customOrder.name}`}
                        >
                          {t('deleteCustomOrder')}
                        </Button>
                      </Box>
                    ))}
                  </VStack>
                )}
              </VStack>
            </TabPanel>

            {/* Orders Tab */}
            <TabPanel>
              <VStack spacing={8} align="stretch">
                <Heading
                  as="h2"
                  size="lg"
                  fontFamily="'Playfair Display', serif"
                  color={currentTheme.primaryColor}
                >
                  {t('orders')}
                </Heading>
                {loading.orders ? (
                  <Flex align="center" gap={2} justify="center">
                    <Spinner />
                    <Text>{t('loading')}</Text>
                  </Flex>
                ) : orders.length === 0 ? (
                  <Text fontSize="lg" color={colorMode === 'light' ? 'gray.600' : 'gray.300'}>
                    {t('noOrders')}
                  </Text>
                ) : (
                  <VStack spacing={4} align="stretch">
                    {orders.map((order) => (
                      <Box
                        key={order._id}
                        bg={colorMode === 'light' ? 'white' : 'gray.700'}
                        p={4}
                        borderRadius="lg"
                        boxShadow="md"
                      >
                        <HStack justify="space-between">
                          <Text fontWeight="bold">{t('total')}: ${order.total}</Text>
                          <Badge colorScheme={order.status === 'Completed' ? 'green' : 'yellow'}>
                            {order.status}
                          </Badge>
                        </HStack>
                        <Text>{t('date')}: {new Date(order.date).toLocaleDateString()}</Text>
                        <Text fontWeight="bold" mt={2}>{t('items')}:</Text>
                        <VStack align="start" spacing={1}>
                          {order.items.map((item, index) => (
                            <Text key={index}>
                              {item.name} - ${item.price} x {item.quantity}
                            </Text>
                          ))}
                        </VStack>
                        <HStack mt={4}>
                          <Button
                            size="sm"
                            colorScheme="green"
                            onClick={() => updateOrderStatus(order._id, 'Completed')}
                            isDisabled={order.status === 'Completed'}
                          >
                            {t('markCompleted')}
                          </Button>
                          <Button
                            size="sm"
                            colorScheme="yellow"
                            onClick={() => updateOrderStatus(order._id, 'Pending')}
                            isDisabled={order.status === 'Pending'}
                          >
                            {t('markPending')}
                          </Button>
                        </HStack>
                      </Box>
                    ))}
                  </VStack>
                )}
              </VStack>
            </TabPanel>

            {/* Cart Tab */}
            <TabPanel>
              <VStack spacing={8} align="stretch">
                <Heading
                  as="h2"
                  size="lg"
                  fontFamily="'Playfair Display', serif"
                  color={currentTheme.primaryColor}
                >
                  {t('yourCart')}
                </Heading>
                {cart.length === 0 ? (
                  <Text fontSize="lg" color={colorMode === 'light' ? 'gray.600' : 'gray.300'}>
                    {t('emptyCart')}
                  </Text>
                ) : (
                  <Box
                    bg={colorMode === 'light' ? 'white' : 'gray.700'}
                    p={6}
                    borderRadius="lg"
                    boxShadow="md"
                    aria-label="Cart items"
                  >
                    {cart.map((item) => (
                      <Flex
                        key={item.productId}
                        justify="space-between"
                        align="center"
                        borderBottom="1px solid"
                        borderColor={colorMode === 'light' ? 'gray.200' : 'gray.600'}
                        py={4}
                      >
                        <VStack align="start" spacing={1}>
                          <Text
                            fontFamily="'Playfair Display', serif"
                            fontSize="md"
                            color={currentTheme.primaryColor}
                          >
                            {item.name}
                          </Text>
                          <Text
                            fontFamily="'Montserrat', sans-serif"
                            color={colorMode === 'light' ? 'gray.600' : 'gray.300'}
                          >
                            ${item.price.toFixed(2)} x
                          </Text>
                        </VStack>
                        <Flex align="center" gap={4}>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.productId, e.target.value)}
                            w="60px"
                            bg={colorMode === 'light' ? 'gray.100' : 'gray.600'}
                            textAlign="center"
                            min="1"
                            aria-label={`Quantity for ${item.name}`}
                          />
                          <Button
                            size="sm"
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => removeFromCart(item.productId)}
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            <FaTrash />
                          </Button>
                        </Flex>
                      </Flex>
                    ))}
                    <Flex justify="space-between" align="center" mt={6}>
                      <Text
                        fontFamily="'Playfair Display', serif"
                        fontSize="lg"
                        color={currentTheme.primaryColor}
                        fontWeight="bold"
                      >
                        {t('total')}: $
                        {cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                      </Text>
                      <Button
                        size="md"
                        bg={currentTheme.primaryColor}
                        color="white"
                        rightIcon={<FaArrowRight />}
                        _hover={{ bg: currentTheme.secondaryColor }}
                        onClick={submitOrder}
                        aria-label="Submit order"
                      >
                        {t('submitOrder')}
                      </Button>
                    </Flex>
                  </Box>
                )}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>

      {/* Add Product Modal */}
      {userRole && userRole === 'admin' && (
        <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{t('addProduct')}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form onSubmit={handleAddProduct}>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>{t('productName')}</FormLabel>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleProductInputChange}
                      bg={colorMode === 'light' ? 'gray.100' : 'gray.600'}
                      aria-required="true"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>{t('description')}</FormLabel>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleProductInputChange}
                      bg={colorMode === 'light' ? 'gray.100' : 'gray.600'}
                      rows={4}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>{t('category')}</FormLabel>
                    <Input
                      name="category"
                      value={formData.category}
                      onChange={handleProductInputChange}
                      bg={colorMode === 'light' ? 'gray.100' : 'gray.600'}
                      aria-required="true"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>{t('price')}</FormLabel>
                    <Input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleProductInputChange}
                      bg={colorMode === 'light' ? 'gray.100' : 'gray.600'}
                      min="0"
                      step="0.01"
                      aria-required="true"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>{t('stock')}</FormLabel>
                    <Input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleProductInputChange}
                      bg={colorMode === 'light' ? 'gray.100' : 'gray.600'}
                      min="0"
                      aria-required="true"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>{t('image')}</FormLabel>
                    <Input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleProductFileChange}
                      bg={colorMode === 'light' ? 'gray.100' : 'gray.600'}
                      p={1}
                    />
                  </FormControl>
                </VStack>
              </form>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="teal"
                mr={3}
                onClick={handleAddProduct}
                aria-label="Submit new product"
              >
                {t('submit')}
              </Button>
              <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
                {t('cancel')}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default Store;