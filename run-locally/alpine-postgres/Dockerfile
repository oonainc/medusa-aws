FROM alpine:3.22.0

# install postgress et al
RUN apk add --no-cache \
    postgresql \
    postgresql-contrib \
    bash

USER root

RUN mkdir -p /var/lib/postgresql/data /run/postgresql \
		&& chown -R postgres:postgres /var/lib/postgresql /run/postgresql \
		&& chmod 700 /var/lib/postgresql/data

# by installing postgres, a linux user called postgres is also created
USER postgres

# our data directory
ENV PGDATA=/var/lib/postgresql/data

# initialize the data directory
RUN initdb -D "$PGDATA" --encoding=UTF8 --locale=en_US.UTF-8
# configuration so that we can connect from outside the docker container
RUN echo "listen_addresses = '*'" >> "$PGDATA"/postgresql.conf \
        && echo "host all all 0.0.0.0/0 md5" >> "$PGDATA"/pg_hba.conf

# POSTGRES_USER, POSTGRES_PSWD, POSTGRES_DB are special to the default entryfile and are used for init
ENV POSTGRES_USER=myuser
ENV POSTGRES_PSWD=mypassword
ENV POSTGRES_DB=mydb

# create our first user, give it CREATEDB and CREATEROLE priviledges
RUN echo "CREATE USER \"$POSTGRES_USER\" WITH PASSWORD '$POSTGRES_PSWD';" \
    | postgres --single -D "$PGDATA" -E postgres
RUN echo "ALTER ROLE \"$POSTGRES_USER\" WITH CREATEDB CREATEROLE LOGIN;" \
  | postgres --single -D "$PGDATA" -E postgres

# create our db
RUN echo "CREATE DATABASE \"$POSTGRES_DB\" OWNER \"$POSTGRES_USER\";" \
    | postgres --single -D "$PGDATA" -E postgres

# for docker port mapping
EXPOSE 5432

# we want to use our data directory
CMD ["postgres", "-D", "/var/lib/postgresql/data"]
