# Take A Survey

Built on a Mac for a Mac. We're going to Ireland, to take some surveys.

- Get it up and Running. Install the dependancies:

		npm install

- Make sure you start mysql and create the database:

		mysqld
		mysql -u root -e "CREATE DATABASE IF NOT EXISTS survey_database"

- From there, you can run the app:

  	npm start

- Or run the gulpfile and check out my dev setup:

  	gulp

## Make A Survey


Go to [http://localhost:4000/admin](http://localhost:4000/admin) to make a new survey, add options to choose from and see how many answers each option has gotten. There's a link at the top of the page that will take you to the admin page if you just go to the homepage.  Add a few questions and then head over to the root (there's a link on the top left again) to *take some survey* or a few of them: [http://localhost:4000/](http://localhost:4000/). Survey questions and answers are stored in the database and can be seen in the Admin panel. Just click the down arrow next to a question to make edits or edit a question.

Cheers.
