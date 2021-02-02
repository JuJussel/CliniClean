# ClinicCean v4.1

sudo -i

apt-get update && apt-get upgrade

apt-get install apache2 apache2ctl configtest a2enmod rewrite a2enmod headers

apt-get install php php-cli php-common php-curl php-gd php-json php-mbstring php-mysql php-opcache php-pgsql php-readline php-xml php-zip

vi /etc/apache2/apache2.conf Add at end:

Header set Access-Control-Allow-Credentials true Header set Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept" Header set Access-Control-Allow-Methods: "POST, PUT, GET, DELET, OPTIONS" SetEnvIf Origin "http(s)?://(www\.)?(localhost:8080|192.168.1.89:8080|172.17.252.48:8080|172.17.252.48:3000|localhost:3000|172.24.81.193:8080)$" AccessControlAllowOrigin=$0 Header add Access-Control-Allow-Origin %{AccessControlAllowOrigin}e env=AccessControlAllowOrigin Header merge Vary Origin
    AllowOverride All
    Require all granted
edit /etc/apache2/sites-enabled/000-default.conf Comment out 80 host Add at bottom:

<VirtualHost *:443> DocumentRoot /var/cliniclean/public ServerName HOSTMANE eg. cliniclean.kurosuhealth.com SSLEngine on SSLCertificateFile /var/cliniclean/ssl/cert.pem SSLCertificateKeyFile /var/cliniclean/ssl/key.pem

sudo a2enmod headers sudo a2enmod rewrite sudo a2enmod ssl

INSTALL CLINICLEAN to /var/cliniclean ???

sudo chown -R www-data:www-data /var/cliniclean/storage

sudo service apache2 start

.... install node node server.js

////////////////////////////////////////////// ORCA CONFIG // Allow DB connections edit postgresql.conf $ find / -name "postgresql.conf" /etc/postgsql/10/main/postgresql.conf vi find / -name "postgresql.conf"

change listen_addresses = '*' //Uncomment

vi pg_hba.conf (Same directory as above) edit: local all postgres trust //Temporary

add at end: host all all 0.0.0.0/0 md5 host all all ::/0 md5

connect to psql locally psql -U postgres

create user ccapi with password 'DE73khYe2' \c orca grant usage on schema master to ccapi grant usage on schema public to ccapi

change postgress back to peer local all postgres peer

///////////// ORCA custom koui

Kenkoushindan: Koui Code: 095110001
Wnat to turn on logging for SQL both Orca and CC?

Below for postgresql https://tableplus.com/blog/2018/10/how-to-show-queries-log-in-postgresql.html

First, you have to enable logging all queries in PostgreSQL.
Please note that only those queries that are executed can be logged.

To do that, you have to config the PostgreSQL configuration file postgresql.conf.

On Debian-based systems it’s located in /etc/postgresql/9.3/main/ (replace 9.3 with your version of PostgreSQL) On Red Hat-based systems in /var/lib/pgsql/data/.

log_statement = 'all' log_directory = '/path/to/dir' log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log' logging_collector = on log_min_error_statement = error

Then restart the server sudo service postgresql restart

# Ignore below

# cliniclean
 ClinicCean v4.1

sudo -i

apt-get update && apt-get upgrade

apt-get install apache2
apache2ctl configtest
a2enmod rewrite
a2enmod headers

apt-get install php php-cli php-common php-curl php-gd php-json php-mbstring php-mysql php-opcache php-pgsql php-readline php-xml php-zip

vi /etc/apache2/apache2.conf
Add at end:

<Directory />
    	Header set Access-Control-Allow-Credentials true
    	Header set Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept"

	SetEnvIf Origin "http(s)?://(www\.)?(NETWORK1:PORT|NETWORK2:PORT|NETWORK3)$" AccessControlAllowOrigin=$0
        Header add Access-Control-Allow-Origin %{AccessControlAllowOrigin}e env=AccessControlAllowOrigin
        Header merge Vary Origin

    	AllowOverride All
    	Require all denied
</Directory>

edit /etc/apache2/sites-enabled/000-default.conf
Comment out 80 host
Add at bottom:

<VirtualHost *:443>
    DocumentRoot /var/cliniclean/public
    ServerName HOSTMANE eg. cliniclean.kurosuhealth.com
    SSLEngine on
    SSLCertificateFile	/var/cliniclean/ssl/cert.pem
    SSLCertificateKeyFile /var/cliniclean/ssl/key.pem
</VirtualHost> 


sudo a2enmod headers
sudo a2enmod rewrite
sudo a2enmod ssl

INSTALL CLINICLEAN to /var/cliniclean ???

sudo chown -R www-data:www-data /var/cliniclean/storage

sudo service apache2 start

.... install node
node server.js


//////////////////////////////////////////////
ORCA CONFIG
// Allow DB connections
edit postgresql.conf
$ find / -name "postgresql.conf"
/etc/postgsql/10/main/postgresql.conf
vi find / -name "postgresql.conf"

change listen_addresses = '*' //Uncomment

vi pg_hba.conf (Same directory as above)
edit:
local  all      postgres          trust //Temporary

add at end:
host    all             all              0.0.0.0/0                       md5
host    all             all              ::/0                            md5

connect to psql locally
psql -U postgres

create user ccapi with password 'DE73khYe2'
\c orca
grant usage on schema master to ccapi
grant usage on schema public to ccapi

change postgress back to peer
local  all      postgres          peer

/////////////
ORCA custom koui

- Kenkoushindan: Koui Code: 095110001
