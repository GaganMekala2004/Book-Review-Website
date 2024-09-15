# Book Review App

This is a simple book review app built with Node.js, Express, and PostgreSQL. Users can add, edit, delete, and search for book reviews.

## Features

- Add new book reviews
- Edit existing book reviews
- Delete book reviews
- Search for book reviews
- Sort book reviews by title, author, or rating

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL

### Installation

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

### Configuration

1. **Database Setup**:

   Ensure you have PostgreSQL installed and running. Create a database named `book` and a table named `books` with appropriate columns.

2. **Environment Variables**:

   Create a `.env` file in the root directory with the following content:

    ```env
    DATABASE_URL=postgres://username:password@localhost:5432/book
    ```

   Replace `username`, `password`, and `localhost` with your PostgreSQL credentials.

### Usage

1. **Start the Server**:

    ```bash
    npm start
    ```

   The server will run on `http://localhost:3000`.

2. **Development**:

   For development with auto-reloading:

    ```bash
    npm run dev
    ```

### Dependencies

- **express**: Fast, unopinionated, minimalist web framework for Node.js.
- **ejs**: Embedded JavaScript templating.
- **axios**: Promise-based HTTP client for the browser and Node.js.
- **pg**: PostgreSQL client for Node.js.
- **body-parser**: Node.js body parsing middleware.
- **nodemon**: Utility that monitors for any changes in your source and automatically restarts your server.

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Acknowledgements

- Icons by [Font Awesome](https://fontawesome.com)
- Colors and design inspirations from various sources
