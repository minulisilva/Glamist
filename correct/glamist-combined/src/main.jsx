import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { LanguageProvider } from './LanguageContext'; // Assuming you have this
import { ThemeProvider } from './ThemeContext'; // Import ThemeProvider
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <ThemeProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </ThemeProvider>
    </ChakraProvider>
  </React.StrictMode>
);