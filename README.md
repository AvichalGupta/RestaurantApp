# Restaurant Listing and Review Application with Role Based Authentication

Welcome to our Restaurant Listing and Review Application with Role Based Authentication (RBA). This README will provide a walkthrough for the functionalities and usage of tnis application.

## Introduction

The application provides users with the ability to browse restaurant listings and reviews, as well as perform CRUD (Create, Read, Update, Delete) operations on both restaurant listings and reviews. The Role Based Authentication ensures secure access to different functionalities based on user roles.

## Login Flow

To access the application's features, users need to follow the login flow:

1. **Signup**: The signup API should be called first with an email and a password of choice (minimum 8 characters).
2. **Login**: Once signed up, users need to call the login API with the same email and password used during registration. Upon successful authentication, a token will be generated and provided in the API response. This token must be used for subsequent API calls to access protected routes.

## Restaurant Listing Flow

Users with adequate permissions can perform CRUD operations on restaurant listings. Each API endpoint has been documented on Postman with examples for easy reference.

## Reviews Flow

Users with adequate permissions can perform CRUD operations on restaurant listings. Each API endpoint has been documented on Postman with examples for easy reference.

## Usage

1. **Signup and Login**:
   - Use the signup API to register with your email and password.
   - After registration, login with the same credentials to obtain an authentication token.

2. **Restaurant Listings**:
   - Use CRUD APIs to manage restaurant listings.
   - Refer to the Postman documentation for API endpoints and examples.

3. **Reviews**:
   - Use CRUD APIs to manage restaurant reviews.
   - Refer to the Postman documentation for API endpoints and examples.

## Postman Documentation

We have provided detailed documentation on Postman for all API endpoints, including examples of requests and responses. Please refer to our Postman collection for a comprehensive understanding of how to interact with our application.

## Steps to run this repo

Firstly, clone this repo using git clone command.
Next run the npm install command to install all dependencies.
Finally run the command to start the application: npm run start:dev

The application runs on port 3000 by default. 
Use the sample env file attached to create your own .env file.

Thanks!
