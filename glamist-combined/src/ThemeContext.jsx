import React, { createContext, useContext, useState } from 'react';

// Holiday and default themes (shared across all pages)
const themes = {
  valentines: {
    primaryColor: 'red.500',
    secondaryColor: 'pink.300',
    bgGradient: 'linear(to-r, red.600, pink.400)',
    sectionBg: 'pink.50',
  },
  newYear: {
    primaryColor: 'gold.500',
    secondaryColor: 'blackAlpha.700',
    bgGradient: 'linear(to-r, gold.600, blackAlpha.800)',
    sectionBg: 'gold.50',
  },
  halloween: {
    primaryColor: 'orange.500',
    secondaryColor: 'purple.700',
    bgGradient: 'linear(to-r, orange.600, purple.800)',
    sectionBg: 'orange.50',
  },
  christmas: {
    primaryColor: 'green.500',
    secondaryColor: 'red.500',
    bgGradient: 'linear(to-r, green.600, red.600)',
    sectionBg: 'green.50',
  },
  default: {
    primaryColor: 'purple.600',
    secondaryColor: 'purple.200',
    bgGradient: 'linear(to-r, purple.900, transparent)',
    sectionBg: 'gray.50',
  },
};

// Holiday and default background images (shared across all pages)
const backgroundImages = {
  valentines: [
    'https://images.unsplash.com/photo-1518894781321-630e638d0742?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
  ],
  newYear: [
    'https://cdn.shopify.com/s/files/1/0520/4983/8237/files/monthly_hair_care_maintenance.webp?v=1706626977',
    'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
    'https://assets.isu.pub/document-structure/230517022316-4cdea0d133274a30e56c8f60a125ef99/v1/8145eab4c67b2acf84f088c250aaa131.jpeg',
  ],
  halloween: [
    'https://cdn.shopify.com/s/files/1/0520/4983/8237/files/monthly_hair_care_maintenance.webp?v=1706626977',
    'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
    'https://assets.isu.pub/document-structure/230517022316-4cdea0d133274a30e56c8f60a125ef99/v1/8145eab4c67b2acf84f088c250aaa131.jpeg',
  ],
  christmas: [
    'https://cdn.shopify.com/s/files/1/0520/4983/8237/files/monthly_hair_care_maintenance.webp?v=1706626977',
    'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
    'https://assets.isu.pub/document-structure/230517022316-4cdea0d133274a30e56c8f60a125ef99/v1/8145eab4c67b2acf84f088c250aaa131.jpeg',
  ],
  default: [
    'https://cdn.shopify.com/s/files/1/0520/4983/8237/files/monthly_hair_care_maintenance.webp?v=1706626977',
    'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
    'https://assets.isu.pub/document-structure/230517022316-4cdea0d133274a30e56c8f60a125ef99/v1/8145eab4c67b2acf84f088c250aaa131.jpeg',
  ],
};

// Function to determine the theme based on exact holiday dates
const getThemeKey = (date) => {
  const month = date.getMonth(); // 0 = Jan, 11 = Dec
  const day = date.getDate();

  if (month === 1 && day === 14) return 'valentines'; // Feb 14
  if (month === 0 && day === 1) return 'newYear';     // Jan 1
  if (month === 9 && day === 31) return 'halloween';  // Oct 31
  if (month === 11 && day === 25) return 'christmas'; // Dec 25

  return 'default'; // Default theme for all other days
};

// Create Theme Context
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Centralize the date here (change this for testing or use new Date() for production)
  const [currentDate, setCurrentDate] = useState(new Date('2025-02-10')); // Testing Christmas theme

  const themeKey = getThemeKey(currentDate);
  const currentTheme = themes[themeKey];
  const currentBackgroundImages = backgroundImages[themeKey];

  // Optional: Function to update the date dynamically if needed
  const updateDate = (newDate) => {
    setCurrentDate(newDate);
  };

  return (
    <ThemeContext.Provider value={{ currentDate, themeKey, currentTheme, currentBackgroundImages, updateDate }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};