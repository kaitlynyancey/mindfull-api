# mindFULL API

### Description: 
Start to gain control of your mind and de-stress with mindFULL: a virtual mindfulness journal. Now you don't have to worry about carrying a notebook around with you everywhere you go. With mindFULL, you will always have access to your journal entries on mobile or desktop. 

Users will have a guided journal entry to fill out each day, which will include mood and stress level trackers, a gratitude section, and a free form for any other daily notes. The entries are saved to the user's journal log (if an account is made), which the user can access anytime. Progress trackers will show how a user is doing on their stress levels and overall moods on their journal page. 

### Link to mindFULL Live App: [https://mindfull-app.vercel.app/](https://mindfull-app.vercel.app/)
### Link to mindFULL App Repository: [https://github.com/kaitlynyancey/mindfull-app](https://github.com/kaitlynyancey/mindfull-app)

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
