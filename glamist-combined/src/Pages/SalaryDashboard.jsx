import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Box, Heading, Flex, Text } from "@chakra-ui/react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function SalaryDashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalPayroll: 0,
    pendingPayments: 0,
    salaryTrend: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getDashboardData(); // Note: getDashboardData needs to be implemented
        setDashboardData(response.data);
      } catch (error) {
        alert("Error fetching dashboard data: " + error.response?.data?.message);
      }
    };
    fetchDashboardData();
  }, []);

  const chartData = {
    labels: dashboardData.salaryTrend.map((data) => `${data._id.month}/${data._id.year}`),
    datasets: [
      {
        label: "Salary Expenses (Rs)",
        data: dashboardData.salaryTrend.map((data) => data.total),
        borderColor: "rgba(219, 39, 119, 1)",
        backgroundColor: "rgba(219, 39, 119, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
            family: "Arial",
          },
          color: "#4B5563",
        },
      },
      title: {
        display: true,
        text: "Monthly Salary Expenses (2025)",
        font: {
          size: 18,
          family: "Arial",
        },
        color: "#4B5563",
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#4B5563",
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: "#4B5563",
          callback: (value) => `Rs ${value}`,
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
    },
  };

  return (
    <Box
      maxW="4xl"
      mx="auto"
      bgGradient="linear(to-br, white, pink.50)"
      p={8}
      borderRadius="2xl"
      shadow="xl"
      my={10}
      border="1px"
      borderColor="pink.100"
      transition="all 0.3s"
      _hover={{ shadow: "2xl" }}
    >
      <Heading
        as="h2"
        size="xl"
        textAlign="center"
        bgGradient="linear(to-r, pink.600, purple.600)"
        bgClip="text"
        mb={8}
      >
        Salary Dashboard
      </Heading>

      <Flex justify="space-between" mb={8} gap={4}>
        <Box
          flex={1}
          bgGradient="linear(to-r, pink.100, pink.200)"
          p={6}
          borderRadius="xl"
          shadow="md"
          _hover={{
            shadow: "lg",
            transform: "scale(1.05)",
          }}
          transition="all 0.3s"
        >
          <Text color="gray.700" fontSize="lg" fontWeight="semibold" mb={2}>
            Total Payroll (March 2025)
          </Text>
          <Text color="pink.600" fontSize="3xl" fontWeight="bold">
            Rs 50,000
          </Text>
        </Box>

        <Box
          flex={1}
          bgGradient="linear(to-r, red.100, red.200)"
          p={6}
          borderRadius="xl"
          shadow="md"
          _hover={{
            shadow: "lg",
            transform: "scale(1.05)",
          }}
          transition="all 0.3s"
        >
          <Text color="gray.700" fontSize="lg" fontWeight="semibold" mb={2}>
            Pending Payments
          </Text>
          <Text color="red.500" fontSize="3xl" fontWeight="bold">
            2
          </Text>
        </Box>
      </Flex>

      <Box
        bg="white"
        p={6}
        borderRadius="xl"
        shadow="md"
        border="1px"
        borderColor="gray.100"
      >
        <Text
          color="gray.700"
          fontSize="lg"
          fontWeight="semibold"
          mb={4}
          textAlign="center"
        >
          Salary Trend
        </Text>
        <Box h="80">
          <Line data={chartData} options={chartOptions} />
        </Box>
      </Box>
    </Box>
  );
}

export default SalaryDashboard;