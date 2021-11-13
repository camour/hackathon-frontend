Purpose: 
This repository is part of the hackathon project and implements the User Web application that interacts with the OMEM2M platform (Infrastructure Node)
This repository launches the frontend part, that is a "e-monitoring" web application
The goal of this frontend part is to display on the navigator patients'health datas (temperature and acceleration).

We highly recommend to use Windows 10 !

-----------------------------------------------------------------------------------------

Project installation : 

- install Node JS on this link: https://nodejs.org/en/download/
- open a terminal and run the following line command : "git clone https://github.com/camour/hackathon-frontend.git"
- once you cloned the repo, go under "hackathon-frontend" using "cd" line command: cd hackathon-frontend
- run the following line command to install all the Node dependencies required for the project :  npm install
- if the terminal prompts any question about installing a module, press "Y"
- to display this web app, you also need to install the google chrome navigator
- install google chrome. Right after you have to set "chrome" in your path environments variables so we can use "chrome" line command in a terminal

-----------------------------------------------------------------------------------------

Project configuration :
Let's keep in mind we have 4 nodes for the whole hackathon project: Sensors, Gateway (Middle Node), Infrastructure Node, User Web application
- the user web app only communicates with the Infrastructure Node
- if you do not mind to run both the user web application and the Infrastructure Node on your local machine, then skip this part and go to "Project launch"
- in case you would like your user web application and your Infrastructure Node to not run on the same machine, then you have to change the IP address of the server node (Infrastructure Node). 
- to do so, on your local machine,  open the "tools.js" file of this repo that you just cloned, and edit the first line that is : const SERVER_NODE = "http://localhost:3000/" 
- replace the url "http://localhost:3000" by the url where your Infrasture Node will be running at

----------------------------------------------------------------------------------------

Project launch :
- before launching this web application, make sure the IN-CSE software AND the Node JS server are already running (the whole Infrastructure Node more generally)
- on a terminal, under the "hackathon-frontend" repository, run the following line command : npm start
- congrats ! now you have launched a local server that serves the frontend web application page that will accessible from Chrome
- open a Chrome page and type in the URL bar the following : 'http://localhost:80'. You should see a login page. 
- on the top of this page, a little message will pop asking your permission for notifications, click on "allow" or "grant" or "authorize" otherwise, you will not get to see patients'data

