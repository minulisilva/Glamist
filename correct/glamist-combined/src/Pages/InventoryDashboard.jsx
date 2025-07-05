import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Icon,
} from "@chakra-ui/react";
import {
  FaBox,
  FaList,
  FaExclamationTriangle,
  FaDollarSign,
  FaHistory,
  FaChartBar,
} from "react-icons/fa";

function InventoryDashboard() {
  const [stats, setStats] = useState({
    totalItems: 0,
    totalCategories: 0,
    lowStockItems: 0,
    totalValue: 0,
    totalUnitsUsed: 0,
  });
  const [lowStockItems, setLowStockItems] = useState([]);
  const [usageReport, setUsageReport] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [error, setError] = useState(null);

  const LOW_STOCK_THRESHOLD = 10;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log("Fetching item list...");
        const response = await getItemList(); // Assuming this function exists
        console.log("API Response:", response);
        const items = response.data.data;

        if (!items || !Array.isArray(items)) {
          throw new Error("Invalid data format from API");
        }

        const totalItems = items.length;
        const totalCategories = new Set(items.map((item) => item.category)).size;
        const lowStock = items.filter((item) => item.quantity < LOW_STOCK_THRESHOLD);
        const totalValue = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        let totalUnitsUsed = 0;
        const usageEvents = [];

        items.forEach((item) => {
          if (item.history && item.history.length > 0) {
            item.history.forEach((entry) => {
              if (entry.action === "used") {
                totalUnitsUsed += entry.quantityChanged;
                usageEvents.push({
                  productName: item.name,
                  category: item.category || "Uncategorized",
                  quantityChanged: entry.quantityChanged,
                  reason: entry.reason,
                  timestamp: entry.timestamp,
                });
              }
            });
          }
        });

        usageEvents.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        setStats({
          totalItems,
          totalCategories,
          lowStockItems: lowStock.length,
          totalValue,
          totalUnitsUsed,
        });
        setLowStockItems(lowStock);
        setUsageReport(usageEvents);
        setError(null);
        console.log("Data fetched successfully:", { stats, lowStockItems, usageReport });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError(error.response?.data?.message || error.message || "Failed to load dashboard data");
      }
    };
    fetchDashboardData();
  }, []);

  // Extract unique categories from usageReport
  const categories = [...new Set(usageReport.map((entry) => entry.category))];

  // If there's an error, show it
  if (error) {
    return (
      <Container maxW="md" mt={8}>
        <Box p={4} bg="red.100" color="red.700" rounded="lg" textAlign="center">
          <Text>{error}</Text>
        </Box>
      </Container>
    );
  }

  // Render dashboard even if data is still empty (initial state)
  return (
    <Container maxW="container.xl" mt={10} px={{ base: 4, sm: 6, lg: 8 }}>
      <Box bg="white" rounded="2xl" shadow="xl" p={{ base: 6, md: 8 }}>
        <Heading
          as="h2"
          size="xl"
          color="gray.800"
          mb={6}
          display="flex"
          alignItems="center"
        >
          <Icon as={FaChartBar} mr={2} color="purple.600" />
          Glamist Inventory Dashboard
        </Heading>

        {/* Stats Cards */}
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 5 }} spacing={4} mb={8}>
          {[
            { icon: FaBox, label: "Total Items", value: stats.totalItems, color: "blue" },
            { icon: FaList, label: "Categories", value: stats.totalCategories, color: "green" },
            { icon: FaExclamationTriangle, label: "Low Stock", value: stats.lowStockItems, color: "red" },
            { icon: FaDollarSign, label: "Total Value", value: `Rs.${stats.totalValue.toFixed(2)}`, color: "yellow" },
            { icon: FaHistory, label: "Units Used", value: stats.totalUnitsUsed, color: "purple" },
          ].map((stat, index) => (
            <Box
              key={index}
              p={4}
              bg={`${stat.color}.100`}
              color={`${stat.color}.600`}
              rounded="xl"
              shadow="md"
              transition="transform 0.2s"
              _hover={{ transform: "scale(1.05)" }}
            >
              <HStack>
                <Icon as={stat.icon} boxSize={6} />
                <VStack align="start" spacing={0}>
                  <Text fontSize="sm" fontWeight="medium" color="gray.600">
                    {stat.label}
                  </Text>
                  <Text fontSize="xl" fontWeight="semibold">
                    {stat.value}
                  </Text>
                </VStack>
              </HStack>
            </Box>
          ))}
        </SimpleGrid>

        {/* Low Stock Alerts */}
        <Box mb={8}>
          <Heading as="h3" size="md" color="gray.800" mb={4}>
            Low Stock Alerts
          </Heading>
          {lowStockItems.length > 0 ? (
            <Box bg="red.50" rounded="xl" p={4} shadow="md">
              <VStack spacing={3} align="stretch">
                {lowStockItems.map((item) => (
                  <Box
                    key={item._id}
                    p={3}
                    bg="white"
                    rounded="lg"
                    shadow="sm"
                    _hover={{ bg: "red.100" }}
                    transition="background-color 0.2s"
                  >
                    <HStack justify="space-between">
                      <Text fontWeight="medium" color="gray.800">
                        {item.name}
                      </Text>
                      <Text color="red.600" fontWeight="semibold">
                        Qty: {item.quantity}
                      </Text>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </Box>
          ) : (
            <Text color="gray.500" fontStyle="italic">
              No low stock items at this time.
            </Text>
          )}
        </Box>

        {/* Product Usage Report */}
        <Box mb={8}>
          <Heading as="h3" size="md" color="gray.800" mb={4}>
            Product Usage Report
          </Heading>
          <HStack spacing={4} mb={4} flexDir={{ base: "column", sm: "row" }} align={{ base: "stretch", sm: "center" }}>
            <Select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setProductFilter("");
              }}
              placeholder="All Categories"
              bg="white"
              borderColor="gray.200"
              _focus={{ ring: 2, ringColor: "purple.500" }}
              shadow="sm"
              w={{ base: "full", sm: "64" }}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
            <Select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              placeholder="All Products"
              bg="white"
              borderColor="gray.200"
              _focus={{ ring: 2, ringColor: "purple.500" }}
              shadow="sm"
              w={{ base: "full", sm: "64" }}
            >
              {[...new Set(
                usageReport
                  .filter((entry) => !categoryFilter || entry.category === categoryFilter)
                  .map((entry) => entry.productName)
              )].map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </Select>
          </HStack>
          {usageReport.length > 0 ? (
            <Box bg="gray.50" rounded="xl" p={4} shadow="md" overflowX="auto">
              <Table variant="simple">
                <Thead bg="purple.100">
                  <Tr>
                    <Th color="gray.800">Category</Th>
                    <Th color="gray.800">Product</Th>
                    <Th color="gray.800">Qty Used</Th>
                    <Th color="gray.800">Date & Time</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {usageReport
                    .filter(
                      (entry) =>
                        (!categoryFilter || entry.category === categoryFilter) &&
                        (!productFilter || entry.productName === productFilter)
                    )
                    .map((entry, index) => (
                      <Tr
                        key={index}
                        bg="white"
                        _hover={{ bg: "purple.50" }}
                        transition="background-color 0.2s"
                      >
                        <Td>{entry.category}</Td>
                        <Td>{entry.productName}</Td>
                        <Td>{entry.quantityChanged}</Td>
                        <Td>{new Date(entry.timestamp).toLocaleString()}</Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            </Box>
          ) : (
            <Text color="gray.500" fontStyle="italic">
              No usage events recorded yet.
            </Text>
          )}
        </Box>

        {/* Inventory Chart Link */}
        <Box>
          <Button
            as={Link}
            to="/inventory-chart"
            colorScheme="purple"
            leftIcon={<FaChartBar />}
            rounded="lg"
            shadow="md"
            _hover={{ bg: "purple.700" }}
            transition="background-color 0.2s"
          >
            View Inventory Chart
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default InventoryDashboard;