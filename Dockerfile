FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
ENV NODE_ENV=production
CMD ["sh", "-c", "npx next start --hostname 0.0.0.0 --port ${PORT:-3000}"]
