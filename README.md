# Spasov.me home page

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/25a5b655a9ce437aa5867df55352e90c)](https://app.codacy.com/gh/metalevel-tech/spasov-me/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Todo

- [x] Copy the Home page editable version prom the old repo
- [x] Copy the files page from the old repo
- [x] Add page form
  - [x] Change the image input to dropdown from files
  - [x] Change the schema of the PageDoc?
  - [x] Add a switch to choose is the page public or not...
- [x] Copy the **contact page** from Animated-portfolio
  - [x] Copy and adapt the code
  - [x] CSS style of the contact page
  - [x] Texts in the emails
- [x] Add the project as GitHub repo and deploy to Vercel
- [x] Link the local server to Vercel
- [x] Manage the menu items via the pages feed...
- [x] The footer icons active SVG icons
- [x] Apply the styles to the files page
- [x] Edit the files: name, description, content...
- [x] Tweak the files Form
- [ ] Create the About page
  - [x] AboutEntry
    - [x] DB Model
    - [x] API `@app/api/data/[[...query]]/route.ts`
    - [x] API `@/routes.ts`
    - [x] Public menu entry
    - [x] Admin menu entry
    - [x] Home page card entry
  - [ ] **Type a date in the DatePicker**.
  - [x] Form
  - [ ] Public page CSS
  - [x] Admin page CSS
  - [x] Render Markdown
- [ ] Create technologies `tags` page
  - [ ] <https://github.com/dderevjanik/github-vscode-icons/tree/master>
  - [ ] <https://github.com/dderevjanik/vscode-icons-js>
- [ ] Add `TAGS` selector to the About page items
- [ ] Add `TAGS` selector to the Portfolio page items
- [ ] Vercel BLOB storage for files and images
- [ ] Portfolio/projects page
  - [ ] DB Model
  - [ ] Form
  - [ ] Page
  - [ ] CSS
  - [ ] Create a gallery
- [ ] **Implement gallery and integrate it with:**
  - [ ] Handle:
    - [ ] Image files
    - [ ] PDF files
    - [ ] Video links (YouTube, Vimeo...)
    - [ ] MSO365 files
  - [ ] About entry attachments
  - [ ] Portfolio entry attachments (here will be number of images)
- [ ] Refactor `pages/admin` like as `about/admin` -> use Server actions instead of API fetch

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

## Vercel CLI

```bash
npx vercel link
npx vercel env pull
```
