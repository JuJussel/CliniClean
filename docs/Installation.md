---
title: Installation
has_children: true
nav_order: 2
---

# Installation

No content here yet

//////////////////////////////////////////////
ORCA CONFIG
// Allow DB connections

sudo vi /etc/postgsql/10/main/postgresql.conf
change listen_addresses = '*' //Uncomment

vi pg_hba.conf (Same directory as above)
edit:
local  all      postgres          trust //Temporary

add at end:
host    all             all              0.0.0.0/0                       md5
host    all             all              ::/0                            md5

sudo service postgresql restart

connect to psql locally
psql -U postgres

create user ccapi with password 'DE73khYe2'
\c orca
grant usage on schema master to ccapi
grant usage on schema public to ccapi
GRANT SELECT ON ALL TABLES IN SCHEMA public TO ccapi;
GRANT SELECT ON ALL TABLES IN SCHEMA master TO ccapi;
\q

change postgress back to peer
local  all      postgres          peer

/etc/postgsql/10/main/postgresql.conf
