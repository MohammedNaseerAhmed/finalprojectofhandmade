require('dotenv').config(); // first
const exp = require('express');
const app = exp();
const cors = require('cors');
const mongoose = require('mongoose');

// Import routes after dotenv
const buyerApp = require('./Apis/BuyerApi');
const sellerApp = require('./Apis/SellerApi');
const productApp = require('./Apis/ProductApi');
const cartApp = require('./Apis/CartApi');
const orderApp = require('./Apis/OrderApi');
const reviewApp = require('./Apis/ReviewApi');
const chat_app = require('./Apis/ChatBotApi')
const authApp = require('./Apis/AuthApi')
const uploadApp = require('./Apis/UploadApi')
// Middleware
app.use(exp.json());
app.use(cors());

// Optional request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Test route
app.get("/test", (req, res) => res.send("Server is running!"));

// Mount routes
app.use('/auth', authApp);
app.use('/upload-api', uploadApp);
app.use('/buyer-api', buyerApp);
app.use('/seller-api', sellerApp);
app.use('/product-api', productApp);
app.use('/cart-api', cartApp);
app.use('/order-api', orderApp);
app.use('/review-api', reviewApp);
app.use('/chatbot-api',chat_app)
// DB connection + server start
const port = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB connection successful"))
  .then(() => app.listen(port, () => console.log(`Server listening on port ${port}..`)))
  .catch(err => console.log("DB connection error:", err));
