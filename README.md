# NousNews Frontend

Nuxt 3 SSR frontend for the NousNews crawler API.

## Setup

```sh
cp .env.example .env
```

```sh
npm install
npm run dev
```

## Docker

```sh
docker compose up --build
```

The app runs on `http://localhost:3001` and reads the API base URL from
`NUXT_PUBLIC_API_BASE_URL`.
