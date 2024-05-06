FROM postgres:alpine

COPY ./sql/databases.sql /docker-entrypoint-initdb.d/1.databases.sql
COPY ./AuthService/sql/schema.sql /docker-entrypoint-initdb.d/2.schema.sql
COPY ./AuthService/sql/data.sql /docker-entrypoint-initdb.d/3.data.sql
COPY ./ProductService/sql/schema.sql /docker-entrypoint-initdb.d/4.schema.sql
COPY ./ProductService/sql/data.sql /docker-entrypoint-initdb.d/5.data.sql
COPY ./OrderService/sql/schema.sql /docker-entrypoint-initdb.d/6.schema.sql
COPY ./OrderService/sql/data.sql /docker-entrypoint-initdb.d/7.data.sql