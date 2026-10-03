# Premium Saree Website

Premium static saree boutique site with:
- Responsive luxury UI
- Search + category filters
- Featured / new arrival section
- WhatsApp enquiry links
- Admin add/edit/delete
- Image URL or local upload
- Shop + WhatsApp settings

GitHub Pages admin: enter a fine-grained GitHub token with repository **Contents: Read and write** permission. The token is kept only in the browser and is never written to the repository.

## GitHub Pages\nThe live site can run directly from GitHub Pages. Admin settings, products, and uploaded product images are written back to this repository through the GitHub REST API.\n\n## Important
The admin/data in this prototype uses browser localStorage. For a production shop, use Supabase/Firebase for secure authentication, database and image storage.


## Git-backed catalogue

Products are stored in the repository under `products/<product-id>/`:

- `product.json` contains the item's catalogue information.
- Uploaded images are stored beside it as `image.jpg`, `image.png`, or `image.webp`.
- `products/index.json` is a small catalogue index used by the storefront for fast reads.
- Add, edit, and delete operations create Git commits, so both Netlify sites can use the same catalogue from the same repository.

### GitHub token\nCreate a fine-grained personal access token limited to this repository and give it **Contents: Read and write** permission. Enter it in Admin Studio. It is stored only in the browser's local storage and is not included in settings or product commits.
