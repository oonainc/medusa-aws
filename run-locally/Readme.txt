# Dependencies to run locally
# You would need Valkey:
docker run --name valkey-alpine -p 6379:6379 --restart=no -d valkey/valkey:8.1.3-alpine
# You would need Postgres:
Build and run the Dockerfile in alpine-postgres

# To build this app for docker:
docker build -t medusa-aws .

# To run this app with docker:
docker run -d -p 9000:9000 --name my-medusa-app --rm medusa-aws

# If testing within a docker container, and db is in another docker container, DATABASE_URL in .env should be
DATABASE_URL=postgres://myuser:mypassword@172.17.0.1/mydb?ssl_mode=disable
# If 172.17.0.1 doesn't work, like with some drivers, use host.docker.internal
# If not, it should just be
DATABASE_URL=postgres://myuser:mypassword@localhost/mydb?ssl_mode=disable
# To force ssl use like in RDS, append with ?sslmode=require (note ssl_mode and sslmode string differences)


npx patch-package package-name to patch a package using patch-package package


