#!/bin/bash
#
gnome-terminal -x bash -c "

npx sequelize migration:create --name=create-users;
npx sequelize migration:create --name=create-comments;

exec bash
"
