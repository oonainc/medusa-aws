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
RUN npx medusa user -e "admin@luxurystore.com" -p "Asdf123$"
RUN npm run seed

# TODO start our angular ssr project
# TODO run tests

# Start app with your dev script
