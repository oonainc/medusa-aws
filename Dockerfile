FROM node:22-alpine

# Install OpenSSL and CA certificates
RUN apk update && \
    apk add --no-cache openssl ca-certificates curl

# Download and install the Amazon RDS combined CA bundle (certificate) into the trusted store
# We need this to seamlessly connect to RDS via SSL
RUN mkdir -p /usr/local/share/ca-certificates && \
    curl -fsSL https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem \
    -o /usr/local/share/ca-certificates/rds-global-bundle.crt && \
    update-ca-certificates

# Ensure Node.js uses the system CA store
ENV NODE_OPTIONS=--use-openssl-ca

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies first for better docker npm caching
COPY package*.json ./
RUN npm i --omit=dev --legacy-peer-deps

# Copy remaining app source
COPY . .

# Build medusa app
RUN npx medusa build

COPY patches ./.medusa/server/patches/

WORKDIR .medusa/server

RUN npm i --omit=dev --legacy-peer-deps && \
#   npm run apply-patches

# Expose your development port (adjust as needed)
EXPOSE 80

# Start app with your dev script
CMD ["sh", "-c", "npm run start"]
