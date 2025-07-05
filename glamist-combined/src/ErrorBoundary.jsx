import React, { Component } from 'react';
import { Box, Text, Button } from '@chakra-ui/react';

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught in ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box textAlign="center" py={10}>
          <Text fontSize="xl" color="red.500" mb={4}>
            Something went wrong: {this.state.error?.message || 'Unknown error'}
          </Text>
          <Button
            onClick={() => this.setState({ hasError: false, error: null })}
            colorScheme="blue"
          >
            Try Again
          </Button>
        </Box>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;