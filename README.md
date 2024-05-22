# Spasov.me home page

<!-- [![Codacy Badge](https://app.codacy.com/project/badge/Grade/25a5b655a9ce437aa5867df55352e90c)](https://app.codacy.com/gh/metalevel-tech/spasov-me/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade) -->

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## WARNING

**January 2024: The package [`sharp 0.33.2`](https://www.npmjs.com/package//sharp#sharp) requires _Node-API v9, including Node.js (^18.17.0 or >= 20.3.0), Deno and Bun._ Unfortunately the versions of Node.js available on Vercel are not compatible with the lates version of this package. So we are still using `sharp 0.32.6` for now.**

## Todo

- [ ] **Search by content and filter by tag**
  - [ ] use searchParams to store the search query in the URL
  - [ ] use searchParams to store the selected tag in the URL

- [x] Process AttachedTo files in a different way

- [x] Projects Admin? > Form design
- [x] Projects public
- [x] Single project + gallery > design
  - Desktop: Gallery on the left, Title and description on the right
  - Mobile: Gallery on the top, Title and description on the bottom
  - When click on the gallery display it on full screen
  - Use the Shad-cn/ui slider for the gallery

- [ ] Blog post admin
- [ ] Blog feed public
- [ ] Blog post public

- [ ] Gallery: display .PDF, .XLS, .XLSX, .DOC, .DOCX, .PPTX, .PPT

- About page finish:
  - [ ] Section for IT Certificates?? --> This goes in to the gallery for "Career Break and Retraining"
  - [ ] Action Buttons (+logged-in) for About entries on public
  - [ ] Gallery for About Entries

## Vercel CLI

Link the project to Vercel for local development

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
- [Auth.js v.4](https://authjs.dev/reference/nextjs)\* [Auth.js v.5](https://authjs.dev/guides/upgrade-to-v5)
- [Resend](https://resend.com/docs/send-with-nextjs)
- [Google reCaptcha](https://www.google.com/recaptcha/admin) @[react-google-recaptcha-v3](https://www.npmjs.com/package/react-google-recaptcha-v3)
- unified, remark, rehype, hyphen.

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
