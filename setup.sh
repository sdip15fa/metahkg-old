#!/bin/bash
echo "This script is for ubuntu 20.04 or above only. If you are not using debian based systems DO NOT use this script.";
echo "This set up uses the local mongodb by default. Please set DB_URI=<connection string> in .env if you are not deploying mongodb locally or you have set a password.";
read -p "ok? (y/n) " reply;
if [ $reply != "y" ]
then
  unset reply;
  echo "exiting..."
  exit 0
fi
unset reply;
echo "checking mongodb installation...";
{
    mongod --version > /dev/null &&
    mongosh --version > /dev/null &&
    mongoimport --version > /dev/null &&
    echo "mongodb installed"
} || {
    read -p "mongodb, mongosh, and/or mongodb database tools not installed. Do you wish to install them? (y/n) " reply;
    if [ $reply = "y" ]
    then
      unset reply;
      echo "Please type in your password if prompted.";
      sudo echo "deb [arch=amd64,arm64] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" > /etc/apt/sources.list.d/mongodb-org-5.0.list;
      sudo apt update;
      sudo apt install mongodb-org-server mongodb-mongosh mongodb-database-tools -y;
      echo "mongodb and mongosh installed.";
    else
      {mongod --version > /dev/null && mongoimport --version > /dev/null} || {
        "mongodb and/or mongodb database tools not installed. Aborting...";
        exit 1;
      }
    fi
    unset reply;
}
read -p "Install/upgrade nodejs to the latest LTS version? (y/n) " reply;
if [ reply = "y" ]
then 
  unset reply;
  sudo apt insall curl -y;
  curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -;
  sudo apt update;
  sudo apt install nodejs;
else
  unset reply;
  {
    node --version > /dev/null
  } || {
    echo "Nodejs is not installed. Aborting..."
    exit 1;
  }
fi
unset reply;
echo "enabling mongodb autostart...";
sudo systemctl enable mongod;
echo "starting mongodb...";
sudo systemctl start mongod;
echo "installing dependencies...";
{
    yarn --version > /dev/null
} || {
    sudo corepack enable
};
yarn install;
node mongo-setup.js;
read -p "Copy templates/template.env to .env? (y/n) " reply;
if [ reply = "y" ]
then
  cp templates/template.env .env;
fi
echo "Setup complete. Please configure your environmental variables using a .env file. Reference templates/template.env for details.";
echo "Run 'yarn run deploy' to deploy the app.";