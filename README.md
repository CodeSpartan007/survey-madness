# 📊 Survey Madness

**Survey Madness** is a full-stack web application designed for creating and managing surveys. Users can create custom surveys, distribute them, and analyze responses in real-time. This project showcases the use of the MERN stack (MongoDB, Express.js, React, Node.js) with additional libraries for enhanced functionality and UI.

![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green?logo=mongodb) ![Express.js](https://img.shields.io/badge/Express.js-4.18.2-lightgrey?logo=express) ![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react) ![Node.js](https://img.shields.io/badge/Node.js-20.6.1-green?logo=node.js) ![Commits](https://img.shields.io/github/commit-activity/m/CodeSpartan007/survey-madness)

## 🚀 Features

* **Create and Manage Surveys**: Design custom surveys with various question types.
* **Share Surveys**: Generate unique links to distribute surveys.
* **View Responses**: Analyze real-time survey responses with visualizations.
* **User Authentication**: Secure login and user management with JWT.
* **Backend API**: RESTful API endpoints for all core functionalities.

## 🛠️ Technologies Used

* [MongoDB](https://www.mongodb.com/)
* [Express.js](https://expressjs.com/)
* [React](https://reactjs.org/)
* [Node.js](https://nodejs.org/)
* [Mongoose](https://mongoosejs.com/)
* [JWT](https://jwt.io/) for authentication
* [Axios](https://axios-http.com/) for HTTP requests
* [Tailwind CSS](https://tailwindcss.com/) for UI styling

## 📦 Getting Started

### Prerequisites

Make sure you have the following installed:

* [Node.js](https://nodejs.org/) (v14 or later)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
* [MongoDB](https://www.mongodb.com/) running locally or via Atlas

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/CodeSpartan007/survey-madness.git
   cd survey-madness
   ```

2. **Install dependencies**:

   Using npm:

   ```bash
   npm install
   ```

   Or using yarn:

   ```bash
   yarn install
   ```

3. **Configure environment variables**:

   Create a `.env` file in the root directory and add the following:

   ```bash
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. **Run the development server**:

   ```bash
   npm run dev
   ```

5. **Access the application**:

   * Frontend: [http://localhost:3000](http://localhost:3000)
   * Backend API: [http://localhost:5000/api](http://localhost:5000/api)

## 📁 Project Structure

```
survey-madness/
├── client/              # React frontend
├── server/              # Express.js backend
├── .env                 # Environment variables
├── package.json         # Project metadata and scripts
├── README.md            # Project documentation
└── ...                  # Other configuration files
```

## 🧾 Scripts

* `dev`: Run both client and server in development mode.
* `client`: Start the React frontend.
* `server`: Start the Express backend.
* `build`: Build the React frontend for production.

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Commit your changes: `git commit -m 'Add your feature'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Open a pull request.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
