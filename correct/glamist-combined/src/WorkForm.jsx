import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  useToast,
} from '@chakra-ui/react';

const WorkForm = ({ work, onSave, onCancel }) => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    category: work?.category || '',
    title: work?.title || '',
    description: work?.description || '',
    height: work?.height || '',
    artist: work?.artist || '',
  });
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const resetForm = () => {
    setFormData({
      category: '',
      title: '',
      description: '',
      height: '',
      artist: '',
    });
    setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('category', formData.category);
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('height', formData.height);
      data.append('artist', formData.artist);
      if (imageFile) {
        data.append('image', imageFile);
      }

      let response;
      if (work?._id) {
        // Update existing work
        response = await fetch(`http://localhost:4000/api/works/${work._id}`, {
          method: 'PUT',
          body: data,
        });
      } else {
        // Create new work
        response = await fetch('http://localhost:4000/api/works', {
          method: 'POST',
          body: data,
        });
      }

      const { success, message } = await response.json();
      if (success) {
        toast({
          title: work?._id ? 'Work Updated' : 'Work Created',
          description: 'Your work has been saved successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        resetForm(); // Clear form after successful save
        onSave(); // Close modal and refresh works
      } else {
        toast({
          title: 'Error',
          description: message || 'Failed to save work.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'A network error occurred. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={6} bg="white" borderRadius="lg" boxShadow="md">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>Category</FormLabel>
            <Select name="category" value={formData.category} onChange={handleChange} required>
              <option value="">Select Category</option>
              <option value="Hair">Hair</option>
              <option value="Nails">Nails</option>
              <option value="Tattoo">Tattoo</option>
              <option value="Piercing">Piercing</option>
              <option value="Skin">Skin</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input name="title" value={formData.title} onChange={handleChange} required />
          </FormControl>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea name="description" value={formData.description} onChange={handleChange} required />
          </FormControl>
          <FormControl>
            <FormLabel>Image</FormLabel>
            <Input
              type="file"
              name="image"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFileChange}
              required={!work} // Required only for new works
            />
          </FormControl>
          <FormControl>
            <FormLabel>Height (e.g., 350px)</FormLabel>
            <Input name="height" value={formData.height} onChange={handleChange} required />
          </FormControl>
          <FormControl>
            <FormLabel>Artist</FormLabel>
            <Input name="artist" value={formData.artist} onChange={handleChange} required />
          </FormControl>
          <Box>
            <Button type="submit" colorScheme="teal" mr={4}>Save</Button>
            <Button onClick={onCancel}>Cancel</Button>
          </Box>
        </VStack>
      </form>
    </Box>
  );
};

export default WorkForm;