
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import {
  Box, Flex, Button, Heading, Container, SimpleGrid, VStack, Link, Icon, Text, Drawer,
  DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure,
  IconButton, useColorMode, useBreakpointValue, Select, useToast,
} from '@chakra-ui/react';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaBars, FaMoon, FaSun } from 'react-icons/fa';
import { useLanguage } from './LanguageContext';
import { ThemeProvider, useTheme } from './ThemeContext';
import axios from 'axios';
import Home from './Home';
import Store from './Store';
import HairAppointment from './HairAppointment';
import LogoutHome from './LogoutHome';
import Nail from './Nail';
import NailAppointment from './NailAppointment';
import Tattoo from './Tattoo';
import TattooAppointment from './TattooAppointment';
import Piercings from './Piercings';
import PiercingAppointment from './PiercingAppointment';
import Skin from './Skin';
import SkinApp from './SkinApp';
import Bridal from './Bridal';
import BridalApp from './BridalApp';
import OurWork from './OurWork';
import ContactUs from './ContactUs';
import AboutUs from './AboutUs';
import ResetPassword from './ResetPassword';
import Login from './Login';
import Register from './Register';
import AdminAppointments from './AdminAppointments.jsx';
import Hair from './Hair.jsx';
import Profile from './Profile.jsx';
import OwnerDashboard from './OwnerDashboard.jsx';
import InventoryManagement from './InventoryManagement';
import SalaryManagement from './SalaryManagement';
import EmployeeManagement from './EmployeeManagement';
import Messages from './Messages.jsx'; // NEW: Import Messages component
import ErrorBoundary from './ErrorBoundary';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, isLoggedIn, userData, allowedRoles }) => {
  if (!isLoggedIn || !userData || !allowedRoles.includes(userData.role)) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const buttonSize = useBreakpointValue({ base: 'sm', md: 'md', lg: 'lg' });
  const { language, setLanguage, t } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const { currentTheme } = useTheme();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/auth/is-auth', { withCredentials: true });
        if (response.data.success) {
          setIsLoggedIn(true);
          const userResponse = await axios.get('http://localhost:4000/api/user/data', { withCredentials: true });
          setUserData(userResponse.data.success ? userResponse.data.userData : null);
        } else {
          setIsLoggedIn(false);
          setUserData(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsLoggedIn(false);
        setUserData(null);
      }
    };
    checkAuthStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:4000/api/auth/logout', {}, { withCredentials: true });
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      setIsLoggedIn(false);
      setUserData(null);
      window.location.href = '/logout';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    { to: '/home', label: t('home') },
    { to: '/store', label: t('store') || 'Store' },
    { to: '/hair', label: t('hair') },
    { to: '/nail', label: t('nail') },
    { to: '/tattoo', label: t('tattoo') },
    { to: '/piercings', label: t('piercings') },
    { to: '/skin', label: t('skin') },
    { to: '/bridal', label: t('bridal') },
    { to: '/our-work', label: t('ourWork') },
    { to: '/about-us', label: t('aboutUs') },
    { to: '/contact-us', label: t('contact') },
  ];

  const updatedNavItems = isLoggedIn
    ? [
        ...navItems,
        { to: '/profile', label: t('profile') },
        ...(userData && userData.role === 'admin' ? [
          { to: '/owner/dashboard', label: t('ownerDashboard') },
          
        ] : []),
      ]
    : navItems;

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Box
            bg={colorMode === 'light' ? 'white' : 'gray.800'}
            p={{ base: 3, md: 4 }}
            position="sticky"
            top={0}
            zIndex={10}
            boxShadow="md"
            borderBottom="2px solid"
            borderColor={currentTheme.primaryColor}
          >
            <Container maxW="container.xl">
              <Flex
                justify="space-between"
                align="center"
                gap={{ base: 2, md: 4 }}
                wrap="wrap"
              >
                <Heading
                  as={NavLink}
                  to="/home"
                  size={{ base: 'md', md: 'lg' }}
                  fontFamily="'Playfair Display', serif"
                  color={currentTheme.primaryColor}
                  flexShrink={0}
                >
                  Glamist
                </Heading>
                <IconButton
                  display={{ base: 'block', md: 'none' }}
                  icon={<FaBars />}
                  onClick={onOpen}
                  color={currentTheme.primaryColor}
                  variant="ghost"
                  aria-label="Open menu"
                  size="lg"
                />
                <Flex
                  gap={{ base: 2, md: 4 }}
                  alignItems="center"
                  display={{ base: 'none', md: 'flex' }}
                  flexWrap="wrap"
                  justifyContent="flex-end"
                  maxW={{ md: '70%', lg: '80%' }}
                >
                  {updatedNavItems.map((item) => (
                    <Button
                      key={item.to}
                      as={NavLink}
                      to={item.to}
                      variant="ghost"
                      color={currentTheme.primaryColor}
                      fontSize={{ base: 'sm', md: 'md' }}
                      size={buttonSize}
                      px={{ base: 2, md: 3 }}
                      whiteSpace="nowrap"
                      _activeLink={{
                        bg: currentTheme.primaryColor,
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                  {isLoggedIn ? (
                    <>
                      <Button
                        onClick={handleLogout}
                        size={buttonSize}
                        bg={currentTheme.primaryColor}
                        color="white"
                      >
                        {t('logout')}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        as={NavLink}
                        to="/login"
                        variant="outline"
                        size={buttonSize}
                        color={currentTheme.primaryColor}
                      >
                        {t('logIn')}
                      </Button>
                      <Button
                        as={NavLink}
                        to="/signup"
                        size={buttonSize}
                        bg={currentTheme.primaryColor}
                        color="white"
                      >
                        {t('signUp')}
                      </Button>
                    </>
                  )}
                  <IconButton
                    aria-label="Toggle color mode"
                    icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
                    onClick={toggleColorMode}
                    variant="ghost"
                    color={currentTheme.primaryColor}
                    size="lg"
                  />
                  <Select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    size="sm"
                    w={{ base: '100px', md: '120px' }}
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="it">Italiano</option>
                    <option value="si">සිංහල</option>
                    <option value="ja">日本語</option>
                    <option value="ko">한국어</option>
                  </Select>
                </Flex>
              </Flex>
            </Container>

            <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
              <DrawerOverlay />
              <DrawerContent bg={colorMode === 'light' ? 'white' : 'gray.800'}>
                <DrawerCloseButton color={currentTheme.primaryColor} />
                <DrawerHeader color={currentTheme.primaryColor}>Glamist</DrawerHeader>
                <DrawerBody>
                  <VStack spacing={3} align="start">
                    {updatedNavItems.map((item) => (
                      <Button
                        key={item.to}
                        as={NavLink}
                        to={item.to}
                        variant="ghost"
                        w="full"
                        justifyContent="start"
                        color={currentTheme.primaryColor}
                        onClick={onClose}
                      >
                        {item.label}
                      </Button>
                    ))}
                    {isLoggedIn ? (
                      <>
                        <Button
                          onClick={() => { handleLogout(); onClose(); }}
                          variant="ghost"
                          w="full"
                          justifyContent="start"
                          color={currentTheme.primaryColor}
                        >
                          {t('logout')}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          as={NavLink}
                          to="/login"
                          variant="ghost"
                          w="full"
                          justifyContent="start"
                          color={currentTheme.primaryColor}
                          onClick={onClose}
                        >
                          {t('logIn')}
                        </Button>
                        <Button
                          as={NavLink}
                          to="/signup"
                          variant="ghost"
                          w="full"
                          justifyContent="start"
                          color={currentTheme.primaryColor}
                          onClick={onClose}
                        >
                          {t('signUp')}
                        </Button>
                      </>
                    )}
                    <Select
                      value={language}
                      onChange={(e) => { setLanguage(e.target.value); onClose(); }}
                      size="sm"
                      w="full"
                      mt={4}
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="it">Italiano</option>
                      <option value="si">සිංහල</option>
                      <option value="ja">日本語</option>
                      <option value="ko">한국어</option>
                    </Select>
                  </VStack>
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          </Box>

          <Box minH="calc(100vh - 60px)">
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/store" element={<Store />} />
              <Route path="/hair" element={<Hair />} />
              <Route path="/logout" element={<LogoutHome />} />
              <Route path="/nail" element={<Nail />} />
              <Route path="/nail-schedule" element={<NailAppointment />} />
              <Route path="/tattoo" element={<Tattoo />} />
              <Route path="/tattoo-schedule" element={<TattooAppointment />} />
              <Route path="/piercings" element={<Piercings />} />
              <Route path="/skin" element={<Skin />} />
              <Route path="/bridal" element={<Bridal />} />
              <Route path="/our-work" element={<OurWork />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/bridalapp" element={<BridalApp />} />
              <Route path="/pierce" element={<PiercingAppointment />} />
              <Route path="/skinapp" element={<SkinApp />} />
              <Route path="/hair-app" element={<HairAppointment />} />
              <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserData={setUserData} />} />
              <Route path="/signup" element={<Register setIsLoggedIn={setIsLoggedIn} setUserData={setUserData} />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/inventory" element={<InventoryManagement />} />
              <Route
                path="/owner/dashboard"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn} userData={userData} allowedRoles={['admin']}>
                    <OwnerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/appointments"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn} userData={userData} allowedRoles={['admin']}>
                    <AdminAppointments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/salary-management"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn} userData={userData} allowedRoles={['admin']}>
                    <ErrorBoundary>
                      <SalaryManagement />
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employee-management"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn} userData={userData} allowedRoles={['admin']}>
                    <ErrorBoundary>
                      <EmployeeManagement />
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/messages"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn} userData={userData} allowedRoles={['admin']}>
                    <Messages />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/home" replace />} />
            </Routes>
          </Box>

          <Box
            as="footer"
            bg={colorMode === 'light' ? `${currentTheme.primaryColor.split('.')[0]}.800` : `${currentTheme.primaryColor.split('.')[0]}.900`}
            color="white"
            py={{ base: 10, md: 14 }}
          >
            <Container maxW="container.xl">
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 10, md: 12 }}>
                <VStack align={{ base: 'center', md: 'start' }} spacing={5}>
                  <Heading as="h3" size="lg" color={currentTheme.secondaryColor}>Glamist</Heading>
                  <Text fontSize="sm" color={colorMode === 'light' ? 'gray.300' : 'gray.400'}>
                    {t('footerTagline')}
                  </Text>
                  <Flex gap={4}>
                    {[
                      { icon: FaFacebook, href: 'https://facebook.com' },
                      { icon: FaInstagram, href: 'https://instagram.com' },
                      { icon: FaTwitter, href: 'https://twitter.com' },
                      { icon: FaLinkedin, href: 'https://linkedin.com' },
                    ].map((social) => (
                      <Link key={social.href} href={social.href} isExternal>
                        <Icon as={social.icon} boxSize={6} color={colorMode === 'light' ? 'gray.400' : 'gray.500'} />
                      </Link>
                    ))}
                  </Flex>
                </VStack>
                <VStack align={{ base: 'center', md: 'start' }} spacing={4}>
                  <Heading as="h4" size="md" color={currentTheme.secondaryColor}>{t('quickLinks')}</Heading>
                  {['home', 'aboutUs', 'services', 'contact'].map((link) => (
                    <Link
                      key={link}
                      as={NavLink}
                      to={`/${link === 'home' ? 'home' : link.toLowerCase().replace(' ', '-')}`}
                      color={colorMode === 'light' ? 'gray.400' : 'gray.500'}
                    >
                      {t(link)}
                    </Link>
                  ))}
                </VStack>
                <VStack align={{ base: 'center', md: 'start' }} spacing={4}>
                  <Heading as="h4" size="md" color={currentTheme.secondaryColor}>{t('contactUs')}</Heading>
                  <Text fontSize="sm" color={colorMode === 'light' ? 'gray.400' : 'gray.500'}>
                    {t('email')}: <Link href="mailto:support@glamist.com">support@glamist.com</Link>
                  </Text>
                  <Text fontSize="sm" color={colorMode === 'light' ? 'gray.400' : 'gray.500'}>
                    {t('phone')}: <Link href="tel:+94111234567">+94 11 123 4567</Link>
                  </Text>
                  <Text fontSize="sm" color={colorMode === 'light' ? 'gray.400' : 'gray.500'}>
                    {t('address')}
                  </Text>
                </VStack>
              </SimpleGrid>
              <Text textAlign="center" fontSize="sm" color={colorMode === 'light' ? 'gray.400' : 'gray.500'} mt={10}>
                {t('copyright')} <br /> {t('designedBy')}
              </Text>
            </Container>
          </Box>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;