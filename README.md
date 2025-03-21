# Inventures URL Shortener
In this repo you'll find a simple URL shortener built with SvelteKit and Node.js, made for the Inventures Remote FullStack Technical Challenge. You can find the hosted version of the project at [https://inventures.pancho.moe/](https://inventures.pancho.moe/).

## Requirements

- Node.js `22.x` or higher 
- PostgreSQL `15.x` or higher
- pnpm `10.x` or higher
- Docker (optional)

## Data model
The data model used for this project consists of 4 tables:

### `users`
In the `users` table, we store the user's email and hashed password, along with their id, creation date and last updated date.

### `sessions`
In the `sessions` table, we store the user's session token, user id foreign key, expiration date and creation date.

### `urls`
In the `urls` table, we store the user's URL slug, destination URL, optional user id foreign key, creation date and expiration date.

### `url_clicks`
In the `url_clicks` table, we store the a user's IP address, country, city, URL slug foreign key and creation date.

We store individual URL clicks in a separate table in order to be able to easily access extra information about the specific URL click which would otherwise be difficult to do with the `urls` table alone.

## API Endpoints

### `GET /api/auth/login`

This endpoint is used to log in a user, it takes a JSON body with the following properties:

- `email`: The user's email
- `password`: The user's password in base64 encoded format

On success, it returns an empty request body, with a `200` status code and a `Set-Cookie` header with the session token.

On failure, it returns a JSON body with the following properties:

- `error`: A string describing the error, intentionally made generic to avoid exposing too much information to malicious users.

### `POST /api/auth/register`

This endpoint is used to register a new user, it takes a JSON body with the following properties:

- `email`: The user's email
- `password`: The user's password

It returns a JSON body with the following properties:

- `id`: The user's id
- `email`: The user's email

Additionally, it returns a `201` status code and a `Set-Cookie` header with the session token.

On failure, it returns a JSON body with the following properties:

- `error`: A string describing the error, intentionally made generic to avoid exposing too much information to malicious users.

### `GET /api/auth/logout`

This endpoint is used to log out a user, it takes no JSON body and returns an empty request body, with a `302` status code and both a `Location` header with the root URL and a `Set-Cookie` header with an empty session token that expires immediately.

### `POST /api/urls`

This endpoint is used to create a new URL, it takes a JSON body with the following properties:

- `destination`: The URL to redirect to
- `slug`: The URL slug, if not provided, a random slug will be generated

It returns a JSON body with the following properties:

- `slug`: The generated URL slug
- `destination`: The destination URL
- `expiresAt`: The expiration date of the URL

### `GET /r/:slug`

Although this endpoint is not exposed in the API path, it's sole purpose is to redirect to a URL. It takes no JSON body.

On success, it returns a `302` status code and a `Location` header with the destination URL.

On failure, it returns a `404` status code when the URL doesn't exist, or a `410` status code when the URL has expired.

## Deployment

To deploy this project, you have two options, for either of them, you'll need to have a PostgreSQL database running, and you'll need to set the `DATABASE_URL` environment variable to the connection string of your database.

Before deploying, you'll need to run `pnpm db:migrate` to create the database tables. With the database tables created, you can deploy the project using the instructions below.

### Docker
In this repository, you'll find a `Dockerfile` that you can use to build a Docker image for this project. You can build the image using the following command:

```bash
docker build -t inventures-url-shortener .
```

Once the image is built, you can run it using the following command:

```bash
docker run -p 127.0.0.1:3000:3000 -e "DATABASE_URL=postgres://user:password@host:port/db-name" inventures-url-shortener
```

This will expose the project on `http://localhost:3000`. If you wish to expose it on a different port, you can modify the `-p` argument accordingly.

### Manual
You can also run this project manually by installing the dependencies using `pnpm install` and then building the project using `pnpm build`. Once the project is built, you can run it using the following command:

```bash
node build
```
