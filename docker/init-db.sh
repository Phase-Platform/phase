#!/bin/bash
set -e

# Wait for PostgreSQL to be ready
until pg_isready -U ${POSTGRES_USER:-postgres}; do
    echo "Waiting for PostgreSQL to be ready..."
    sleep 1
done

# Create application user and database
psql -v ON_ERROR_STOP=1 --username "${POSTGRES_USER:-postgres}" <<-EOSQL
    -- Create application user if not exists
    DO
    \$do\$
    BEGIN
        IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '${POSTGRES_USER:-phase_user}') THEN
            CREATE USER ${POSTGRES_USER:-phase_user} WITH PASSWORD '${POSTGRES_PASSWORD:-phase_password}';
        END IF;
    END
    \$do\$;

    -- Create application database if not exists
    SELECT 'CREATE DATABASE ${POSTGRES_DB:-phase_dev}'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${POSTGRES_DB:-phase_dev}')\gexec

    -- Grant privileges
    ALTER USER ${POSTGRES_USER:-phase_user} WITH SUPERUSER;
    GRANT ALL PRIVILEGES ON DATABASE ${POSTGRES_DB:-phase_dev} TO ${POSTGRES_USER:-phase_user};
EOSQL

# Run the initialization SQL script
psql -v ON_ERROR_STOP=1 --username "${POSTGRES_USER:-phase_user}" --dbname "${POSTGRES_DB:-phase_dev}" -f /docker-entrypoint-initdb.d/init-db.sql 