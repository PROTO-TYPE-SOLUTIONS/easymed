

# Running FrontEnd

If you're running with docker, inside ./src/assets/backend-axios-instance/index.js
with docker baseURL = baseURL: "http://backend:8000",
running manually  = baseURL: "http://127.0.0.1:8000",

#### First, create a .env.local file in the same directory as the src folder then add the following:

* NEXT_PUBLIC_BASE_URL=""
* NEXT_PUBLIC_ENCRYPTION_KEY="c2FubGFta2VueWFAZ21haWwuY29t"

###### Include your base_url in the field above then use the above encryption key


Lastly run the development server using either of the following commands:

```bash
npm run dev

```

Visit localhost 3000 then visit /dashboard to access the dashboard route

