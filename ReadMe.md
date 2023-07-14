## Environment Setup
- Install [NodeJS](https://nodejs.org) and [MongoDB](https://www.mongodb.com/)
- Clone the repository
- Install Node dependencies: `npm install`
- Create and fill out a `.env` file in the root source directory. See [available variables](#Environment-Variables)

### Environment Variables
- `PORT` - The port to listen on, defaults to `3000`. Uses HTTPS if `SSL_KEY` and - `SSL_CERT` are present and valid filepaths
- `SSL_KEY`, `SSL_CERT` - SSL key and certificate
- `MONGO_PORT`, `MONGO_IP`, `MONGO_DBNAME` - The address, port and collection name of your Mongo database
- `EXPRESS_SECRET` - Signature for session IDs. See more information on the [express-session page](https://expressjs.com/en/resources/middleware/session.html#:~:text=in%20PassportJS%200.3.0-,secret,-Required%20option)

## Adding Fonts
 - In `views/settings.edge`, add your font of choice to the `const Fonts` array.
	Built-in and [Google Font](https://fonts.google.com/) fonts are valid.

## Credit
Backend is based off https://vegibit.com/node-js-blog-tutorial/