import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  Select,
  Button,
  Text,
  VStack,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function InventoryChart() {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const LOW_STOCK_THRESHOLD = 10;

  // Fetch data once on mount
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await getItemList();
        console.log("API Response:", response.data);
        const fetchedItems = response.data.data;

        if (!fetchedItems || !Array.isArray(fetchedItems)) {
          throw new Error("Invalid data format from API");
        }

        // Extract unique categories
        const uniqueCategories = [
          ...new Set(fetchedItems.map((item) => item.category || "Uncategorized")),
        ];
        setCategories(uniqueCategories);
        setItems(fetchedItems);

        // Set default category to the first one
        setSelectedCategory(uniqueCategories[0] || "");

        setError(null);
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setError(error.response?.data?.message || error.message || "Failed to load chart data");
      } finally {
        setLoading(false);
      }
    };
    fetchChartData();
  }, []);

  // Update chart when selectedCategory changes
  useEffect(() => {
    if (!selectedCategory || items.length === 0) return;

    // Filter items by selected category
    const filteredItems = items.filter(
      (item) => (item.category || "Uncategorized") === selectedCategory
    );

    // Prepare chart data
    const labels = filteredItems.map((item) => item.name);
    const remainingQuantities = filteredItems.map((item) => item.quantity);
    
    // Calculate total used quantity per item from history
    const usedQuantities = filteredItems.map((item) => {
      if (item.history && item.history.length > 0) {
        return item.history
          .filter((entry) => entry.action === "used")
          .reduce((sum, entry) => sum + entry.quantityChanged, 0);
      }
      return 0;
    });

    setChartData({
      labels,
      datasets: [
        {
          label: "Remaining Quantity",
          data: remainingQuantities,
          backgroundColor: remainingQuantities.map((qty) =>
            qty < LOW_STOCK_THRESHOLD
              ? "rgba(255, 99, 132, 0.6)" // Red for low stock
              : "rgba(204, 153, 255, 0.6)" // Light purple for normal stock
          ),
          borderColor: remainingQuantities.map((qty) =>
            qty < LOW_STOCK_THRESHOLD
              ? "rgba(255, 99, 132, 1)"
              : "rgba(204, 153, 255, 1)"
          ),
          borderWidth: 1,
        },
        {
          label: "Used Quantity",
          data: usedQuantities,
          backgroundColor: "rgba(54, 162, 235, 0.6)", // Blue for used quantity
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    });
  }, [selectedCategory, items]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Inventory Analysis for ${selectedCategory || "Select a Category"}`,
        font: { size: 18 },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Quantity",
        },
      },
      x: {
        title: {
          display: true,
          text: "Products",
        },
      },
    },
  };

  if (loading) {
    return (
      <Container centerContent mt={8}>
        <Text color="gray.500">Loading...</Text>
      </Container>
    );
  }

  if (error) {
    return (
      <Container centerContent mt={8}>
        <Text color="red.500">{error}</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" mt={8} py={6}>
      <Box bg="purple.50" rounded="xl" shadow="lg" p={6}>
        <Heading as="h2" size="xl" color="black" mb={6}>
          Inventory Chart
        </Heading>

        <VStack spacing={6} align="stretch">
          {/* Category Dropdown */}
          <FormControl>
            <FormLabel color="black" fontWeight="medium">
              Select Category:
            </FormLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              bg="purple.50"
              borderColor="purple.200"
              _focus={{ ring: 2, ringColor: "purple.300" }}
              rounded="lg"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
          </FormControl>

          {/* Chart */}
          <Box
            bg="purple.50"
            p={4}
            rounded="md"
            shadow="sm"
            h="400px"
            overflow="hidden"
          >
            {chartData.labels.length > 0 ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <Text color="gray.500" textAlign="center" mt={8}>
                No products in this category.
              </Text>
            )}
          </Box>

          {/* Back Button */}
          <Button
            colorScheme="gray"
            bg="gray.500"
            _hover={{ bg: "gray.600" }}
            rounded="md"
            shadow="sm"
            transition="all 0.3s ease-in-out"
            onClick={() => navigate("/")}
          >
            Back to Dashboard
          </Button>
        </VStack>
      </Box>
    </Container>
  );
}

export default InventoryChart;