# If not previously built, run
docker build -t my-alpine-postgres .

# Then run
docker run -d -p 5432:5432 --name my-pg -v pgdata:/var/lib/postgresql/data my-alpine-postgres

# If you want the container to always startup unless explictly stopped
docker run -d -p 5432:5432 --name my-pg --restart=unless-stopped -v pgdata:/var/lib/postgresql/data my-alpine-postgres

# If building a new docker image, remember to remove the old persisted data if you want to
sudo rm -rf /var/lib/postgresql/data
