# Intermost Frontend

## Production-ready Next.js 14 Application

### Features

- ✅ **Next.js 14** with App Router
- ✅ **TypeScript** for type safety
- ✅ **Tailwind CSS** for styling
- ✅ **Framer Motion** for animations
- ✅ **React Hook Form + Zod** for form validation
- ✅ **Zustand** for state management
- ✅ **Axios** for API calls
- ✅ **Swiper** for carousels
- ✅ **React Hot Toast** for notifications

### Quick Start

1. **Install Dependencies**
```bash
npm install
```

2. **Set Environment Variables**
```bash
copy .env.local.example .env.local
# Edit .env.local with your API URL
```

3. **Run Development Server**
```bash
npm run dev
```

4. **Open in Browser**
```
http://localhost:3000
```

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── about/             # About page
│   ├── apply/             # Application form
│   ├── countries/         # Countries listing & detail
│   ├── admin/             # Admin dashboard
│   └── not-found.tsx      # 404 page
├── components/             # React components
│   ├── home/              # Home page sections
│   ├── layout/            # Header, Footer
│   ├── countries/         # Country-related components
│   ├── admin/             # Admin components
│   └── ui/                # Reusable UI components
├── lib/                    # Utilities & services
│   ├── api.ts             # Axios config & types
│   ├── services.ts        # API service functions
│   ├── utils.ts           # Utility functions
│   └── store.ts           # Zustand stores
└── styles/                 # Global styles (if needed)
```

### Available Scripts

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000/api/v1` |
| `NEXT_PUBLIC_SITE_URL` | Frontend URL | `http://localhost:3000` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number for chat | `919058501818` |

### Pages

| Route | Description |
|-------|-------------|
| `/` | Home page with all sections |
| `/countries` | List of all countries |
| `/countries/[slug]` | Country detail page |
| `/apply` | Multi-step application form |
| `/about` | About us page |
| `/admin` | Admin dashboard |
| `/admin/countries` | Manage countries |
| `/admin/inquiries` | Manage inquiries |

### Admin Panel

Access the secure admin panel at `/admin`. Authentication is fully implemented using JWT access/refresh tokens.
- **Authentication**: Handled via the layout which checks the validity and expiration of access tokens.
- **Session Expiry**: Sessions are configured to expire after 24 hours, automatically clearing credentials and redirecting to the login page.

### Deployment

**Vercel (Recommended)**
```bash
npm i -g vercel
vercel
```

**Docker**
```bash
docker build -t intermost-frontend .
docker run -p 3000:3000 intermost-frontend
```

**Static Export**
```bash
npm run build
# Output in .next/static
```

### API Integration

The frontend communicates with the Django backend via REST API:

```typescript
// Example: Fetch countries
import { countriesApi } from '@/lib/services';

const countries = await countriesApi.getAll();

// Example: Submit inquiry
import { inquiriesApi } from '@/lib/services';

await inquiriesApi.create({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '9876543210',
});
```

### Styling Guidelines

- Use Tailwind CSS utility classes
- Custom components in `globals.css` with `@layer components`
- Color scheme defined in `tailwind.config.js`
- Responsive design with mobile-first approach

### Performance Optimizations

- Image optimization with `next/image`
- Font optimization with `next/font`
- Code splitting with dynamic imports
- Prefetching with `<Link>`
- SEO optimization with metadata API
# Intermost-Frontend
