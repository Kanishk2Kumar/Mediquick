require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./models/Order'); // Adjust the path to your model

// Print the environment variable to verify it's loaded
console.log('MongoDB URI:', process.env.MONGO_URL);

const orders = [
  {
    username: "john_doe",
    products: [
      { productId: "prod001", quantity: 2, category: "MobilityAids" },
      { productId: "prod002", quantity: 1, category: "DailyLivingAids" }
    ],
    amount: 3200.00, // Amount in INR
    address: {
      street: "12A, MG Road",
      city: "Mumbai",
      state: "Maharashtra",
      pin: "400001"
    },
    status: "pending"
  },
  {
    username: "jane_smith",
    products: [
      { productId: "prod003", quantity: 1, category: "RespiratoryEquipment" },
      { productId: "prod004", quantity: 3, category: "PatientMonitoring" },
      { productId: "prod005", quantity: 2, category: "RehabilitationEquipment" }
    ],
    amount: 4500.00, // Amount in INR
    address: {
      street: "45, Brigade Road",
      city: "Bangalore",
      state: "Karnataka",
      pin: "560001"
    },
    status: "shipped"
  },
  {
    username: "mike_jones",
    products: [
      { productId: "prod006", quantity: 2, category: "HospitalBeds" },
      { productId: "prod007", quantity: 1, category: "WoundCare" }
    ],
    amount: 6500.00, // Amount in INR
    address: {
      street: "78, G-Block",
      city: "Delhi",
      state: "Delhi",
      pin: "110001"
    }
  },
  {
    username: "susan_lee",
    products: [
      { productId: "prod008", quantity: 5, category: "DiagnosticsEquipment" },
      { productId: "prod009", quantity: 2, category: "EmergencyEquipment" }
    ],
    amount: 5000.00, // Amount in INR
    address: {
      street: "101, Main Street",
      city: "Chennai",
      state: "Tamil Nadu",
      pin: "600001",
      country: "India",
      additionalInfo: "Near Park"
    },
    status: "completed"
  },
  {
    username: "linda_brown",
    products: [
      { productId: "prod010", quantity: 3, category: "IncontinenceProducts" },
      { productId: "prod011", quantity: 4, category: "MobilityAids" }
    ],
    amount: 4200.00, // Amount in INR
    address: {
      street: "202, Central Avenue",
      city: "Hyderabad",
      state: "Telangana",
      pin: "500001"
    },
    status: "pending"
  }
];

// Connect to MongoDB using the URI from .env
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
  
  // Insert example orders
  return Order.insertMany(orders);
})
.then(() => {
  console.log('Orders added successfully!');
})
.catch(err => {
  console.error('Error adding orders:', err);
})
.finally(() => {
  mongoose.disconnect();
});
