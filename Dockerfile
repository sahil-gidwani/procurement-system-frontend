# Use an official Node.js runtime as a parent image
FROM node:18

# Set environment variables
ENV API_ENDPOINT ${API_ENDPOINT}

# Set work directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
