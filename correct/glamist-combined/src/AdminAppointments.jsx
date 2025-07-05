import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  useToast,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import axios from 'axios';
import jsPDF from 'jspdf';

const MotionBox = motion(Box);

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false); // New state for PDF generation
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [editAppointment, setEditAppointment] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:4000/api/hair-appointments/admin/appointments');
        setAppointments(response.data.appointments);
      } catch (error) {
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to fetch appointments. Please try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        console.error('Error fetching appointments:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const downloadPDF = async () => {
    setPdfLoading(true);
    try {
      console.log('Generating PDF with appointments:', appointments);

      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('Appointments List', 14, 20);

      // Define table columns
      const columns = [
        'Customer Name',
        'Phone Number',
        'Service',
        'Staff',
        'Date',
        'Time',
      ];

      // Prepare table rows with fallbacks for undefined values
      const rows = appointments.map((appointment) => [
        appointment.customerName || 'N/A',
        appointment.phoneNumber || 'N/A',
        appointment.service || 'N/A',
        appointment.staff || 'N/A',
        appointment.date ? new Date(appointment.date).toLocaleDateString() : 'N/A',
        appointment.time || 'N/A',
      ]);

      // Use basic text output for the table
      let y = 30;
      doc.setFontSize(12);
      // Print headers
      columns.forEach((col, i) => {
        doc.text(col, 14 + i * 30, y);
      });
      y += 10;
      // Print rows
      rows.forEach((row) => {
        row.forEach((cell, i) => {
          doc.text(cell.toString(), 14 + i * 30, y);
        });
        y += 10;
      });

      // Save the PDF with a dynamic filename
      const fileName = `appointments_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

      toast({
        title: 'Success',
        description: 'PDF downloaded successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate PDF. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setPdfLoading(false);
    }
  };

  const onImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
  };

  const onImageModalClose = () => {
    setSelectedImage(null);
    setIsImageModalOpen(false);
  };

  const onEditClick = (appointment) => {
    setEditAppointment({ ...appointment });
    setIsEditModalOpen(true);
  };

  const onEditModalClose = () => {
    setEditAppointment(null);
    setIsEditModalOpen(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditAppointment((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:4000/api/hair-appointments/admin/appointments/${editAppointment._id}`,
        {
          customerName: editAppointment.customerName,
          phoneNumber: editAppointment.phoneNumber,
          service: editAppointment.service,
          staff: editAppointment.staff,
          date: editAppointment.date,
          time: editAppointment.time,
        }
      );
      setAppointments((prev) =>
        prev.map((appt) => (appt._id === editAppointment._id ? response.data.appointment : appt))
      );
      toast({
        title: 'Success',
        description: 'Appointment updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onEditModalClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update appointment. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error('Error updating appointment:', error.response?.data || error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      await axios.delete(`http://127.0.0.1:4000/api/hair-appointments/admin/appointments/${id}`);
      setAppointments((prev) => prev.filter((appt) => appt._id !== id));
      toast({
        title: 'Success',
        description: 'Appointment deleted successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete appointment. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error('Error deleting appointment:', error.response?.data || error.message);
    }
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      p={6}
      maxW="1000px"
      mx="auto"
      mt={10}
      borderWidth="1px"
      borderRadius={8}
      boxShadow="lg"
    >
      <Button
        colorScheme="teal"
        mb={4}
        onClick={downloadPDF}
        isDisabled={loading || appointments.length === 0 || pdfLoading}
        isLoading={pdfLoading}
        loadingText="Generating PDF"
      >
        Download PDF
      </Button>

      <Table variant="simple">
        <TableCaption>Appointments List</TableCaption>
        <Thead>
          <Tr>
            <Th>Customer Name</Th>
            <Th>Phone Number</Th>
            <Th>Service</Th>
            <Th>Staff</Th>
            <Th>Date</Th>
            <Th>Time</Th>
            <Th>Image</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {loading ? (
            <Tr>
              <Td colSpan={8}>Loading...</Td>
            </Tr>
          ) : appointments.length === 0 ? (
            <Tr>
              <Td colSpan={8}>No appointments found.</Td>
            </Tr>
          ) : (
            appointments.map((appointment) => (
              <Tr key={appointment._id}>
                <Td>{appointment.customerName}</Td>
                <Td>{appointment.phoneNumber}</Td>
                <Td>{appointment.service}</Td>
                <Td>{appointment.staff}</Td>
                <Td>{new Date(appointment.date).toLocaleDateString()}</Td>
                <Td>{appointment.time}</Td>
                <Td>
                  {appointment.image ? (
                    <Image
                      src={`http://127.0.0.1:4000/${appointment.image}`}
                      alt="Uploaded by customer"
                      boxSize="50px"
                      objectFit="cover"
                      borderRadius="md"
                      cursor="pointer"
                      onClick={() => onImageClick(`http://127.0.0.1:4000/${appointment.image}`)}
                    />
                  ) : (
                    'N/A'
                  )}
                </Td>
                <Td>
                  <Button
                    colorScheme="blue"
                    size="sm"
                    mr={2}
                    onClick={() => onEditClick(appointment)}
                  >
                    Edit
                  </Button>
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleDelete(appointment._id)}
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>

      {/* Modal for Enlarged Image */}
      <Modal isOpen={isImageModalOpen} onClose={onImageModalClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enlarged Image</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedImage && (
              <Image src={selectedImage} alt="Enlarged view" maxH="80vh" objectFit="contain" />
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onImageModalClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal for Editing Appointment */}
      <Modal isOpen={isEditModalOpen} onClose={onEditModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Appointment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {editAppointment && (
              <Box>
                <FormControl mb={4}>
                  <FormLabel>Customer Name</FormLabel>
                  <Input
                    name="customerName"
                    value={editAppointment.customerName}
                    onChange={handleEditChange} // Fixed typo
                  />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    name="phoneNumber"
                    value={editAppointment.phoneNumber}
                    onChange={handleEditChange}
                  />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Service</FormLabel>
                  <Select
                    name="service"
                    value={editAppointment.service}
                    onChange={handleEditChange}
                  >
                    <option value="Haircut">Haircut</option>
                    <option value="Coloring">Coloring</option>
                    <option value="Styling">Styling</option>
                  </Select>
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Staff</FormLabel>
                  <Select
                    name="staff"
                    value={editAppointment.staff}
                    onChange={handleEditChange}
                  >
                    <option value="John Doe">John Doe</option>
                    <option value="Jane Smith">Jane Smith</option>
                  </Select>
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Date</FormLabel>
                  <Input
                    type="date"
                    name="date"
                    value={new Date(editAppointment.date).toISOString().split('T')[0]}
                    onChange={handleEditChange}
                  />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Time</FormLabel>
                  <Input
                    type="time"
                    name="time"
                    value={editAppointment.time}
                    onChange={handleEditChange}
                  />
                </FormControl>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleEditSubmit}>
              Save
            </Button>
            <Button variant="ghost" onClick={onEditModalClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </MotionBox>
  );
};

export default AdminAppointments;