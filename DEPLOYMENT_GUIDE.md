# DEPLOYMENT INSTRUCTIONS

## Option 1: Deploy to Render.com (Recommended - Free)

### Backend Deployment:
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Select the backend folder
6. Use these settings:
   - Build Command: npm install
   - Start Command: npm start
7. Click "Create Web Service"

### Frontend Deployment:
1. In Render.com, click "New +" → "Static Site"
2. Connect your GitHub repository  
3. Select the frontend folder
4. Build Command: npm run build
5. Publish Directory: build
6. Click "Create Static Site"

## Option 2: Deploy to Netlify (Frontend) + Render (Backend)

### Frontend on Netlify:
1. Go to https://netlify.com
2. Drag and drop the 'frontend/build' folder
3. Set environment variable:
   - REACT_APP_API_URL: your-backend-url.onrender.com

## Important Notes:
- Your backend URL will be provided by Render after deployment
- Update the REACT_APP_API_URL in frontend with your actual backend URL
- The database will be persistent on Render's free tier

## Testing Online:
1. Backend: https://your-backend-url.onrender.com/api/feedback
2. Frontend: https://your-frontend-url.netlify.app
