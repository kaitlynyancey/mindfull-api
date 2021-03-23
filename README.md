# mindFULL API

## Endpoints

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
            date_created: '1/2/21' (required),
            month_created: 'January' (required),
            mood: 'Excited' (required),
            stress_level: 3 (required),
            gratitude1: 'Example 1' (required),
            gratitude2: 'Example 2' (required), 
            gratitude3: 'Example 3' (required),
            notes: 'Updated notes' (required),
            userid: 1 (required),
            }
```
