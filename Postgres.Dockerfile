FROM postgres:alpine

COPY ./sql/databases.sql /docker-entrypoint-initdb.d/1.databases.sql
COPY ./AccountService/sql/schema.sql /docker-entrypoint-initdb.d/2.schema.sql
COPY ./AccountService/sql/data.sql /docker-entrypoint-initdb.d/3.data.sql
COPY ./ProductService/sql/schema.sql /docker-entrypoint-initdb.d/4.schema.sql
COPY ./ProductService/sql/data.sql /docker-entrypoint-initdb.d/5.data.sql
COPY ./OrderService/sql/schema.sql /docker-entrypoint-initdb.d/6.schema.sql
COPY ./OrderService/sql/data.sql /docker-entrypoint-initdb.d/7.data.sql
COPY ./KeyService/sql/schema.sql /docker-entrypoint-initdb.d/8.schema.sql
COPY ./KeyService/sql/data.sql /docker-entrypoint-initdb.d/9.data.sql