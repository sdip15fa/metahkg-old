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
echo "Please type in your password if prompted.";
sudo apt update;
sudo apt upgrade -y;
echo "checking mongodb installation...";
{
    mongod --version > /dev/null &&
    mongosh --version > /dev/null &&
    mongoimport --version > /dev/null &&
    echo "mongodb installed"
} || {
    echo "mongodb, mongosh, and/or mongodb database tools not installed. Installing...";
    sudo apt install wget gnupg -y;
    wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -;
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list;
    sudo apt update;
    sudo apt install mongodb-mongosh mongodb-database-tools -y;
    echo "mongosh and mongodb database tools installed.";
    {
      mongod --version > /dev/null &&
      echo "existing mongodb installation found. Not upgrading as corruption may be caused.";
    } || {
      sudo apt install mongodb-org-server -y;
    }
}
sudo mkdir -p /data/db;
sudo chmod -R 0777 /data/db;
echo "Install/upgrading nodejs to the latest LTS version...";
sudo apt install curl -y;
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -;
sudo apt update;
sudo apt install nodejs -y;
sudo corepack enable;
curl --compressed -o- -L https://yarnpkg.com/install.sh | bash;
echo "enabling mongodb autostart...";
sudo systemctl enable mongod || echo "systemctl not available. Using service.";
echo "starting mongodb...";
sudo systemctl start mongod || sudo service mongod start || mongod &
echo "installing dependencies...";
{
    yarn --version > /dev/null
} || {
    sudo corepack enable
};
yarn install;
echo "setting up mongodb...";
node mongo-setup.js;
{
  test -f .env &&
  echo ".env found. Not copying templates/template.env to .env"
} || {
  echo "Copying templates/template.env to .env...";
  cp templates/template.env .env;
}
echo "Setup complete. Please configure your environmental variables using a .env file. Reference templates/template.env for details.";
echo "Run 'yarn run deploy' to deploy the app.";