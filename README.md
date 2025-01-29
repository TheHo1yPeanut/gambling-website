# Simple Website with Login Feature

This project is a simple web application that implements a basic login feature using MongoDB, Mongoose, and EJS. The application is built with Express and can be easily run using Nodemon for development.

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd simple-website
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Set up MongoDB**:
   Ensure you have MongoDB installed and running. Update the connection string in `src/config.js` if necessary.
   A.K.A.
   ```
   const connect = mongoose.connect('YOUR CONNECTION STRING', {
    useNewUrlParser: true,
    useUnifiedTopology: true
   });
   ```

5. **Run the application**:
   ```
   npm run dev
   ```

6. **Access the application**:
   Open your browser and navigate to `http://localhost:3000` to view the home page. You can access the login page from there.
