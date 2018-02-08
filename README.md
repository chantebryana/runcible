# runcible

## WELCOME

Welcome to runcible, home of the Moon web app! Moon allows users to enter, edit, and analyze daily body temperature data as related to their monthly cycle.

## PREREQUISITES

Moon requires a working Node.js development platform. Moon was developed using Node.js version 6.11.4 (and deployed on 9.3.0), npm version 3.5.2 (and deployed on 5.5.1), and SQLite version 3.19.3 (and deployed on 3.11.0). 

To set up needed infrastructure from a blank-slate Ubuntu machine, run the following commands: 

```
sudo apt-get update
sudo apt-get install curl
curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install sqlite3 libsqlite3-dev
sudo apt-get install git
```

## INSTALLATION

To clone a copy of this git repository, run this bash command:

```
git clone https://github.com/chantebryana/runcible.git
```

You will also needed a database to support the back-end of this web app. I'm in the process of migrating database management tools into this repository. In the meantime, download a copy of the most recent database file found in this repository to get you started. Via your terminal, navigate to your project's directory, then type the following: 

```
wget https://github.com/chantebryana/runcible/raw/0ddd3a36cbc4f6017bd60b19f6c05b13ca4ee7d4/fam_beta.db
```

Installing npm dependencies will round out the installation process. Again in your terminal, type

```
npm install
```

which should access the file `package.json` to seek out dependencies and automatically download them. 

## RUN THE APP

Through an historical accident of file structure, this is how to start the project: In the terminal, navigate to your project's directory. Type this line: 

```
node routes/index.js
```

Close down the app by typing `Ctrl + C`

## EXPLORE THE APP
On the same machine, while the app is running, open a web browser and navigate to

```
https://localhost:3000
```

Login to the site with the following credentials (which are already generated and saved into the database file you downloaded earlier)

```
hashname
hashword
```

## ORGANIZATIONAL NOTES

Moon files are organized in the following directories: 

* docs: notes related to development
* public: templates for CSS, JavaScript symlinks, favicon
* routes: routing hub for the node.js server
* views: home of EJS and page files
* zzSandbox: side explorations, which can effectively be ignored unless you want to explore the history of development

## POSTSCRIPT

Feel free to shoot me any questions, and remember, this is a work in progress. And thanks for navigating my repository and web app. 