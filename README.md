# Spasov.me home page

<!-- [![Codacy Badge](https://app.codacy.com/project/badge/Grade/25a5b655a9ce437aa5867df55352e90c)](https://app.codacy.com/gh/metalevel-tech/spasov-me/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade) -->

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## WARNING

**January 2024: The package [`sharp 0.33.2`](https://www.npmjs.com/package//sharp#sharp) requires _Node-API v9, including Node.js (^18.17.0 or >= 20.3.0), Deno and Bun._ Unfortunately the versions of Node.js available on Vercel are not compatible with the lates version of this package. So we are still using `sharp 0.32.6` for now.**

## Todo

- Search page
  - [ ] Choose the base data category type to be searched - i.e.: Search in [x]CV [x]Blog [x]Portfolio [x]Resources/Lab
  - [ ] Implement `useTransition()` and/or `useDeferredValue()`.

- Blog
  - [ ] MD PDF Embed
  - [ ] Copy button for the post's code snippets
  - [ ] Display gallery switch in the post form: to display the gallery navigation or not;
        Display gallery items caption switch too.

- [ ] Create to do list?
- [ ] Allow file rename when it is not linked to a post?

- [ ] Redis: Create event loop by using Upstash/Redis queue - object like:

  ```js
  {
    objectKey: string,
    metadata: FileMetadata,
    objectBody?: buffer, // this should become a temp file
    prefix: string,
    action: "create" | "update" | "update-metadata" | "delete",
  }
  ```

## Vercel CLI

Link the project to Vercel for local development

```bash
pnpm dlx vercel link
pnpm dlx vercel env pull
```

Or with `npx`:

```bash
npx vercel link
npx vercel env pull
```

Get the environment variables from Vercel, while the project is not linked to it.

- <https://vercel.com/docs/cli/global-options#token>
- <https://vercel.com/account/tokens>

```bash
export VERCEL_ENV_PULL_TOKEN=m1t...
export VERCEL_ORG_ID=team_...
export VERCEL_PROJECT_ID=prj_...

npx --yes -- vercel env pull --environment=production --yes --token $VERCEL_ENV_PULL_TOKEN .env.local
pnpm dlx vercel env pull --environment=production --yes --token $VERCEL_ENV_PULL_TOKEN .env.local
```

## Next.js features to learn

- `{ unstable_noStore } from next/cache` - <https://youtu.be/RBM03RihZVs?si=TrzTyxvnXPqB0sLy&t=733>
- `<Suspense />`
- `{ params, searchParams }` - <https://youtu.be/RBM03RihZVs?si=Dlwq-O59a6qF3PKC&t=798>

## Tech stack

- Next.js 14
- Vercel
- Typescript
- Sass
- Tailwind
- ShadCN/UI
- React
- React-hook-form
- Zod
- Next-themes
- MongoDB
- Mongoose
- [Auth.js v.4](https://authjs.dev/reference/nextjs) | [Auth.js v.5](https://authjs.dev/guides/upgrade-to-v5)
- [Resend](https://resend.com/docs/send-with-nextjs)
- [Google reCaptcha](https://www.google.com/recaptcha/admin) @[react-google-recaptcha-v3](https://www.npmjs.com/package/react-google-recaptcha-v3)
- Unified, remark, rehype, hyphen.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

[**_How do I use a Cloudflare domain with Vercel?_**](https://vercel.com/guides/using-cloudflare-with-vercel)

## Docker

Rebuild and run the app with `docker compose`.

```bash
docker compose build && docker compose up -d
```

References:

- <https://nextjs.org/docs/app/building-your-application/deploying#docker-image>
- <https://github.com/vercel/next.js/tree/canary/examples/with-docker>

## Unified/Remark/Rehype

References:

- Unified Readme.md: <https://github.com/unifiedjs/unified> | [#processorProcessSyncFile](https://github.com/unifiedjs/unified#processorprocesssyncfile)
- Syntax Highlighting in use: <https://www.tybarho.com/articles/adding-a-copy-button-mdx-code-snippets>
- Plugins list: <https://github.com/rehypejs/rehype/blob/main/doc/plugins.md#using-plugins>
- Custom plugin [easy]: <https://unifiedjs.com/explore/package/remark-directive/>
- Rehype video: <https://unifiedjs.com/explore/package/rehype-video/> | <https://github.com/jaywcjlove/rehype-video/tree/main>

## Full backup

Backup of the database and Cloudflare's object storage.

```bash
# scripts/dump-mongo-db.sh .env.local
doppler run -- scripts/dump-mongo-db.sh
doppler run -- scripts/aws-shell/objStorage-metadata-dump.sh
doppler run -- scripts/aws-shell/objStorage-sync.sh
doppler run -- pnpm exec ts-node --skip-project scripts/aws/index-copy-r2-minio.ts
```
