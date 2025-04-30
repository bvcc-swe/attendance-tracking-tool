# attendance-tracking-tool
## How to get the front-end of this project working.
  If you are working from the remote github repository
1. Clone this project by running `git clone` and pasting the link to clone this project in the terminal of your computer or code editor. You must have a local folder in which all the coding files for this project will be run

2. Install package dependencies
    - In the terminal of your IDE, RUN `npm install` this installs npm which is a package required to run this react project
3. Ensure =you're in the project directory, if not, RUN `cd attendance-tracking-tool-app` to navigate into where the project is located
4. In a new termina, RUN: `node index.js` to start the project server, without this the front-end will not function as desired. You should see something like "Server listening on http://localhost6060 this means the server is working
5. In a new terminal (for the front-end), RUN: `npm start`. This starts the react project locally
6. Click on the local link (cmd + click) on mac and this should show the front end of the project. The link should look like this: http://localhost:3000
7. Upload a CSV file containting student data using the 'upload csv' button
8. View the student profiles using the 'View Student Profiles ' button
