#!/bin/bash

echo "Starting..."
cd /home/localaa/dev/cliniclean/developement/frontend
pm2 start "npm run serve -- --port 3000" --name Cliniclean4
cd /home/localaa/dev/clinicleanv3/
pm2 start "npm run serve" --name Cliniclean3
//pm2 start "node /home/localaa/dev/cliniclean/developement/backend/websocket/server.js" --name Websocket
sudo service apache2 start
sudo service mysql start
echo "Done"

