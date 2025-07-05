import mongoose from 'mongoose';

// Define the schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  image: String,
 
});

// Export the model, reusing it if already defined
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;