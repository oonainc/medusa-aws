FROM node:22-alpine

# Install OpenSSL and CA certificates
RUN apk update && \
    apk add --no-cache openssl ca-certificates curl

# Download and install the Amazon RDS combined CA bundle into the trusted store
# We need this to seamlessly connect to RDS via SSL
RUN mkdir -p /usr/local/share/ca-certificates && \
    curl -fsSL https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem \
    -o /usr/local/share/ca-certificates/rds-global-bundle.crt && \
    update-ca-certificates

# Ensure Node.js uses the system CA store
ENV NODE_OPTIONS=--use-openssl-ca

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies first for better docker caching
COPY package*.json ./
RUN npm ci --omit=dev

# Copy app source
COPY . .

# Build medusa app
RUN npx medusa build

COPY patches .medusa/server/
WORKDIR .medusa/server

RUN npm ci --omit=dev
RUN npm run postinstall
RUN rm -rf ../../node_modules
# RUN npm run predeploy

# Expose your development port (adjust as needed)
EXPOSE 80

# Start app with your dev script
CMD ["sh", "-c", "npm run start"]
