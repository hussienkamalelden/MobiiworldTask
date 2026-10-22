# Product Catalog

A responsive product catalog built with **Next.js 16**, **TypeScript (strict)** and **Tailwind CSS 4**, using live data from the [DummyJSON](https://dummyjson.com/docs/products) API.

You can browse, search, filter and sort products, open a product page, and add, edit or delete products.

## Getting started

Requires Node.js 20.9 or later.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

| Script          | What it does                 |
| --------------- | ---------------------------- |
| `npm run dev`   | Start the development server |
| `npm run build` | Create a production build    |
| `npm run start` | Run the production build     |
| `npm run lint`  | Run ESLint                   |

## Features

- **Product list**: search, filter by category and sort by price or rating. The API does all of the work, and the list loads more products as you scroll.
- **Product page**: image gallery, price and discount, stock status, specifications and reviews. Each product has its own page title, and unknown ids return a real `404`.
- **Add and edit**: one shared form with validation and clear inline errors.
- **Delete**: always asks for confirmation in a dialog first.
- **Roles**: switch between **Admin** and **User** from the header. Users can only browse, while admins can add, edit and delete.
- **Saved changes**: products you add, edit or delete are kept in your browser (see below).
- **Display settings**: light, dark or system theme, and three text sizes.
- **States and feedback**: skeleton loaders, empty and error states, a page loading bar and toast messages.
- **Responsive and accessible**: works from 360px wide, with full keyboard support and labelled fields. Every page passes an axe accessibility check.

## Tech stack

| Area      | Choice                                          |
| --------- | ----------------------------------------------- |
| Framework | Next.js 16 (App Router), React 19               |
| Language  | TypeScript in strict mode, no `any`             |
| Styling   | Tailwind CSS 4 with light and dark color tokens |
| Forms     | React Hook Form + Zod                           |
| Icons     | lucide-react                                    |

## Project structure

```
src/
├── app/          Routes: /products, /products/[id], /products/[id]/edit, /products/new
├── components/
│   ├── layout/   Header, navigation, footer, settings menu
│   ├── products/ Product list, card, details, form and delete button
│   ├── roles/    Role switcher and role-based visibility
│   └── ui/       Shared building blocks (button, dialog, popover, toasts...)
├── hooks/        Client state: preferences, toasts, saved changes, infinite list
├── lib/          Pure helpers: catalog params, validation schema, formatting
├── services/     All data access: API client, product requests, local storage
└── types/        TypeScript models for the API data
```

## How the data works

1. **Reading**: the server fetches products from DummyJSON, and only the service layer talks to the API.
2. **Writing**: add, edit and delete send real requests to DummyJSON. DummyJSON does not save them, so the app also stores the result in `localStorage`.
3. **Showing**: saved products replace the API versions, new products appear at the top and deleted products are hidden.

You can clear everything from **Settings → Reset local changes**.

## Notes and trade-offs

- **Search and category cannot be combined.** The DummyJSON API does not support it, so choosing one clears the other and a short notice explains why.
- **Search also matches descriptions.** This is how the DummyJSON search endpoint works.
- **Product pages are cached.** Pages are built ahead of time and refreshed every hour, which keeps them fast and allows real `404` responses.
- **Roles are for demonstration.** They only change what the interface shows. A real app would also check permissions on the server.
- **Saved changes apply after load.** After a refresh, an edited product may show the original data for a moment before the saved version appears.
