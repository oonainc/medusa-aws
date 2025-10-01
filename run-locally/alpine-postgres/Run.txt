# If not previously built, run
docker build -t my-alpine-postgres .

# Then run
docker run -d -p 5432:5432 --name my-pg -v pgdata:/var/lib/postgresql/data my-alpine-postgres
