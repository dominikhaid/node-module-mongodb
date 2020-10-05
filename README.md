# MongoDB

## Discription

---

This module is developed to extend our base server. It can be easily installed
with the Plugin script from the base module. For detailed Information please see
[@base-server](https://github.com/dominikhaid/node-base-server.git)

### Module Features

- Add support for mongodb
- Add ready to use docker-compose for mongodb server and mongo-express
- Add sample data, functions and routes

### Setup

---

> git clone https://github.com/dominikhaid/node-base-server.git my-app
>
> cd my-app
>
> npm run plugin p=https://github.com/dominikhaid/node-module-mongodb.git
>
> npm run dev
>
> visit http://localhost/api/

**NOTE:** all endpoinnts are documented in ./src/http

### Mongoosse

```
There is some sample data under ./data it will be inserted on the request the api reseves.
```

- ./src/config/mongo-config.json
