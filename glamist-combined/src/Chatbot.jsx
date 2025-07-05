import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  VStack,
  Text,
  IconButton,
  useColorMode,
  Image,
  Flex,
  Badge,
  Input,
  FormControl,
} from '@chakra-ui/react';
import { FaTimes, FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeContext';

const MotionButton = motion(Button);
const MotionBox = motion(Box);

// SpeechRecognition API setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const generateResponse = (question) => {
  const lowerQuestion = question.toLowerCase().trim();

  if (lowerQuestion.includes('hi') || lowerQuestion.includes('hello') || lowerQuestion.includes('hey')) {
    return 'Hi there! How can I assist you today?';
  }
  if (lowerQuestion.includes('service') || lowerQuestion.includes('offer') || lowerQuestion.includes('what do you do')) {
    return 'We offer haircuts, styling, coloring, nail services, tattoos, piercings, skin care, and bridal packages. Check our services page for more details!';
  } else if (lowerQuestion.includes('hair') || lowerQuestion.includes('haircut')) {
    return 'We provide haircuts, styling, coloring, and treatments. Prices start at $30. Visit our Hair page for more info!';
  } else if (lowerQuestion.includes('nail') || lowerQuestion.includes('manicure') || lowerQuestion.includes('pedicure')) {
    return 'Our nail services include manicures, pedicures, and nail art starting at $25. See the Nail page for details!';
  } else if (lowerQuestion.includes('tattoo')) {
    return 'We offer custom tattoos starting at $50, depending on size and complexity. Check our Tattoo page for more!';
  } else if (lowerQuestion.includes('piercing')) {
    return 'We do ear, nose, and body piercings starting at $20. Visit our Piercings page for more information!';
  } else if (lowerQuestion.includes('skin') || lowerQuestion.includes('facial')) {
    return 'Our skin care services include facials and treatments starting at $40. See the Skin page for details!';
  } else if (lowerQuestion.includes('bridal') || lowerQuestion.includes('wedding')) {
    return 'We offer bridal hair, makeup, and nail packages starting at $150. Check our Bridal page for more!';
  } else if (lowerQuestion.includes('book') || lowerQuestion.includes('appointment') || lowerQuestion.includes('schedule')) {
    return 'You can book an appointment via the "Book Now" button on our home page or call us at +94 11 123 4567.';
  } else if (lowerQuestion.includes('cancel') || lowerQuestion.includes('reschedule')) {
    return 'To cancel or reschedule, please call us at +94 11 123 4567 or email support@glamist.com at least 24 hours in advance.';
  } else if (lowerQuestion.includes('price') || lowerQuestion.includes('cost') || lowerQuestion.includes('how much')) {
    return 'Prices vary by service: haircuts from $30, nails from $25, tattoos from $50, piercings from $20, and facials from $40. Visit our services page for a full list!';
  } else if (lowerQuestion.includes('discount') || lowerQuestion.includes('deal') || lowerQuestion.includes('promotion')) {
    return 'We offer 20% off your first visit and seasonal promotions. Check the "Exclusive Offers" section on our home page!';
  } else if (lowerQuestion.includes('location') || lowerQuestion.includes('where') || lowerQuestion.includes('address')) {
    return 'We’re located at 123 Glam Street, Beauty City. Find a map and directions on our Contact page!';
  } else if (lowerQuestion.includes('hours') || lowerQuestion.includes('open') || lowerQuestion.includes('close')) {
    return 'We’re open Monday to Saturday from 9 AM to 6 PM. Holiday hours may vary—check our Contact page!';
  } else if (lowerQuestion.includes('staff') || lowerQuestion.includes('stylist') || lowerQuestion.includes('artist')) {
    return 'Our team consists of certified stylists, nail technicians, tattoo artists, and skin care experts. Meet them on our About Us page!';
  } else if (lowerQuestion.includes('experience') || lowerQuestion.includes('how long')) {
    return 'Our staff have years of experience—some over 10 years! Learn more about our team on the About Us page.';
  } else if (lowerQuestion.includes('refund') || lowerQuestion.includes('return')) {
    return 'Refunds are available within 7 days if you’re unsatisfied with a service. Contact us at support@glamist.com for details.';
  } else if (lowerQuestion.includes('payment') || lowerQuestion.includes('pay')) {
    return 'We accept cash, credit/debit cards, and online payments via our website.';
  } else if (lowerQuestion.includes('kids') || lowerQuestion.includes('children')) {
    return 'Yes, we offer kids’ haircuts and nail services! Prices start at $15—call us for details.';
  } else if (lowerQuestion.includes('pet') || lowerQuestion.includes('dog') || lowerQuestion.includes('animal')) {
    return 'Sorry, only service animals are allowed in the salon for safety and hygiene reasons.';
  } else if (lowerQuestion.includes('contact') || lowerQuestion.includes('reach') || lowerQuestion.includes('call')) {
    return 'You can reach us at +94 11 123 4567 or support@glamist.com. Visit our Contact page for more options!';
  } else if (lowerQuestion.includes('review') || lowerQuestion.includes('feedback')) {
    return 'We’d love your feedback! Leave a review on our website or social media pages.';
  } else if (lowerQuestion.includes('wait') || lowerQuestion.includes('busy')) {
    return 'Walk-ins are welcome, but booking ahead is recommended to avoid wait times, especially on weekends!';
  } else if (lowerQuestion.includes('gift') || lowerQuestion.includes('voucher')) {
    return 'Yes, we offer gift cards starting at $25! Purchase them online or in-store.';
  } else if (lowerQuestion.includes('product') || lowerQuestion.includes('sell')) {
    return 'We sell hair care, skin care, and nail products in-store. Ask your stylist for recommendations!';
  } else if (lowerQuestion.includes('how are you') || lowerQuestion.includes('how’s it going')) {
    return 'I’m doing great, thanks for asking! How can I make your day even better?';
  } else if (lowerQuestion.includes('joke') || lowerQuestion.includes('funny')) {
    return 'Why don’t skeletons fight each other? Because they don’t have the guts!';
  } else if (lowerQuestion.includes('weather')) {
    return 'I’m not a weather bot, but I’d say it’s always a good day to pamper yourself at Glamist!';
  } else {
    return 'Hmm, I’m not sure about that one. Could you give me more details, or contact our team at support@glamist.com for help?';
  }
};

const Chatbot = () => {
  const { colorMode } = useColorMode();
  const { currentTheme = { primaryColor: 'teal.500', secondaryColor: 'gray.300' } } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ sender: 'bot', text: 'Hello! How may I assist you today?' }]);
  const [userInput, setUserInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const messagesEndRef = useRef(null);

  // Initialize SpeechRecognition
  useEffect(() => {
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = 'en-US';

      recog.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserInput(transcript);
        setIsListening(false);
        handleSendMessage(transcript);
      };

      recog.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        let errorMessage = 'Sorry, I couldn’t understand that. Please try again or type your question.';
        if (event.error === 'no-speech') {
          errorMessage = 'No speech detected. Please speak clearly and try again.';
        } else if (event.error === 'not-allowed') {
          errorMessage = 'Microphone access denied. Please allow microphone permissions.';
        }
        setMessages((prev) => [...prev, { sender: 'bot', text: errorMessage }]);
      };

      recog.onend = () => {
        setIsListening(false);
      };

      setRecognition(recog);
      return () => {
        recog.stop();
      };
    }
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChatbot = () => setIsOpen(!isOpen);

  const handleSendMessage = (input = userInput) => {
    if (!input.trim()) return;
    const botResponse = generateResponse(input);
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: input },
      { sender: 'bot', text: botResponse },
    ]);
    setUserInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleVoiceInput = () => {
    if (!SpeechRecognition) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Voice input is not supported in your browser. Please type your question.' },
      ]);
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <>
      {!isOpen && (
        <Box position="fixed" bottom="30px" right="20px" zIndex={30}>
          <MotionBox
            position="absolute"
            right="70px"
            bottom="50px"
            bg="white"
            p={2}
            borderRadius="full"
            boxShadow="lg"
            border="1px solid"
            borderColor={currentTheme.primaryColor}
            w="250px"
            h="30px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, type: 'spring', bounce: 0.3 }}
          >
            <Text fontSize="sm" fontWeight="medium" color={currentTheme.primaryColor} fontFamily="'Poppins', sans-serif'" textAlign="center">
              Need help? Chat with us!
            </Text>
          </MotionBox>
          <IconButton
            aria-label="Open chatbot"
            icon={
              <Image
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80"
                alt="Chatbot Assistant"
                boxSize="60px"
                borderRadius="full"
                objectFit="cover"
                border="2px solid"
                borderColor={currentTheme.primaryColor}
              />
            }
            size="lg"
            bg={colorMode === 'light' ? 'gray.900' : 'gray.700'}
            borderRadius="full"
            onClick={toggleChatbot}
            as={motion.button}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{ scale: [1, 1.05, 1], transition: { duration: 1.5, repeat: Infinity } }}
            p={0}
          />
          <Badge
            position="absolute"
            top="-5px"
            left="-5px"
            bg={currentTheme.primaryColor}
            color="white"
            borderRadius="full"
            boxSize="20px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="12px"
          >
            1
          </Badge>
        </Box>
      )}

      {isOpen && (
        <MotionBox
          position="fixed"
          bottom="100px"
          right="30px"
          w={{ base: '90%', md: '400px' }}
          h="500px"
          bg={colorMode === 'light' ? 'white' : 'gray.800'}
          borderRadius="20px"
          boxShadow="xl"
          p={4}
          zIndex={30}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.3 }}
          border="1px solid"
          borderColor={currentTheme.primaryColor}
        >
          <VStack spacing={4} h="100%" justify="space-between">
            <Box w="full" display="flex" justifyContent="space-between" alignItems="center">
              <Flex align="center">
                <Image
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80"
                  alt="Support Agent"
                  boxSize="40px"
                  borderRadius="full"
                  mr={2}
                />
                <Box>
                  <Text fontSize="md" fontWeight="bold" color={colorMode === 'light' ? 'gray.800' : 'gray.200'} fontFamily="'Cinzel', serif">
                    Glamist Assistant
                  </Text>
                  <Text fontSize="sm" color="gray.500" fontFamily="'Poppins', sans-serif">
                    Always here for you
                  </Text>
                </Box>
              </Flex>
              <IconButton
                aria-label="Close chatbot"
                icon={<FaTimes />}
                size="sm"
                variant="ghost"
                color={currentTheme.primaryColor}
                onClick={toggleChatbot}
              />
            </Box>
            <Box w="full" flex="1" overflowY="auto" px={2}>
              <VStack spacing={3} align="stretch">
                {messages.map((msg, index) => (
                  <Flex key={index} justify={msg.sender === 'bot' ? 'flex-start' : 'flex-end'}>
                    <Box
                      maxW="70%"
                      p={3}
                      bg={msg.sender === 'bot' ? 'gray.100' : currentTheme.primaryColor}
                      color={msg.sender === 'bot' ? 'gray.800' : 'white'}
                      borderRadius="15px"
                      borderTopLeftRadius={msg.sender === 'bot' ? '0' : '15px'}
                      borderTopRightRadius={msg.sender === 'user' ? '0' : '15px'}
                      fontFamily="'Poppins', sans-serif"
                    >
                      <Text fontSize="sm">{msg.text}</Text>
                    </Box>
                  </Flex>
                ))}
                <div ref={messagesEndRef} />
              </VStack>
            </Box>
            <FormControl w="full" display="flex" alignItems="center" gap={2}>
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isListening ? 'Listening...' : 'Ask me anything...'}
                size="sm"
                borderRadius="full"
                bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
                borderColor={currentTheme.secondaryColor}
                _focus={{ borderColor: currentTheme.primaryColor, boxShadow: `0 0 0 1px ${currentTheme.primaryColor}` }}
                fontFamily="'Poppins', sans-serif"
              />
              <IconButton
                aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
                icon={isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
                size="sm"
                colorScheme={isListening ? 'red' : currentTheme.primaryColor.split('.')[0]}
                borderRadius="full"
                onClick={toggleVoiceInput}
                _hover={{ transform: 'scale(1.05)' }}
              />
              <Button
                size="sm"
                colorScheme={currentTheme.primaryColor.split('.')[0]}
                borderRadius="full"
                onClick={() => handleSendMessage()}
                _hover={{ transform: 'scale(1.05)' }}
                fontFamily="'Poppins', sans-serif"
              >
                Send
              </Button>
            </FormControl>
          </VStack>
        </MotionBox>
      )}
    </>
  );
};

export default Chatbot;