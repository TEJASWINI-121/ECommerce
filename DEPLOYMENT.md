# 🚀 ShopEase E-commerce Deployment Guide

This guide will help you deploy your MERN stack e-commerce application with:
- **Frontend**: React (Vite) → Vercel
- **Backend**: Node.js/Express → Render
- **Database**: MongoDB Atlas

## 📋 Prerequisites

- GitHub account
- Vercel account
- Render account
- MongoDB Atlas account

## 🗄️ 1. DATABASE SETUP (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up/Login and create a new project
3. Click "Build a Database" → Choose "FREE" tier
4. Select your preferred cloud provider and region
5. Create cluster (takes 3-5 minutes)

### Step 2: Configure Database Access

1. **Database Access**:
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `shopease-admin`
   - Password: Generate secure password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

2. **Network Access**:
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Choose "Allow access from anywhere" (0.0.0.0/0)
   - Click "Confirm"

### Step 3: Get Connection String

1. Go to "Database" → Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string (looks like):
   ```
   mongodb+srv://shopease-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password
5. Add database name at the end: `/ecommerce`

**Final connection string example:**
```
mongodb+srv://shopease-admin:yourpassword@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
```

## 🖥️ 2. BACKEND DEPLOYMENT (Render)

### Step 1: Prepare Backend for Deployment

1. **Update package.json** (if needed):
   ```json
   {
     "scripts": {
       "start": "node server.js",
       "dev": "nodemon server.js"
     },
     "engines": {
       "node": ">=18.0.0"
     }
   }
   ```

2. **Create/Update .env file** in backend folder:
   ```env
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
   FRONTEND_URL=https://your-app-name.vercel.app
   ```

### Step 2: Deploy to Render

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Create Render Service**:
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `shopease-backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free

3. **Add Environment Variables**:
   - In Render dashboard, go to your service
   - Click "Environment" tab
   - Add these variables:
     ```
     NODE_ENV=production
     PORT=10000
     MONGODB_URI=your-mongodb-atlas-connection-string
     JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
     FRONTEND_URL=https://your-app-name.vercel.app
     ```

4. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Your backend will be available at: `https://shopease-backend.onrender.com`

### Step 3: Test Backend

Visit: `https://your-backend-url.onrender.com/api/health`

Should return:
```json
{
  "status": "OK",
  "message": "ShopEase Backend is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "production"
}
```

## 🌐 3. FRONTEND DEPLOYMENT (Vercel)

### Step 1: Prepare Frontend for Deployment

1. **Create .env file** in root directory:
   ```env
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

2. **Update package.json** (if needed):
   ```json
   {
     "scripts": {
       "build": "vite build",
       "preview": "vite preview"
     }
   }
   ```

3. **Test build locally**:
   ```bash
   npm run build
   npm run preview
   ```

### Step 2: Deploy to Vercel

#### Option A: Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   - Follow prompts
   - Choose your project settings
   - Deploy!

#### Option B: Vercel Dashboard

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare frontend for deployment"
   git push origin main
   ```

2. **Import Project**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Vite
     - **Root Directory**: `./` (if frontend is in root)
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

3. **Add Environment Variables**:
   - In project settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-url.onrender.com/api`

4. **Deploy**:
   - Click "Deploy"
   - Your app will be available at: `https://your-app-name.vercel.app`

### Step 3: Update Backend CORS

Update your backend's FRONTEND_URL environment variable in Render:
```
FRONTEND_URL=https://your-app-name.vercel.app
```

## 🌱 4. SEED DATABASE WITH PRODUCTS

After both frontend and backend are deployed:

1. **SSH into your local backend** or use Render's shell:
   ```bash
   cd backend
   node quickProductSeeder.js
   ```

2. **Or seed via API** (create an admin endpoint):
   - POST to `https://your-backend-url.onrender.com/api/admin/seed-products`

## ✅ 5. FINAL TESTING

### Test Complete Flow:

1. **Visit your frontend**: `https://your-app-name.vercel.app`
2. **Check products load**: Should see 200+ products
3. **Test search**: Search for "iPhone" or "Nike"
4. **Test categories**: Click on different categories
5. **Test cart**: Add products to cart
6. **Test checkout**: Complete an order
7. **Test authentication**: Register/Login

### Common Issues & Solutions:

#### Backend Issues:
- **CORS errors**: Check FRONTEND_URL in Render environment variables
- **Database connection**: Verify MongoDB Atlas connection string
- **API not responding**: Check Render logs for errors

#### Frontend Issues:
- **API calls failing**: Check VITE_API_URL environment variable
- **Build errors**: Run `npm run build` locally to debug
- **Images not loading**: Check image URLs in database

## 🔧 6. MAINTENANCE

### Updating Your App:

1. **Make changes locally**
2. **Test thoroughly**
3. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Your update message"
   git push origin main
   ```
4. **Auto-deployment**: Both Vercel and Render will auto-deploy

### Monitoring:

- **Render**: Check logs in Render dashboard
- **Vercel**: Check function logs in Vercel dashboard
- **MongoDB**: Monitor usage in Atlas dashboard

## 🎉 Congratulations!

Your ShopEase e-commerce application is now live with:
- ✅ 200+ unique products with category-correct images
- ✅ Advanced search and filtering
- ✅ Professional hosting setup
- ✅ Scalable architecture

**Your live URLs:**
- Frontend: `https://your-app-name.vercel.app`
- Backend: `https://your-backend-url.onrender.com`
- Database: MongoDB Atlas cluster

## 📞 Support

If you encounter issues:
1. Check the logs in Render/Vercel dashboards
2. Verify environment variables
3. Test API endpoints individually
4. Check MongoDB Atlas connection

Happy selling! 🛒✨
