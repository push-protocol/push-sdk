#! /bin/bash

who=$(whoami)
echo "Hey, $who!"

sleep 1

delnode=$(rm -rf node_modules/)
sleep 1
echo "Node Modules Deleted."

sleep 1

delnext=$(rm -rf .next/)
sleep 1
echo ".Next Deleted"

sleep 1

clean=$(yarn cache clean)
sleep 1
echo "Yarn Cache Cleaned."

sleep 1
install=`yarn`
sleep 1
echo $install


sleep 1
echo "See you soon, $who!"
