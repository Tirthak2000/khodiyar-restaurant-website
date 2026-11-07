# Khodiyar Restaurant website

Static site, no build step. Two pages:

- `index.html` — home page
- `menu.html` — full menu with WhatsApp ordering (point the table QR codes here)

## How WhatsApp ordering works

WhatsApp ordering is **for dine-in only**. Orders are served at the table and never delivered;
delivery is through Zomato only, and the site says so on the menu, in the order form and in the FAQs.

Guests tap **Add** on dishes, open **Your order**, enter their **table number** (required),
optionally their name and notes, and tap **Send order on WhatsApp**. WhatsApp opens with the
order typed out (table, items, quantities, total, notes), addressed to `config.whatsapp`.
Nothing is paid online.

An unsent order is remembered on the guest's phone for 6 hours, so they can move between pages.

### Table QR codes

Give each table its own QR code with the table number in the link, for example
`https://your-domain/menu?table=5`. The menu then shows "Ordering for table 5" and fills in the table number.
A plain `https://your-domain/menu` works too; the customer types the table number.

## Edit prices, dishes, settings

Everything lives in `assets/js/menu-data.js`:

- `config` — WhatsApp number, phone, email, Google review link, **Zomato link**
- `featured` — the six big dish cards on the home page
- `menu` — every section and dish. `p` = price in ₹; `v` = two prices (Dry/Gravy, Plain/Butter); `tag: "special"` shows the House special badge
- `photos` — Unsplash photo IDs

## Before going live

1. Set `config.zomato` to your Zomato restaurant page link.
2. Check the two flagged lines in `menu-data.js` (Paneer Butter Masala appears twice; Plain Lachha Paratha is priced above Lachha Paratha).

## Deploy (Vercel)

Import the GitHub repo on vercel.com (Framework preset: Other) or run `npx vercel --prod` here.
`vercel.json` turns on clean URLs, so the menu is at `https://your-domain/menu`.
