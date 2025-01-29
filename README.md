# Simple Website with Login Feature

This project is a simple web application that implements a basic login feature using MongoDB, Mongoose, and EJS. The application is built with Express and can be easily run using Nodemon for development.

## Project Structure

```
simple-website
├── src
│   ├── app.js          # Entry point of the application
│   ├── views           # Contains EJS view templates
│   │   ├── index.ejs   # Home page
│   │   └── login.ejs   # Login page
│   └── public          # Static files
│       ├── css
│       │   └── styles.css  # CSS styles
│       └── js
│           └── scripts.js   # Client-side JavaScript
├── package.json       # npm configuration file
├── nodemon.json       # Nodemon configuration file
└── README.md          # Project documentation
```

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
   Ensure you have MongoDB installed and running. Update the connection string in `src/app.js` if necessary.

4. **Run the application**:
   ```
   npm run dev
   ```

5. **Access the application**:
   Open your browser and navigate to `http://localhost:3000` to view the home page. You can access the login page from there.

## Usage

- The home page provides links to the login page.
- The login page contains a form for users to enter their credentials.
- Upon successful login, users can be redirected to a welcome page or similar functionality can be implemented.

## License

This project is open-source and available under the MIT License.