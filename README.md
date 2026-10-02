# Premium Saree Website

Premium static saree boutique site with:
- Responsive luxury UI
- Search + category filters
- Featured / new arrival section
- WhatsApp enquiry links
- Admin add/edit/delete
- Image URL or local upload
- Shop + WhatsApp settings

Admin password: configure `ADMIN_PASSWORD` in Netlify environment variables. Do not store the password in this repository.

## Netlify
Connect this GitHub repository to your Netlify site. Netlify will deploy automatically whenever main changes.

## Important
The admin/data in this prototype uses browser localStorage. For a production shop, use Supabase/Firebase for secure authentication, database and image storage.


## Git-backed catalogue

Products are stored in the repository under `products/<product-id>/`:

- `product.json` contains the item's catalogue information.
- Uploaded images are stored beside it as `image.jpg`, `image.png`, or `image.webp`.
- `products/index.json` is a small catalogue index used by the storefront for fast reads.
- Add, edit, and delete operations create Git commits, so both Netlify sites can use the same catalogue from the same repository.

### Netlify environment variables

In **each Netlify site** connected to this repository, configure:

- `ADMIN_PASSWORD` - existing admin password.
- `GITHUB_TOKEN` - a GitHub token with repository Contents read/write permission for this repository.
- `GITHUB_OWNER` - `vinith1111` (optional because it is the default).
- `GITHUB_REPO` - `premium_saree_website` (optional because it is the default).
- `GITHUB_BRANCH` - `main` (optional because it is the default).

Never put `GITHUB_TOKEN` in browser JavaScript, HTML, or the repository.
