# Taskr
Task management website project for CS2102

Quick Start
----
* You'll need to download and install the following:
  * [Windows Subsystem for Linux ](https://docs.microsoft.com/en-us/windows/wsl/install-win10) or an actual linux setup (macOS should work fine)
  * [PostgreSQL](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads) version 10.2, when setting up, make the password `kappa123`
  * Nodejs **v9.4.0** (on Linux)
  * DataGrip as a DBMS
  * Postman for REST api testing/development
  * *Optional: MobaXterm for your [linux subsystem](https://blog.mobatek.net/post/mobaxterm-new-release-9.0/)*
  * `git clone` this repo

Database Initialization
----
* In DataGrip, create a new database called `testdb`
* With the database `testdb` as the target, execute
```SQL
CREATE TABLE useraccount
(
  username VARCHAR(100) NOT NULL
    CONSTRAINT useraccount_pkey
    PRIMARY KEY,
  password VARCHAR(32)
);

CREATE UNIQUE INDEX upper_index
  ON useraccount (upper(username :: TEXT));
```

Starting the api server
----
* `cd api`
* `npm install`
* `nodejs app`

Starting the web server
----
* In a seperate terminal`cd web`
* `npm install`
* `npm start`
* Once both these are started, navigate to localhost:1234 and you should see the site
