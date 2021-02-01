#!/bin/bash

echo "Starting..."
cd /home/localaa/dev/cliniclean4/
pm2 start "npm run serve -- --port 3000" --name Cliniclean4
cd /home/localaa/dev/clinicleanv3/
pm2 start "npm run serve" --name Cliniclean3
pm2 start "node /var/cliniclean/bin/websocket/server.js" --name Websocket
sudo service apache2 start
sudo service mysql start
echo "Done"
