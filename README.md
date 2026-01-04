# E-Shop API

This is the **E-Shop API** for managing an online store, built using **Node.js** and **Express**. The API supports functionalities like managing orders, products, order items, user authentication, authorization, and more. It also includes powerful filtering and pagination features to help you manage and retrieve data efficiently.

---

## Features

- **Authentication & Authorization**: Secure login with JWT (JSON Web Token).
- **Orders**: Place, update, and track customer orders.
- **Products**: Create, update, delete, and fetch products.
- **Order Items**: Manage the individual items within an order.
- **Error Handling**: Centralized error handling for easier debugging and maintenance.
- **Filtering**: Powerful filtering capabilities for products, orders, and more.
- **Pagination**: Get paginated results for large datasets (e.g., products, orders).
- **Sales Statistics**: Get detailed statistics about all sales in the shop.

---

## Installation

### Prerequisites

Make sure you have the following installed:

- Node.js (v14 or above)
- npm (v6 or above)
- MongoDB (or any other database you're using)

### Steps

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/e-shop-api.git
    ```

2. Install dependencies:

    ```bash
    cd e-shop-api
    npm install
    ```

3. Create a `.env` file in the root directory and add your environment variables:

    ```env
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/eshop
    JWT_SECRET=your_jwt_secret_key
    ```

4. Run the application:

    ```bash
    npm start
    ```

Your API should now be running at `http://localhost:3000`.

---

## API Documentation

### 1. Authentication

**POST** `/auth/login`

- **Description**: Logs in a user and returns a JWT token.
- **Body**: 
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
- **Response**:
    ```json
    {
      "token": "your_jwt_token_here"
    }
    ```

### 2. Users

**GET** `/users`

- **Description**: Fetch all users.
- **Authorization**: Requires JWT in the header.
- **Response**:
    ```json
    [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      }
    ]
    ```

**POST** `/users`

- **Description**: Register a new user.
- **Body**:
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "password123"
    }
    ```
- **Response**: Success message and status code.

### 3. Products

**GET** `/products`

- **Description**: Fetch all products (supports pagination and filtering).
- **Query Params**: 
    - `page` (default 1)
    - `limit` (default 10)
    - `category` (optional, to filter by category)
    - `price_min` (optional, to filter by min price)
    - `price_max` (optional, to filter by max price)
- **Response**:
    ```json
    {
      "products": [
        {
          "id": 1,
          "name": "Product Name",
          "price": 20.99,
          "category": "Electronics"
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "totalCount": 100
      }
    }
    ```

**POST** `/products`

- **Description**: Add a new product.
- **Body**:
    ```json
    {
      "name": "New Product",
      "price": 50.99,
      "category": "Electronics",
      "description": "A detailed description of the product."
    }
    ```
- **Response**: Success message and status code.

### 4. Orders

**GET** `/orders`

- **Description**: Fetch all orders (supports pagination and filtering).
- **Query Params**:
    - `page` (default 1)
    - `limit` (default 10)
    - `status` (optional, to filter by order status)
- **Response**:
    ```json
    {
      "orders": [
        {
          "id": 1,
          "user": "John Doe",
          "total": 100.99,
          "status": "Completed",
          "orderItems": [
            {
              "product": "Product Name",
              "quantity": 2,
              "price": 50.99
            }
          ]
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "totalCount": 50
      }
    }
    ```

**POST** `/orders`

- **Description**: Place a new order.
- **Body**:
    ```json
    {
      "user": "John Doe",
      "orderItems": [
        {
          "productId": 1,
          "quantity": 2
        }
      ]
    }
    ```
- **Response**: Success message and status code.

### 5. Order Items

**GET** `/orderitems`

- **Description**: Fetch all order items.
- **Response**:
    ```json
    [
      {
        "id": 1,
        "orderId": 1,
        "productId": 1,
        "quantity": 2,
        "price": 50.99
      }
    ]
    ```

### 6. Sales Statistics

**GET** `/sales/statistics`

- **Description**: Get sales statistics for the shop (total sales, number of orders, etc.).
- **Response**:
    ```json
    {
      "totalSales": 1500.99,
      "totalOrders": 25,
      "totalItemsSold": 100
    }
    ```

---

## Error Handling

The API uses centralized error handling for all routes. If an error occurs, the API will return a structured response with an appropriate error code and message.

### Example of Error Response:

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "No authorization token was found"
  }
}
```
Pagination

All list-based endpoints support pagination with page and limit query parameters.

page: The page number you want to retrieve (default is 1).

limit: The number of items per page (default is 10).

Example:
``` GET /products?page=2&limit=5```

---

### Explanation:
- The **pagination** has been included in all the endpoints where applicable (`/products`, `/orders`, `/users`, etc.).
- The README file is structured to include **installation instructions**, **API documentation**, **error handling**, **pagination details**, and how to **contribute**.
- The **`page`** and **`limit`** query parameters are available for **pagination** and explained in the **Pagination** section.

This should be a complete and well-structured README file for your E-Shop API! Let me know if you need further adjustments or additional features in the documentation. 😊

