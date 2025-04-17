# Node.js Web Application with PostgreSQL

This project is a Node.js web application that connects to a PostgreSQL database to display activities from the "actividades" table in the "EVENTO_F1" database. The application allows users to filter activities by the current week.

## Project Structure

```
nodejs-web-app
├── public
│   ├── index.html        # HTML structure of the web application
│   ├── styles.css       # CSS styles for the web application
│   └── script.js        # Client-side JavaScript logic
├── src
│   ├── server.js        # Entry point of the Node.js application
│   └── db
│       └── connection.js # Database connection setup
├── package.json          # npm configuration file
├── .env                  # Environment variables for database connection
└── README.md             # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd nodejs-web-app
   ```

2. **Install dependencies:**
   Make sure you have Node.js and npm installed. Run the following command to install the required packages:
   ```
   npm install
   ```

3. **Configure the database connection:**
   Create a `.env` file in the root directory and add your PostgreSQL database credentials:
   ```
   DB_NAME=your_database_name
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_HOST=your_database_host
   DB_PORT=your_database_port
   ```

4. **Start the server:**
   Run the following command to start the Node.js server:
   ```
   npm start
   ```

5. **Access the application:**
   Open your web browser and navigate to `http://localhost:3000` to view the application.

## Usage

- The application displays a dropdown selector for filtering activities by the current week.
- The activities from the "actividades" table are displayed, showing the columns: actividad, responsable, stopper, and indicador.
- Users can select a week from the dropdown to filter the displayed activities accordingly.

## Dependencies

- Express: A web framework for Node.js.
- pg: PostgreSQL client for Node.js.

## License

This project is licensed under the MIT License.