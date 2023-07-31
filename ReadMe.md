## Environment Setup
- Install [NodeJS](https://nodejs.org) and [MongoDB](https://www.mongodb.com/)
- Clone the repository
- Install Node dependencies: `npm install`
- Create and fill out a `.env` file in the root source directory. See [available variables](#Environment-Variables)

### Environment Variables
- `PRODUCTION` - Boolean value for production environment, defaults to `false`
- `PORT` - The port to listen on, defaults to `3000`. Uses HTTPS if `SSL_KEY` and - `SSL_CERT` are present and valid filepaths
- `SSL_KEY`, `SSL_CERT` - SSL key and certificate
- `MONGO_PORT`, `MONGO_IP`, `MONGO_DBNAME` - The address, port and collection name of your Mongo database
	- Default IP is `127.0.0.1`
	- Default port `27017`
	- Default database name is `blog`
- `MONGO_USER`, `MONGO_PASS` - Database user credentials. If empty does not authenticate when connecting to database, this may cause permission issues
- `MONGO_ADDRESS` (optional) - Override URL when connecting to Mongo database. Defaults to `mongodb://{MONGO_USER}:{MONGO_PASS}@{MONGO_IP}:{MONGO_PORT}/{MONGO_DBNAME}`
- `EXPRESS_SECRET` - Signature for session IDs. See more information on the [express-session page](https://expressjs.com/en/resources/middleware/session.html#:~:text=in%20PassportJS%200.3.0-,secret,-Required%20option)

## Adding Fonts
 - In `views/settings.edge`, add your font of choice to the `const Fonts` array.
	Built-in and [Google Font](https://fonts.google.com/) fonts are valid.

## Using Docker
```yaml
services:
  blog-site:
    container_name: blog-site
    image: lcomstive/blog-site
    restart: unless-stopped
    env_file:
      - .env
```

## Credit
Backend is based off https://vegibit.com/node-js-blog-tutorial/