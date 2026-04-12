# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Routes

### <span style="color:#5c6370">Login</span>

<a>
    <span style="color:#c678dd">POST</span>
    <span style="color:white">/api/login/</span>
</a>

### <span style="color:#5c6370">Asset</span>

<a>
    <span style="color:#c678dd">GET</span>
    <span style="color:white">/api/asset/</span>
    <span style="color:#61aeee">[...assetName]</span>
</a>

### <span style="color:#5c6370">Person</span>

<a>
    <span style="color:#c678dd">get</span>
    <span style="color:white">/api/person/search</span>
</a>

### <span style="color:#5c6370">Lists</span>

<a>
    <span style="color:#c678dd">get</span>
    <span style="color:white">/api/lists</span>
</a>

### <span style="color:#5c6370">Address</span>

<a>
    <span style="color:#c678dd">get</span>
    <span style="color:white">/api/address/</span>
        <span style="color:#61aeee">[...zip]</span>

</a>

---

<a>
    <span style="color:#c678dd">get</span>
    <span style="color:white">/api/person/</span>
    <span style="color:#61aeee">ID</span>
</a>

### <span style="color:#5c6370">Patients</span>

<a>
    <span style="color:#c678dd">get</span>
    <span style="color:white">/api/patient/search</span>
    <span style="color:#61aeee">?firstName</span>
    <span style="color:#61aeee">?lastName</span>
</a>

<span style="color:#c678dd">get</span>
<span style="color:white">/api/patient/</span>
<span style="color:#61aeee">ID</span>

<span style="color:#c678dd">get</span>
<span style="color:white">/api/persons/search</span>
<span style="color:#61aeee">?type</span>
<span style="color:white"></span>

### <span style="color:#5c6370">Lists</span>

Stuff that is more or less static - goes into store - includes doctors

### <span style="color:#5c6370">Encounters</span>

### <span style="color:#5c6370">User</span>

### <span style="color:#5c6370">System</span>

### <span style="color:#5c6370">Orders</span>
