FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build Vite app
RUN npm run build

# Install static server
RUN npm install -g serve

EXPOSE 3000

# Serve Vite output
CMD ["serve", "-s", "dist", "-l", "3000"]