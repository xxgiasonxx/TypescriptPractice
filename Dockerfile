FROM node:20.14

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install dependencies
COPY ["package.json", "package-lock.json", "tsconfig.json", ".env", "./"]

# Copy the rest of the application code to the working directory
COPY ./src ./src

# Build the TypeScript code
RUN npm install

# Expose a port (if needed)
EXPOSE 3000

# Start the application
CMD npm run build && npm run start