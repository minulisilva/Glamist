import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Flex,
  Button,
  useColorMode,
} from "@chakra-ui/react";
import { useTheme } from "./ThemeContext"; // Assuming ThemeContext is available from App.jsx

// Note: These imports aren't used in this component but are listed in your original code
// Remove them if they're not needed elsewhere, or keep if they're used in the routing setup
import AddItem from "./Pages/AddItem";
import ItemList from "./Pages/ItemList";
import ItemDetails from "./Pages/ItemDetails";
import EditItem from "./Pages/EditItem";
import DeleteItem from "./Pages/DeleteItem";
import InventoryDashboard from "./Pages/InventoryDashboard";
import ReportUsage from "./Pages/ReportUsage";
import InventoryChart from "./Pages/InventoryChart";

function Inventory() {
  const { colorMode } = useColorMode();
  const { currentTheme } = useTheme(); // Use theme context for consistent styling

  const navItems = [
    { to: "/inventory", label: "Dashboard" },
    { to: "/inventory-list", label: "Item List" },
    { to: "/inventory-add", label: "Add Item" },
    { to: "/report-usage", label: "Report Usage" },
    { to: "/inventory-chart", label: "Inventory Chart" },
  ];

  return (
    <Box
      minH="100vh"
      bg={colorMode === "light" ? "gray.50" : "gray.800"}
      px={4} // Changed p={4} to px={4} since we only need horizontal padding
      py={6} // Added vertical padding for better spacing
    >
      <Container maxW="container.xl" centerContent> {/* Changed to container.xl for better width */}
        <Flex
          as="nav"
          bg={colorMode === "light" ? "purple.50" : "purple.900"}
          p={4}
          rounded="xl"
          shadow="lg"
          justify="center"
          gap={4} // Reduced gap from 6 to 4 for tighter spacing
          flexWrap="wrap"
          w="full" // Ensure nav takes full width of container
          maxW="1200px" // Optional: cap the maximum width
        >
          {navItems.map((item) => (
            <Button
              key={item.to}
              as={RouterLink}
              to={item.to}
              variant="ghost"
              color={currentTheme?.primaryColor || "purple.700"}
              bg="purple.200"
              _hover={{
                bg: "purple.300",
                color: "purple.900",
              }}
              _activeLink={{
                bg: currentTheme?.primaryColor || "purple.600",
                color: "white",
                fontWeight: "bold",
              }}
              px={6} // Increased horizontal padding for better button size
              py={3} // Increased vertical padding for better button size
              rounded="lg" // Changed to lg for slightly larger radius
              fontWeight="medium"
              fontSize="md" // Explicitly set font size
              transition="all 0.3s ease-in-out"
            >
              {item.label}
            </Button>
          ))}
        </Flex>
      </Container>
    </Box>
  );
}

export default Inventory;