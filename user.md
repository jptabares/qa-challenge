### User data model

```
{
  id: Number, 
  name: {
    firstName: String,
    lastName: String
  },
  email: String,
  gender: String,
  role: String
}
```

### API Endpoint
GET https://my.api.mockaroo.com/users.json?page=20&count=5&key=930279b0
```
key: needed to access the api endpoint.
It can also be sent as a request header named "X-API-Key"

count: this is the number of records you want in return (page size).
min = 1, max = 1000, default = 50

page: page of data you want in return
min = 1, max = (total / count), default = 1

Note: "total" = 1000, set by the server
```

### Sample responses
GET https://my.api.mockaroo.com/users.json?page=1&count=3&key=930279b0
```
{
    "total": 1000,
    "page": 1,
    "count": 3,
    "numPages": 334,
    "entries": [
      {
        "id": 1,
        "name": {
            "firstName": "Thorny",
            "lastName": "Clayborn"
        },
        "email": "tclayborn0@altervista.org",
        "gender": "Male",
        "role": "Test Engineer"
      },
      {
        "id": 2,
        "name": {
            "firstName": "Layney",
            "lastName": "Juan"
        },
        "email": "ljuan1@google.com.au",
        "gender": "Male",
        "role": "Vendor"
      },
      {
        "id": 3,
        "name": {
            "firstName": "Ulrich",
            "lastName": "Lepper"
        },
        "email": "ulepper2@example.com",
        "gender": "Male",
        "role": "Vendor"
      }
    ]
}
```
