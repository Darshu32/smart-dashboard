# Stage 1: Build the Vite app
FROM node:18-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the project
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
