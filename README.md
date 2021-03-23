# mindFULL API

### Description: 
Start to gain control of your mind and de-stress with mindFULL: a virtual mindfulness journal. Now you don't have to worry about carrying a notebook around with you everywhere you go. With mindFULL, you will always have access to your journal entries on mobile or desktop. 

Users will have a guided journal entry to fill out each day, which will include mood and stress level trackers, a gratitude section, and a free form for any other daily notes. The entries are saved to the user's journal log (if an account is made), which the user can access anytime. Progress trackers will show how a user is doing on their stress levels and overall moods on their journal page. 

### Link to mindFULL Live App: [https://mindfull-app.vercel.app/](https://mindfull-app.vercel.app/)
### Link to mindFULL API Repository: [https://github.com/kaitlynyancey/mindfull-api](https://github.com/kaitlynyancey/mindfull-api)
- Documentation of the API endpoints can be found in the README file in the mindFULL API repository. 
___
## Screenshots:

### Home Page

This is the landing page of the app. From here you can access your daily entry or your journal log. Also, on any page of the app, you can use the navigation links to visit the home page, about section, entry page, or journal log. You can also login or logout with the links in the top right corner of the page 

![screenshot of app home page](mindfull-screenshots/home-page.png)
___
### Entry Page

This is the daily entry form. You will be prompted to enter your current mood, stress level, three daily gratitudes, and any notes or thoughts you want to record

![screenshot of app journal entry page](mindfull-screenshots/entry-form.png)
___
### Journal Log

The completed entries will be available to access in the journal log. You can keep track of your progress with the stress level and mood trackers

![screenshot of app journal trackers](mindfull-screenshots/trackers.png)

![screenshot of app journal log page](mindfull-screenshots/journal-log.png)
___
### Login Page

You can create a new account or login to your current account in the login page

![screenshot of app login page](mindfull-screenshots/login-page.png)
___
### About Page

For more information on mindfulness, you can visit the about page

![screenshot of app about page](mindfull-screenshots/about-page.png)
___
### Technology Used
* HTML 
* CSS
* JavaScript
* React
* Node 
* PostGreSQL
* Express

## API Endpoints

### Get
To display all journal entries in the entries database:

```
fetch('https://stormy-taiga-88340.herokuapp.com/api/entries', {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer REACT_APP_API_KEY'
      }})
```

### Get by Entry ID
To display a specific journal entry from the entries database:

```
fetch('https://stormy-taiga-88340.herokuapp.com/api/entries/${YourEntryId}', {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer REACT_APP_API_KEY'
      }})
```

### Post
To save a new journal entry to the entries database:

```
fetch('https://stormy-taiga-88340.herokuapp.com/api/entries', {
      method: 'POST',
      body: JSON.stringify(newEntry),
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer REACT_APP_API_KEY'
      }})
```

Example of 'newEntry' object:

```
const newEntry = {
            date_created: '1/1/21' (required),
            month_created: 'January' (required),
            mood: 'Happy' (required),
            stress_level: 5 (required),
            gratitude1: 'Example 1' (required),
            gratitude2: 'Example 2' (required), 
            gratitude3: 'Example 3' (required),
            notes: 'Example notes' (required),
            userid: 1 (required),
            }
```

### Delete
To delete an existing journal entry from the entries database:

```
fetch('https://stormy-taiga-88340.herokuapp.com/api/entries/${YourEntryId}', {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer REACT_APP_API_KEY'
        }})
```

### Patch
To update an exisiting journal entry in the entries database:

```
fetch('https://stormy-taiga-88340.herokuapp.com/api/entries/${YourEntryId}', {
      method: 'PATCH',
      body: JSON.stringify(updatedEntry),
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer REACT_APP_API_KEY'
      }})
```

Example of 'updatedEntry' object:

```
const updatedEntry = {
            date_created: '1/2/21',
            month_created: 'January',
            mood: 'Excited',
            stress_level: 3,
            gratitude1: 'Example 1',
            gratitude2: 'Example 2', 
            gratitude3: 'Example 3',
            notes: 'Updated notes',
            userid: 1 (required),
            }
```
