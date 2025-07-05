import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Container, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, Button, Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalBody, ModalFooter, ModalCloseButton, FormControl, FormLabel, Input, Select, Textarea,
  useToast, useDisclosure, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader,
  AlertDialogBody, AlertDialogFooter, Spinner, VStack, Flex, Grid, GridItem, InputGroup, InputLeftElement,
  IconButton, Badge, Checkbox, Menu, MenuButton, MenuList, MenuItem, Tag, TagLabel, Tabs, TabList, TabPanels, Tab, TabPanel,
  SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, Card, CardHeader, CardBody
} from '@chakra-ui/react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useLanguage } from './LanguageContext';
import { useTheme } from './ThemeContext';
import { useColorMode } from '@chakra-ui/react';
import { SearchIcon, ChevronDownIcon, DownloadIcon } from '@chakra-ui/icons';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MotionBox = motion(Box);
const MotionTr = motion(Tr);

const InventoryManagement = () => {
  const { t } = useLanguage();
  const { currentTheme } = useTheme();
  const { colorMode } = useColorMode();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isUseOpen, onOpen: onUseOpen, onClose: onUseClose } = useDisclosure();
  const { isOpen: isReportOpen, onOpen: onReportOpen, onClose: onReportClose } = useDisclosure();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '', quantity: '', price: '', supplier: '', description: '', category: ''
  });
  const [usageData, setUsageData] = useState({ quantity: '', reason: '' });
  const [reportData, setReportData] = useState({ period: 'weekly', startDate: '' });
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [categories, setCategories] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [usageReport, setUsageReport] = useState([]);
  const [usageFilter, setUsageFilter] = useState({ category: 'All Categories', productId: 'All Products' });
  const [activeTab, setActiveTab] = useState(0);
  const cancelRef = React.useRef();

  // Predefined categories for salon management
  const PREDEFINED_CATEGORIES = ['Hair', 'Nail', 'Tattoo', 'Piercings', 'Bridal', 'Skin'];

  // Responsive font sizes
  const headingSize = { base: 'xl', md: '2xl', lg: '3xl' };
  const buttonSize = { base: 'sm', md: 'md' };

  // Fetch all products and dashboard data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchProducts();
      fetchDashboardData();
    };
    fetchInitialData();
  }, []);

  // Fetch categories after products are loaded
  useEffect(() => {
    console.log('Triggering fetchCategories with products:', products);
    fetchCategories();
  }, [products]);

  // Fetch usage report when the "Report Usage" tab is active
  useEffect(() => {
    if (activeTab === 2) {
      fetchUsageReport();
    }
  }, [activeTab, usageFilter]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/api/inventory', { withCredentials: true });
      if (response.data.success) {
        console.log('Products fetched:', response.data.data);
        const productCategories = [...new Set(response.data.data.map(p => p.category).filter(c => c && typeof c === 'string' && c.trim() !== ''))];
        console.log('Categories derived from products:', productCategories);
        setProducts(response.data.data || []);
      } else {
        throw new Error(response.data.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error.message);
      toast({
        title: t('error') || 'Error',
        description: error.message || (t('fetchProductsError') || 'Failed to fetch products'),
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    console.log('Fetching categories...');
    try {
      const response = await axios.get('http://localhost:4000/api/inventory/categories', { withCredentials: true });
      console.log('API Categories Response:', response.data);
      if (response.data.success) {
        const apiCategories = response.data.data || [];
        console.log('Categories fetched from API:', apiCategories);
        
        // Merge API categories with predefined categories
        let finalCategories = [...new Set([...apiCategories, ...PREDEFINED_CATEGORIES])].sort();
        console.log('Final categories (API + Predefined):', finalCategories);
        
        if (apiCategories.length === 0) {
          const productCategories = [...new Set(products.map(p => p.category).filter(c => c && typeof c === 'string' && c.trim() !== ''))];
          console.log('Derived categories from products:', productCategories);
          
          if (productCategories.length === 0) {
            finalCategories = [...PREDEFINED_CATEGORIES].sort();
            console.log('No categories found in API or products, using predefined categories:', finalCategories);
            toast({
              title: t('info') || 'Info',
              description: t('usingPredefinedCategories') || 'No categories found in database or products. Using predefined categories: Hair, Nail, Tattoo, Piercings, Bridal, Skin.',
              status: 'info',
              duration: 5000,
              isClosable: true
            });
          } else {
            finalCategories = [...new Set([...productCategories, ...PREDEFINED_CATEGORIES])].sort();
            console.log('Using product categories + predefined:', finalCategories);
            toast({
              title: t('info') || 'Info',
              description: t('usingProductCategories') || 'No categories found in database. Using categories from existing products and predefined categories.',
              status: 'info',
              duration: 5000,
              isClosable: true
            });
          }
        }
        setCategories(finalCategories);
      } else {
        throw new Error(response.data.message || 'Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error.message);
      const productCategories = [...new Set(products.map(p => p.category).filter(c => c && typeof c === 'string' && c.trim() !== ''))];
      console.log('Derived categories from products (fallback):', productCategories);
      
      let finalCategories = [...new Set([...productCategories, ...PREDEFINED_CATEGORIES])].sort();
      console.log('Final categories (Products + Predefined):', finalCategories);
      
      if (productCategories.length === 0) {
        finalCategories = [...PREDEFINED_CATEGORIES].sort();
        console.log('No categories found in products, using predefined categories:', finalCategories);
        toast({
          title: t('info') || 'Info',
          description: t('usingPredefinedCategories') || 'No categories found in products. Using predefined categories: Hair, Nail, Tattoo, Piercings, Bridal, Skin.',
          status: 'info',
          duration: 5000,
          isClosable: true
        });
      } else {
        toast({
          title: t('warning') || 'Warning',
          description: t('fetchCategoriesError') || 'Failed to fetch categories from database. Using product categories and predefined categories.',
          status: 'warning',
          duration: 5000,
          isClosable: true
        });
      }
      setCategories(finalCategories);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/inventory/dashboard', { withCredentials: true });
      if (response.data.success) {
        setDashboardData(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error.message);
      toast({
        title: t('error') || 'Error',
        description: error.message || (t('fetchDashboardError') || 'Failed to fetch dashboard data'),
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  const fetchUsageReport = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/inventory/usage-report', {
        params: usageFilter,
        withCredentials: true
      });
      if (response.data.success) {
        setUsageReport(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch usage report');
      }
    } catch (error) {
      console.error('Error fetching usage report:', error.message);
      toast({
        title: t('error') || 'Error',
        description: error.message || (t('fetchUsageReportError') || 'Failed to fetch usage report'),
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle usage form input changes
  const handleUsageChange = (e) => {
    const { name, value } = e.target;
    setUsageData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle report form input changes
  const handleReportChange = (e) => {
    const { name, value } = e.target;
    setReportData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle usage filter changes
  const handleUsageFilterChange = (e) => {
    const { name, value } = e.target;
    setUsageFilter((prev) => ({ ...prev, [name]: value }));
  };

  // Search and filter for Item List
  const filteredProducts = useMemo(() => {
    let filtered = products;
    
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    filtered = [...filtered].sort((a, b) => {
      if (sortConfig.key) {
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';
        if (sortConfig.direction === 'asc') {
          return aValue > bValue ? 1 : -1;
        }
        return aValue < bValue ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [products, searchTerm, selectedCategory, sortConfig]);

  // Pagination for Item List
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Handle sort for Item List
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Export to CSV for Item List
  const exportToCSV = () => {
    if (filteredProducts.length === 0) {
      toast({
        title: t('warning') || 'Warning',
        description: t('noProductsToExport') || 'No products to export',
        status: 'warning',
        duration: 5000,
        isClosable: true
      });
      return;
    }

    const headers = ['Name,Quantity,Price,Supplier,Category,Description'];
    const rows = filteredProducts.map(product =>
      `"${product.name}",${product.quantity},${product.price},"${product.supplier || ''}","${product.category || ''}","${product.description || ''}"`
    );
    const csvContent = [...headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'inventory_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Bulk delete for Item List
  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      toast({
        title: t('error') || 'Error',
        description: t('noProductsSelected') || 'No products selected for deletion',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:4000/api/inventory/bulk-delete',
        { ids: selectedProducts },
        { withCredentials: true }
      );
      if (response.data.success) {
        toast({
          title: t('success') || 'Success',
          description: t('bulkDeleteSuccess') || `Deleted ${selectedProducts.length} products`,
          status: 'success',
          duration: 5000,
          isClosable: true
        });
        setSelectedProducts([]);
        fetchProducts();
        fetchDashboardData();
        onDeleteClose();
      } else {
        throw new Error(response.data.message || 'Failed to delete selected products');
      }
    } catch (error) {
      console.error('Error during bulk delete:', error.message);
      toast({
        title: t('error') || 'Error',
        description: error.message || (t('bulkDeleteError') || 'Failed to delete selected products'),
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  };

  // Open form for adding, editing, or viewing
  const openForm = (product = null, edit = false) => {
    if (product) {
      setSelectedProduct(product);
      setFormData({
        name: product.name || '',
        quantity: product.quantity || '',
        price: product.price || '',
        supplier: product.supplier || '',
        description: product.description || '',
        category: product.category || ''
      });
      setIsEdit(edit);
    } else {
      setSelectedProduct(null);
      setFormData({ name: '', quantity: '', price: '', supplier: '', description: '', category: '' });
      setIsEdit(false);
    }
    onOpen();
  };

  // Submit form for adding or editing
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.quantity || !formData.price) {
      toast({
        title: t('error') || 'Error',
        description: t('requiredFields') || 'Name, quantity, and price are required',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      return;
    }

    setLoading(true);
    const url = isEdit ? `http://localhost:4000/api/inventory/${selectedProduct._id}` : 'http://localhost:4000/api/inventory';
    const method = isEdit ? 'put' : 'post';

    try {
      const response = await axios[method](url, formData, { withCredentials: true });
      if (response.data.success) {
        toast({
          title: t('success') || 'Success',
          description: isEdit ? t('productUpdated') || 'Product updated' : t('productAdded') || 'Product added',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
        fetchProducts();
        fetchCategories();
        fetchDashboardData();
        onClose();
      } else {
        throw new Error(response.data.message || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error.message);
      toast({
        title: t('error') || 'Error',
        description: error.message || (t('saveProductError') || 'Failed to save product'),
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  };

  // Open usage form
  const openUsageForm = (product) => {
    setSelectedProduct(product);
    setUsageData({ quantity: '', reason: '' });
    onUseOpen();
  };

  // Submit usage form
  const handleUsageSubmit = async (e) => {
    e.preventDefault();
    if (!usageData.quantity) {
      toast({
        title: t('error') || 'Error',
        description: t('quantityRequired') || 'Quantity is required',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:4000/api/inventory/use/${selectedProduct._id}`,
        usageData,
        { withCredentials: true }
      );
      if (response.data.success) {
        toast({
          title: t('success') || 'Success',
          description: t('usageRecorded') || 'Usage recorded',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
        fetchProducts();
        fetchDashboardData();
        onUseClose();
      } else {
        throw new Error(response.data.message || 'Failed to record usage');
      }
    } catch (error) {
      console.error('Error recording usage:', error.message);
      toast({
        title: t('error') || 'Error',
        description: error.message || (t('usageError') || 'Failed to record usage'),
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  };

  // Confirm deletion
  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(`http://localhost:4000/api/inventory/${deleteId}`, { withCredentials: true });
      if (response.data.success) {
        toast({
          title: t('success') || 'Success',
          description: t('productDeleted') || 'Product deleted',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
        fetchProducts();
        fetchDashboardData();
        onDeleteClose();
      } else {
        throw new Error(response.data.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error.message);
      toast({
        title: t('error') || 'Error',
        description: error.message || (t('deleteProductError') || 'Failed to delete product'),
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate report
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportData.startDate) {
      toast({
        title: t('error') || 'Error',
        description: t('startDateRequired') || 'Start date is required',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:4000/api/inventory/reports',
        reportData,
        { responseType: 'blob', withCredentials: true }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `inventory_report_${reportData.period}_${reportData.startDate}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({
        title: t('success') || 'Success',
        description: t('reportDownloaded') || 'Report downloaded',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
      onReportClose();
    } catch (error) {
      console.error('Error generating report:', error.message);
      toast({
        title: t('error') || 'Error',
        description: error.message || (t('reportError') || 'Failed to generate report'),
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  };

  // Low stock alert for Item List
  const lowStockProducts = useMemo(() => 
    products.filter(product => product.quantity <= 10).length,
    [products]
  );

  // Chart data for Inventory Chart
  const chartData = useMemo(() => {
    const categoryStock = {};
    products.forEach(product => {
      const category = product.category || 'Uncategorized';
      if (!categoryStock[category]) {
        categoryStock[category] = 0;
      }
      categoryStock[category] += product.quantity;
    });

    return {
      labels: Object.keys(categoryStock),
      datasets: [
        {
          label: t('stockByCategory') || 'Stock by Category',
          data: Object.values(categoryStock),
          backgroundColor: '#6B46C1', // Purple for bars
          borderColor: '#553C9A', // Darker purple for borders
          borderWidth: 1,
        }
      ]
    };
  }, [products, t]);

  return (
    <Box
      minH="100vh"
      bg={colorMode === 'light' ? currentTheme.sectionBg : 'gray.900'}
      py={{ base: 16, md: 24 }}
    >
      <Container maxW="container.xl">
        <VStack spacing={12} align="center">
          <Heading
            as="h3"
            size={headingSize}
            fontFamily="'Playfair Display', serif"
            color={colorMode === 'light' ? currentTheme.primaryColor : currentTheme.secondaryColor}
            textAlign="center"
          >
            {t('inventoryManagement') || 'Inventory Management'}
          </Heading>
          <Text
            fontSize="lg"
            fontFamily="'Montserrat', sans-serif"
            color={colorMode === 'light' ? 'gray.600' : 'gray.300'}
            textAlign="center"
            maxW="600px"
          >
            {t('inventoryDescription') || 'Manage your inventory efficiently'}
          </Text>

          {/* Navigation Tabs */}
          <Tabs index={activeTab} onChange={(index) => setActiveTab(index)} variant="soft-rounded" colorScheme={currentTheme.primaryColor.split('.')[0]}>
            <TabList flexWrap="wrap" justifyContent="center" gap={2}>
              <Tab>{t('dashboard') || 'Dashboard'}</Tab>
              <Tab>{t('itemList') || 'Item List'}</Tab>
              <Tab>{t('reportUsage') || 'Report Usage'}</Tab>
              <Tab>{t('inventoryChart') || 'Inventory Chart'}</Tab>
              <Tab>{t('generateReport') || 'Generate Report'}</Tab>
            </TabList>

            <TabPanels>
              {/* Dashboard Tab */}
              <TabPanel>
                {dashboardData ? (
                  <SimpleGrid columns={{ base: 1, md: 3, lg: 5 }} spacing={6} w="full">
                    <Card>
                      <CardHeader>
                        <Stat>
                          <StatLabel>{t('totalItems') || 'Total Items'}</StatLabel>
                          <StatNumber>{dashboardData.totalItems}</StatNumber>
                        </Stat>
                      </CardHeader>
                    </Card>
                    <Card>
                      <CardHeader>
                        <Stat>
                          <StatLabel>{t('categories') || 'Categories'}</StatLabel>
                          <StatNumber>{dashboardData.categories}</StatNumber>
                        </Stat>
                      </CardHeader>
                    </Card>
                    <Card>
                      <CardHeader>
                        <Stat>
                          <StatLabel>{t('lowStockAlerts') || 'Low Stock Alerts'}</StatLabel>
                          <StatNumber color="red.500">{dashboardData.lowStock}</StatNumber>
                        </Stat>
                      </CardHeader>
                    </Card>
                    <Card>
                      <CardHeader>
                        <Stat>
                          <StatLabel>{t('totalValue') || 'Total Value'}</StatLabel>
                          <StatNumber>{dashboardData.totalValue}</StatNumber>
                        </Stat>
                      </CardHeader>
                    </Card>
                    <Card>
                      <CardHeader>
                        <Stat>
                          <StatLabel>{t('unitsUsed') || 'Units Used'}</StatLabel>
                          <StatNumber>{dashboardData.unitsUsed}</StatNumber>
                        </Stat>
                      </CardHeader>
                    </Card>
                  </SimpleGrid>
                ) : (
                  <Spinner size="xl" color={currentTheme.primaryColor} />
                )}
                <Button
                  mt={6}
                  colorScheme={currentTheme.primaryColor.split('.')[0]}
                  size={buttonSize}
                  borderRadius="full"
                  onClick={() => openForm()}
                >
                  {t('addItem') || 'Add Item'}
                </Button>
              </TabPanel>

              {/* Item List Tab */}
              <TabPanel>
                <Grid templateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap={4} w="full" maxW="800px">
                  <GridItem>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <SearchIcon color="gray.300" />
                      </InputLeftElement>
                      <Input
                        placeholder={t('searchProducts') || 'Search products...'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        borderRadius="md"
                      />
                    </InputGroup>
                  </GridItem>
                  <GridItem>
                    <Select
                      placeholder={t('selectCategory') || 'Select category'}
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      borderRadius="md"
                    >
                      <option value="">{t('allCategories') || 'All categories'}</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </Select>
                  </GridItem>
                  <GridItem>
                    <Button
                      leftIcon={<DownloadIcon />}
                      colorScheme={currentTheme.primaryColor.split('.')[0]}
                      variant="outline"
                      size={buttonSize}
                      borderRadius="full"
                      onClick={exportToCSV}
                    >
                      {t('exportCSV') || 'Export to CSV'}
                    </Button>
                  </GridItem>
                </Grid>

                <Flex justify="space-between" w="full" maxW="800px" align="center" mt={4}>
                  <Flex gap={4}>
                    <Button
                      colorScheme={currentTheme.primaryColor.split('.')[0]}
                      size={buttonSize}
                      borderRadius="full"
                      onClick={() => openForm()}
                    >
                      {t('addItem') || 'Add Item'}
                    </Button>
                    {selectedProducts.length > 0 && (
                      <Button
                        colorScheme="red"
                        size={buttonSize}
                        borderRadius="full"
                        variant="outline"
                        onClick={() => onDeleteOpen()}
                      >
                        {t('deleteSelected') || 'Delete Selected'} ({selectedProducts.length})
                      </Button>
                    )}
                  </Flex>
                  {lowStockProducts > 0 && (
                    <Tag size="lg" colorScheme="red" borderRadius="full">
                      <TagLabel>
                        {t('lowStockAlert', { count: lowStockProducts }) || `${lowStockProducts} Low Stock Items`}
                      </TagLabel>
                    </Tag>
                  )}
                </Flex>

                {loading ? (
                  <Spinner size="xl" color={currentTheme.primaryColor} />
                ) : (
                  <MotionBox
                    bg={colorMode === 'light' ? 'white' : 'gray.700'}
                    borderRadius="xl"
                    boxShadow="lg"
                    w="full"
                    overflowX="auto"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    mt={4}
                  >
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>
                            <Checkbox
                              isChecked={selectedProducts.length === paginatedProducts.length && paginatedProducts.length > 0}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedProducts(paginatedProducts.map(p => p._id));
                                } else {
                                  setSelectedProducts([]);
                                }
                              }}
                            />
                          </Th>
                          <Th onClick={() => handleSort('name')} cursor="pointer">
                            <Flex align="center" gap={2}>
                              {t('name') || 'Name'}
                              {sortConfig.key === 'name' ? (
                                sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                              ) : <FaSort />}
                            </Flex>
                          </Th>
                          <Th onClick={() => handleSort('quantity')} cursor="pointer">
                            <Flex align="center" gap={2}>
                              {t('quantity') || 'Quantity'}
                              {sortConfig.key === 'quantity' ? (
                                sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                              ) : <FaSort />}
                            </Flex>
                          </Th>
                          <Th onClick={() => handleSort('price')} cursor="pointer">
                            <Flex align="center" gap={2}>
                              {t('price') || 'Price'}
                              {sortConfig.key === 'price' ? (
                                sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                              ) : <FaSort />}
                            </Flex>
                          </Th>
                          <Th>{t('supplier') || 'Supplier'}</Th>
                          <Th>{t('category') || 'Category'}</Th>
                          <Th>{t('actions') || 'Actions'}</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {paginatedProducts.map((product, index) => (
                          <MotionTr
                            key={product._id}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1, duration: 0.3 }}
                            _hover={{ bg: colorMode === 'light' ? 'gray.100' : 'gray.600' }}
                          >
                            <Td>
                              <Checkbox
                                isChecked={selectedProducts.includes(product._id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedProducts(prev => [...prev, product._id]);
                                  } else {
                                    setSelectedProducts(prev => prev.filter(id => id !== product._id));
                                  }
                                }}
                              />
                            </Td>
                            <Td fontFamily="'Montserrat', sans-serif'">{product.name}</Td>
                            <Td
                              fontFamily="'Montserrat', sans-serif'"
                              color={product.quantity <= 10 ? 'red.500' : 'inherit'}
                            >
                              {product.quantity}
                              {product.quantity <= 10 && <Badge ml={2} colorScheme="red">{t('lowStock') || 'Low Stock'}</Badge>}
                            </Td>
                            <Td fontFamily="'Montserrat', sans-serif'">${product.price}</Td>
                            <Td fontFamily="'Montserrat', sans-serif'">{product.supplier || '-'}</Td>
                            <Td fontFamily="'Montserrat', sans-serif'">{product.category || '-'}</Td>
                            <Td>
                              <Menu>
                                <MenuButton
                                  as={Button}
                                  rightIcon={<ChevronDownIcon />}
                                  size="sm"
                                  colorScheme={currentTheme.primaryColor.split('.')[0]}
                                  borderRadius="full"
                                >
                                  {t('actions') || 'Actions'}
                                </MenuButton>
                                <MenuList>
                                  <MenuItem onClick={() => openForm(product, true)}>{t('edit') || 'Edit'}</MenuItem>
                                  <MenuItem onClick={() => {
                                    setDeleteId(product._id);
                                    onDeleteOpen();
                                  }}>{t('delete') || 'Delete'}</MenuItem>
                                  <MenuItem onClick={() => openUsageForm(product)}>{t('use') || 'Use'}</MenuItem>
                                  <MenuItem onClick={() => openForm(product, false)}>{t('details') || 'Details'}</MenuItem>
                                </MenuList>
                              </Menu>
                            </Td>
                          </MotionTr>
                        ))}
                      </Tbody>
                    </Table>

                    <Flex justify="space-between" p={4} align="center">
                      <Text>
                        {t('showing') || 'Showing'} {paginatedProducts.length} {t('of') || 'of'} {filteredProducts.length} {t('products') || 'products'}
                      </Text>
                      <Flex gap={2}>
                        <Button
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          isDisabled={currentPage === 1}
                        >
                          {t('previous') || 'Previous'}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          isDisabled={currentPage === totalPages}
                        >
                          {t('next') || 'Next'}
                        </Button>
                      </Flex>
                    </Flex>
                  </MotionBox>
                )}
              </TabPanel>

              {/* Report Usage Tab */}
              <TabPanel>
                <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4} w="full" maxW="800px">
                  <GridItem>
                    <FormControl>
                      <FormLabel>{t('selectCategory') || 'Select Category'}</FormLabel>
                      <Select
                        name="category"
                        value={usageFilter.category}
                        onChange={handleUsageFilterChange}
                        borderRadius="md"
                      >
                        <option value="All Categories">{t('allCategories') || 'All Categories'}</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </Select>
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl>
                      <FormLabel>{t('selectProduct') || 'Select Product'}</FormLabel>
                      <Select
                        name="productId"
                        value={usageFilter.productId}
                        onChange={handleUsageFilterChange}
                        borderRadius="md"
                      >
                        <option value="All Products">{t('allProducts') || 'All Products'}</option>
                        {products
                          .filter(p => usageFilter.category === 'All Categories' || p.category === usageFilter.category)
                          .map(product => (
                            <option key={product._id} value={product._id}>{product.name}</option>
                          ))}
                      </Select>
                    </FormControl>
                  </GridItem>
                </Grid>

                <MotionBox
                  bg={colorMode === 'light' ? 'white' : 'gray.700'}
                  borderRadius="xl"
                  boxShadow="lg"
                  w="full"
                  overflowX="auto"
                  mt={4}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>{t('productName') || 'Product Name'}</Th>
                        <Th>{t('category') || 'Category'}</Th>
                        <Th>{t('usageHistory') || 'Usage History'}</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {usageReport.map((product, index) => (
                        <Tr key={product._id}>
                          <Td>{product.name}</Td>
                          <Td>{product.category || '-'}</Td>
                          <Td>
                            {product.history
                              .filter(h => h.action === 'used')
                              .map((entry, idx) => (
                                <Text key={idx}>
                                  {entry.quantityChanged} units - {entry.reason || 'N/A'} ({new Date(entry.timestamp).toLocaleString()})
                                </Text>
                              ))}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                  {usageReport.length === 0 && (
                    <Text p={4} textAlign="center">
                      {t('noUsageEvents') || 'No usage events recorded yet.'}
                    </Text>
                  )}
                </MotionBox>
              </TabPanel>

              {/* Inventory Chart Tab */}
              <TabPanel>
                <MotionBox
                  bg={colorMode === 'light' ? 'white' : 'gray.700'}
                  borderRadius="xl"
                  boxShadow="lg"
                  w="full"
                  p={4}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Heading size="md" mb={4}>{t('inventoryChart') || 'Inventory Chart'}</Heading>
                  <Box h="400px">
                    <Bar
                      data={chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: 'top' },
                          title: { display: true, text: t('stockByCategory') || 'Stock by Category' }
                        },
                        scales: {
                          y: { beginAtZero: true, title: { display: true, text: t('quantity') || 'Quantity' } },
                          x: { title: { display: true, text: t('category') || 'Category' } }
                        }
                      }}
                    />
                  </Box>
                </MotionBox>
              </TabPanel>

              {/* Generate Report Tab */}
              <TabPanel>
                <MotionBox
                  bg={colorMode === 'light' ? 'white' : 'gray.700'}
                  borderRadius="xl"
                  boxShadow="lg"
                  w="full"
                  p={4}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <form onSubmit={handleReportSubmit}>
                    <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                      <FormControl mb={4} isRequired>
                        <FormLabel fontFamily="'Montserrat', sans-serif'">{t('period') || 'Period'}</FormLabel>
                        <Select
                          name="period"
                          value={reportData.period}
                          onChange={handleReportChange}
                          borderRadius="md"
                        >
                          <option value="weekly">{t('weekly') || 'Weekly'}</option>
                          <option value="monthly">{t('monthly') || 'Monthly'}</option>
                          <option value="quarterly">{t('quarterly') || 'Quarterly'}</option>
                        </Select>
                      </FormControl>
                      <FormControl mb={4} isRequired>
                        <FormLabel fontFamily="'Montserrat', sans-serif'">{t('startDate') || 'Start Date'}</FormLabel>
                        <Input
                          type="date"
                          name="startDate"
                          value={reportData.startDate}
                          onChange={handleReportChange}
                          borderRadius="md"
                        />
                      </FormControl>
                    </Grid>
                    <Button
                      type="submit"
                      colorScheme={currentTheme.primaryColor.split('.')[0]}
                      size={buttonSize}
                      borderRadius="full"
                      isLoading={loading}
                    >
                      {t('generate') || 'Generate'}
                    </Button>
                  </form>
                </MotionBox>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>

      {/* Add/Edit/View Product Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          bg={colorMode === 'light' ? 'white' : 'gray.700'}
          borderRadius="xl"
          boxShadow="lg"
        >
          <ModalHeader
            fontFamily="'Playfair Display', serif"
            color={colorMode === 'light' ? currentTheme.primaryColor : currentTheme.secondaryColor}
          >
            {isEdit ? t('editProduct') || 'Edit Product' : selectedProduct ? t('viewProduct') || 'View Product' : t('addProduct') || 'Add Product'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedProduct && !isEdit ? (
              <VStack spacing={4} align="start" fontFamily="'Montserrat', sans-serif'">
                <Text><strong>{t('name') || 'Name'}:</strong> {selectedProduct.name}</Text>
                <Text><strong>{t('quantity') || 'Quantity'}:</strong> {selectedProduct.quantity}</Text>
                <Text><strong>{t('price') || 'Price'}:</strong> ${selectedProduct.price}</Text>
                <Text><strong>{t('supplier') || 'Supplier'}:</strong> {selectedProduct.supplier || '-'}</Text>
                <Text><strong>{t('description') || 'Description'}:</strong> {selectedProduct.description || '-'}</Text>
                <Text><strong>{t('category') || 'Category'}:</strong> {selectedProduct.category || '-'}</Text>
                <Text><strong>{t('history') || 'History'}:</strong></Text>
                {selectedProduct.history?.map((entry, index) => (
                  <Text key={index} pl={4}>
                    {entry.action} {entry.quantityChanged} units - {entry.reason || 'N/A'} ({new Date(entry.timestamp).toLocaleString()})
                  </Text>
                ))}
              </VStack>
            ) : (
              <form onSubmit={handleSubmit}>
                <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                  <GridItem>
                    <FormControl mb={4} isRequired>
                      <FormLabel fontFamily="'Montserrat', sans-serif'">{t('name') || 'Name'}</FormLabel>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        borderRadius="md"
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl mb={4} isRequired>
                      <FormLabel fontFamily="'Montserrat', sans-serif'">{t('quantity') || 'Quantity'}</FormLabel>
                      <Input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        borderRadius="md"
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl mb={4} isRequired>
                      <FormLabel fontFamily="'Montserrat', sans-serif'">{t('price') || 'Price'}</FormLabel>
                      <Input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        borderRadius="md"
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl mb={4}>
                      <FormLabel fontFamily="'Montserrat', sans-serif'">{t('supplier') || 'Supplier'}</FormLabel>
                      <Input
                        name="supplier"
                        value={formData.supplier}
                        onChange={handleInputChange}
                        borderRadius="md"
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={{ base: 1, md: 2 }}>
                    <FormControl mb={4}>
                      <FormLabel fontFamily="'Montserrat', sans-serif'">{t('description') || 'Description'}</FormLabel>
                      <Textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        borderRadius="md"
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl mb={4}>
                      <FormLabel fontFamily="'Montserrat', sans-serif'">{t('category') || 'Category'}</FormLabel>
                      <Select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        borderRadius="md"
                      >
                        <option value="">{t('selectCategory') || 'Select category'}</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </Select>
                    </FormControl>
                  </GridItem>
                </Grid>
                <Button
                  type="submit"
                  colorScheme={currentTheme.primaryColor.split('.')[0]}
                  size={buttonSize}
                  borderRadius="full"
                  isLoading={loading}
                >
                  {isEdit ? t('update') || 'Update' : t('add') || 'Add'}
                </Button>
              </form>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme={currentTheme.primaryColor.split('.')[0]}
              variant="outline"
              borderRadius="full"
              onClick={onClose}
            >
              {t('close') || 'Close'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog isOpen={isDeleteOpen} leastDestructiveRef={cancelRef} onClose={onDeleteClose}>
        <AlertDialogOverlay>
          <AlertDialogContent
            bg={colorMode === 'light' ? 'white' : 'gray.700'}
            borderRadius="xl"
          >
            <AlertDialogHeader
              fontFamily="'Playfair Display', serif"
              color={colorMode === 'light' ? currentTheme.primaryColor : currentTheme.secondaryColor}
            >
              {selectedProducts.length > 0 ? t('deleteMultipleProducts') || 'Delete Multiple Products' : t('deleteProduct') || 'Delete Product'}
            </AlertDialogHeader>
            <AlertDialogBody fontFamily="'Montserrat', sans-serif'">
              {selectedProducts.length > 0
                ? t('confirmBulkDelete', { count: selectedProducts.length }) || `Are you sure you want to delete ${selectedProducts.length} products?`
                : t('confirmDelete') || 'Are you sure you want to delete this product?'}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={onDeleteClose}
                colorScheme={currentTheme.primaryColor.split('.')[0]}
                variant="outline"
                borderRadius="full"
              >
                {t('cancel') || 'Cancel'}
              </Button>
              <Button
                colorScheme="red"
                onClick={selectedProducts.length > 0 ? handleBulkDelete : handleDelete}
                ml={3}
                isLoading={loading}
                borderRadius="full"
              >
                {t('delete') || 'Delete'}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Usage Modal */}
      <Modal isOpen={isUseOpen} onClose={onUseClose}>
        <ModalOverlay />
        <ModalContent
          bg={colorMode === 'light' ? 'white' : 'gray.700'}
          borderRadius="xl"
          boxShadow="lg"
        >
          <ModalHeader
            fontFamily="'Playfair Display', serif"
            color={colorMode === 'light' ? currentTheme.primaryColor : currentTheme.secondaryColor}
          >
            {t('recordUsage') || 'Record Usage'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleUsageSubmit}>
              <FormControl mb={4} isRequired>
                <FormLabel fontFamily="'Montserrat', sans-serif'">{t('quantity') || 'Quantity'}</FormLabel>
                <Input
                  type="number"
                  name="quantity"
                  value={usageData.quantity}
                  onChange={handleUsageChange}
                  borderRadius="md"
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel fontFamily="'Montserrat', sans-serif'">{t('reason') || 'Reason'}</FormLabel>
                <Input
                  name="reason"
                  value={usageData.reason}
                  onChange={handleUsageChange}
                  borderRadius="md"
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme={currentTheme.primaryColor.split('.')[0]}
                size={buttonSize}
                borderRadius="full"
                isLoading={loading}
              >
                {t('submit') || 'Submit'}
              </Button>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme={currentTheme.primaryColor.split('.')[0]}
              variant="outline"
              borderRadius="full"
              onClick={onUseClose}
            >
              {t('close') || 'Close'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default InventoryManagement;