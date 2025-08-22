# MERN E-commerce Application

A full-stack e-commerce application built with MongoDB, Express.js, React, and Node.js featuring a comprehensive admin panel, user authentication, shopping cart, and order management system.

## 🚀 Features

### User Features
- **Authentication & Authorization**: User registration/login with JWT
- **Product Browsing**: Search, filter by category, pagination
- **Shopping Cart**: Add/remove products, quantity management
- **Checkout Process**: Secure checkout with address and payment info
- **Order Management**: View order history and track orders
- **User Profile**: Update personal information and addresses

### Admin Features
- **Dashboard**: Overview statistics and analytics
- **Product Management**: Add, edit, delete products with image support
- **Order Management**: View, update order status, and track deliveries
- **User Management**: View users, manage roles and permissions
- **Inventory Tracking**: Stock management and low stock alerts

### Technical Features
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **State Management**: Redux Toolkit for efficient state management
- **Real-time Updates**: Toast notifications for user feedback
- **Image Handling**: Dynamic image URLs from Unsplash
- **Data Seeding**: Automated seeding with 250+ products
- **Security**: Password hashing, JWT authentication, protected routes

## 🛠️ Technologies Used

### Frontend
- **React 18** with TypeScript
- **Redux Toolkit** for state management
- **React Router DOM** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for API calls
- **React Toastify** for notifications

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests
- **Multer** for file uploads

## 📁 Project Structure

```
├── backend/
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Auth & error middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── seedData.js         # Database seeding script
│   └── server.js           # Express server setup
├── src/
│   ├── components/         # Reusable React components
│   ├── pages/             # Page components
│   │   └── admin/         # Admin panel pages
│   ├── store/             # Redux store setup
│   │   └── slices/        # Redux slices
│   └── App.tsx            # Main App component
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mern-ecommerce
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   cd ..
   ```

3. **Environment Setup**
   
   Create a `.env` file in the `backend` directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. **Database Setup**
   
   Start MongoDB and run the seeding script:
   ```bash
   # Seed the database with sample data
   npm run seed
   ```

5. **Start the application**
   ```bash
   # Start both frontend and backend concurrently
   npm run dev
   ```

   Or start them separately:
   ```bash
   # Terminal 1 - Backend
   npm run server
   
   # Terminal 2 - Frontend  
   npm run client
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 👥 Demo Accounts

### Admin Account
- **Email**: admin@example.com
- **Password**: admin123
- **Access**: Full admin panel access

### User Accounts
- **Email**: john@example.com / **Password**: user123
- **Email**: jane@example.com / **Password**: user123

## 🗃️ Database Schema

### User Model
- Personal information (name, email, password)
- Role-based access (user/admin)
- Address information
- Shopping cart items

### Product Model
- Product details (name, description, price, category)
- Inventory management (stock levels)
- Image galleries
- Customer reviews and ratings
- Brand and specifications

### Order Model
- Order items and quantities
- Shipping address
- Payment information
- Order status tracking
- Delivery information

## 🔒 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Role-based access control
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Secure cross-origin resource sharing

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Responsive Layout**: Optimized for all device sizes
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Real-time feedback
- **Smooth Animations**: Hover effects and transitions

## 📊 Product Data

The application includes 250+ seeded products across 8 categories:
- Electronics (phones, laptops, accessories)
- Clothing (shirts, dresses, jackets)
- Shoes (sneakers, boots, formal shoes)
- Accessories (watches, bags, jewelry)
- Home Decor (furniture, decorations)
- Beauty (cosmetics, skincare)
- Sports (equipment, apparel)
- Grocery (food items, beverages)

Each product includes:
- Dynamic images from Unsplash
- Realistic pricing with discounts
- Stock levels and ratings
- Brand information and specifications

## 🚀 Deployment

### Frontend Deployment
```bash
npm run build
```

### Backend Deployment
Ensure environment variables are set:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Strong secret key
- `NODE_ENV=production`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Product images provided by [Unsplash](https://unsplash.com)
- Icons by [Lucide React](https://lucide.dev)
- UI components inspired by modern e-commerce platforms

## 📞 Support

For support, email your-email@example.com or create an issue in the repository.