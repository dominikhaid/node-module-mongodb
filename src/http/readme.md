## Fans

- GET http://localhost/api/fans/ -> list all fans

```
curl --location --request GET 'http://localhost/api/fans'
```

- GET http://localhost/api/fans/:id -> find fan by id

```
curl --location --request GET 'http://localhost/api/fans/5f6565d713efd327f137d5d1'
```

- GET http://localhost/api/fans/search/:email -> search fan by email

```
curl --location --request GET 'http://localhost/api/fans/search/fermentum@et.edu'
```

- POST http://localhost/api/fans/:email -> create new fan if not exists
  form-data with the following fields is expected "email,name"

```
curl --location --request POST 'http://localhost/api/fans/user@example.com' \
--form 'fan_name=New Fan' \
--form 'fan_email=user@example.com'
```

- DELETE http://localhost/api/fans/:email -> delete fan

```
curl --location --request DELETE 'http://localhost/api/fans/hendrerit@loremluctusut.org'
```

- UPDATE http://localhost/api/fans/:email -> update fan form-data with the
  following fields is expected "email,name"

```
curl --location --request PATCH 'http://localhost/api/fans/iaculis.lacus@venenatisamagna.edu' \
--form 'fan_email=iaculis.lacus@venenatisamagna.edu' \
--form 'fan_name=Quon Wilkerson Update'
```

## Stories

- GET http://localhost/api/stories/ -> list all stories

```
curl --location --request GET 'http://localhost/api/stories'
```

- GET http://localhost/stories/:id -> find story by id

```
curl --location --request GET 'http://localhost/api/stories/5f63f526481ac717957653c7'
```

- GET http://localhost/api/stories/search/:email -> search story by email

```
curl --location --request GET 'http://localhost/api/stories/search/Charles%20Darwin'
```

- POST http://localhost/api/stories/:email -> create new story if not exists
  form-data with the following fields is expected "title"

```
curl --location --request POST 'http://localhost/api/stories/New%20Story' \
--form 'story_title=New%20Story'
```

- DELETE http://localhost/api/stories/:email -> delete story

```
curl --location --request DELETE 'http://localhost/api/stories/Douglas%20Adams'
```

- UPDATE http://localhost/api/stories/:email -> update story form-data with the
  following fields is expected "title"

```
curl --location --request PATCH 'http://localhost/api/stories/James%20Joyce' \
--form 'story_title=James%20oyce Updated'
```

## Authors

- GET http://localhost/api/authors/ -> list all authors

```
curl --location --request GET 'http://localhost/api/authors'
```

- GET http://localhost/api/authors/:id -> find author by id

```
curl --location --request GET 'http://localhost/api/authors/5f653a26ba9ec027b7c5bdcf'
```

- GET http://localhost/api/authors/search/:name -> search author by email

```
curl --location --request DELETE 'http://localhost/api/authors/Aladdin%20Bolton'
```

- POST http://localhost/api/authors/:name -> create new user if not exists
  form-data with the following fields is expected "email,first,last"

```
curl --location --request PATCH 'http://localhost/api/authors/Solomon%Mcgowan' \
--form 'author_name=Solomon Mcgowan Updated' \
--form 'author_age=10'
```

- DELETE http://localhost/api/authors/:name -> delete user

```
curl --location --request DELETE 'http://localhost/api/db/users/user@example.com'
```

- UPDATE http://localhost/api/authors/:name -> update user form-data with the
  following fields is expected "email,first,last"

```
curl --location --request POST 'http://localhost/api/authors/MacKenzie%20Patel' \
--form 'author_name=New Author' \
--form 'author_age=40'
```
