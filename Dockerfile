FROM node:22-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy app source
COPY . .

# Expose your development port (adjust as needed)
EXPOSE 9000

RUN npx medusa db:migrate
RUN npx medusa user -e akanrinna@gmail.com -p Asdf123$

# Start app with your dev script
CMD ["npm", "run", "dev"]
