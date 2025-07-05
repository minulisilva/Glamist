import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  FormControl,
  Select,
  Input,
  Button,
  Text,
  VStack,
} from "@chakra-ui/react";

function ReportUsage() {
  const [salonItems, setSalonItems] = useState([]);
  const [usageData, setUsageData] = useState({ category: '', id: '', quantity: '' });
  const [usageError, setUsageError] = useState(null);
  const navigate = useNavigate();

  const fetchItems = async () => {
    try {
      const response = await getItemList();
      console.log("API Response:", response.data);
      setSalonItems(response.data.data);
    } catch (error) {
      setUsageError("Error fetching items: " + (error.response?.data?.message || error.message));
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Extract unique categories from salonItems
  const categories = [...new Set(salonItems.map((item) => item.category).filter(Boolean))];

  // Filter products based on selected category
  const filteredProducts = usageData.category
    ? salonItems.filter((item) => item.category === usageData.category)
    : salonItems;

  const handleUsageSubmit = async (e) => {
    e.preventDefault();
    if (!usageData.id || !usageData.quantity) {
      setUsageError("Please select a product and enter a quantity.");
      return;
    }

    try {
      const selectedItem = salonItems.find((item) => item._id === usageData.id);
      if (Number(usageData.quantity) > selectedItem.quantity) {
        setUsageError(`Cannot use more than ${selectedItem.quantity} available`);
        return;
      }

      await useItem(usageData.id, {
        quantity: Number(usageData.quantity),
      });
      setUsageData({ category: '', id: '', quantity: '' });
      setUsageError(null);
      fetchItems(); // Refresh the list
      alert("Usage reported successfully!");
    } catch (error) {
      setUsageError("Error reporting usage: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Container maxW="container.lg" mt={8} py={6}>
      <Box
        bg="purple.50"
        rounded="xl"
        shadow="lg"
        p={6}
      >
        <Heading as="h2" size="xl" color="black" mb={4}>
          Report Product Usage
        </Heading>
        
        {usageError && (
          <Text color="red.500" mb={4}>
            {usageError}
          </Text>
        )}

        <VStack as="form" onSubmit={handleUsageSubmit} spacing={4} align="stretch">
          <FormControl>
            <Select
              value={usageData.category}
              onChange={(e) => setUsageData({ ...usageData, category: e.target.value, id: '' })}
              placeholder="Select a category"
              bg="purple.50"
              borderColor="purple.200"
              _focus={{ ring: 2, ringColor: "purple.300" }}
              rounded="lg"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <Select
              value={usageData.id}
              onChange={(e) => setUsageData({ ...usageData, id: e.target.value })}
              placeholder="Select a product"
              bg="purple.50"
              borderColor="purple.200"
              _focus={{ ring: 2, ringColor: "purple.300" }}
              rounded="lg"
              isDisabled={!usageData.category}
            >
              {filteredProducts.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name} (Qty: {item.quantity})
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <Input
              type="number"
              placeholder="Quantity Used"
              value={usageData.quantity}
              onChange={(e) => setUsageData({ ...usageData, quantity: e.target.value })}
              min="1"
              bg="purple.50"
              borderColor="purple.200"
              _focus={{ ring: 2, ringColor: "purple.300" }}
              rounded="lg"
              _placeholder={{ color: "gray.500" }}
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="purple"
            bg="purple.500"
            _hover={{ bg: "purple.600" }}
            rounded="md"
            shadow="sm"
            transition="all 0.3s ease-in-out"
          >
            Report Usage
          </Button>
        </VStack>

        <Button
          mt={4}
          colorScheme="gray"
          bg="gray.500"
          _hover={{ bg: "gray.600" }}
          rounded="md"
          shadow="sm"
          transition="all 0.3s ease-in-out"
          onClick={() => navigate("/list")}
        >
          Back to Item List
        </Button>
      </Box>
    </Container>
  );
}

export default ReportUsage;