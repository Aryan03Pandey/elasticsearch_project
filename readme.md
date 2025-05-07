# Simple E-commerce Search Project

This project demonstrates a basic e-commerce product search functionality using Elasticsearch, a PostgreSQL database, an Express.js backend, and Docker Compose for environment setup.

## Project Description

This is a simple e-commerce backend project designed for learning purposes. It focuses on implementing efficient full-text search for product details (title, description, features) using Elasticsearch. Product data is stored in a traditional PostgreSQL database, and the backend service, built with Express.js, exposes a search API endpoint that queries Elasticsearch. Docker Compose is used to easily set up the local database and Elasticsearch instances.

The project consists of:

1.  **PostgreSQL Database:** Stores the canonical product data.
2.  **Elasticsearch:** Indexes product data for fast and relevant search.
3.  **Express.js Backend:**
    * Connects to PostgreSQL and Elasticsearch.
    * Provides a search API endpoint that interfaces with Elasticsearch.
    * (Note: This project *does not* include full CRUD for products; it focuses solely on the search implementation and necessary data setup).
4.  **Docker Compose:** Orchestrates the PostgreSQL and Elasticsearch containers for a consistent development environment.

## Technologies Used

* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL
* **Search Engine:** Elasticsearch
* **Containerization:** Docker, Docker Compose
* **Database Client:** `pg`
* **Elasticsearch Client:** `@elastic/elasticsearch`
* **Environment Variables:** `dotenv`

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

* [Docker](https://www.docker.com/get-started)
* [Docker Compose](https://docs.docker.com/compose/install/)
* [Node.js](https://nodejs.org/) (LTS version recommended)
* [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

## Installation Steps:
1. * Clone the repo and npm install in server directory
2. * Setup docker containers - docker-compose up -d in the root file (where docker-compose.yml) file resides
3. * Add sample data to database - docker exec -it ecommerce_db psql -U user ecommerce

```

-- Connect to your database 'ecommerce' with user 'user'
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    features JSONB -- Store features as JSON, e.g., {"color": "red", "size": "M"}
);

-- Add some sample data (Example Data Insertion into Database)
INSERT INTO products (title, description, features) VALUES
('Laptop Pro 15', 'Powerful laptop with high-resolution display and fast processor.', '{"screen_size": "15 inch", "cpu": "Intel i7", "ram": "16GB"}'),
('Wireless Mouse', 'Ergonomic wireless mouse with long battery life.', '{"color": "black", "connectivity": "wireless", "buttons": 5}'),
('Mechanical Keyboard', 'Clicky mechanical keyboard with RGB lighting.', '{"color": "white", "switch_type": "blue", "backlight": "RGB"}'),
('USB-C Hub', 'Multi-port USB-C hub with HDMI, USB-A, and SD card reader.', '{"ports": 5, "connectivity": "USB-C"}'),
('Gaming Headset', 'High-fidelity gaming headset with noise cancellation.', '{"color": "red", "connectivity": "wired", "mic": "yes"}');

```

4. * Index data into ElasticSearch - node server/scripts/create_and_index.js
5. * Run the server - nodemon server.js

## Sample Query
* Sample Query - use curl or paste into browser - http://localhost:4000/api/search?q=laptop

## Future Improvements
1. Implement data synchronization (dual writes, CDC) to keep Elasticsearch updated when products are added, updated, or deleted in PostgreSQL.
2. Add pagination to the search results.
3. Implement filtering (e.g., by price range, category, specific feature values) using Elasticsearch aggregations and filters.
4. Improve search query logic (e.g., fuzzy search tuning, synonyms, more complex query types).
5. Add input validation and better error handling.
6. Configure security for Elasticsearch (X-Pack security).
7. Add user authentication and authorization.


**Note for Linux Users:** Elasticsearch requires a specific kernel setting (`vm.max_map_count`). You might need to run this command on your *host machine* (not inside a container) before starting the containers:
```bash
sudo sysctl -w vm.max_map_count=262144

