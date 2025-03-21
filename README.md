# Quillscape

> Where thoughts bloom and stories flourish

A modern blog application built with Next.js 14, Contentful CMS, and TypeScript. Features include blog post listing, real-time search, pagination, and a complete comment system with CRUD operations.

🌐 **Live Demo**: [https://quillscape-xi.vercel.app/](https://quillscape-xi.vercel.app/)

## Features

- 📝 Blog posts from Contentful CMS
- 🔍 Real-time search with debouncing
- 📄 Client-side pagination
- 💬 Full comment system (Create, Read, Update, Delete)
- 🔒 Secured API endpoints with API key authentication
- 🎨 Beautiful, responsive design with Tailwind CSS
- ⚡ Server-side rendering and static generation
- 🔄 Incremental Static Regeneration (ISR)
- 🌐 API routes with proper error handling
- 📱 Mobile-first design approach
- ♿ Accessibility features
- 🔍 SEO optimized

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **CMS**: Contentful
- **Icons**: Lucide React
- **Date Formatting**: date-fns
- **Utilities**: lodash

## Prerequisites

Before you begin, ensure you have:

- Node.js 18.x or later
- A Contentful account with API keys
- npm or yarn package manager

## Environment Variables

Create a `.env` file in the root directory with:

```env
# Contentful
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token

# API Authentication
API_KEY=your_api_key
NEXT_PUBLIC_API_KEY=your_api_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/sarkeranik/quillscape.git
cd quillscape
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
quillscape/
├── app/                    # Next.js 14 app directory
│   ├── api/               # API routes
│   │   ├── comments/     # Comments API
│   │   └── posts/       # Posts API
│   ├── post/            # Blog post pages
│   └── page.tsx         # Home page
├── components/           # React components
│   ├── BlogList.tsx     # Blog listing component
│   ├── BlogPost.tsx     # Single post component
│   └── CommentSection.tsx # Comments component
├── lib/                 # Utility functions and services
│   ├── contentful.ts    # Contentful client setup
│   ├── comments.ts      # Comments service
│   └── posts.ts        # Posts service
└── middleware/             # API authentication middleware
```

## API Routes

### Blog Posts

- `GET /api/posts`
  - Query parameters:
    - `search`: Search posts by title, content, or author
    - `author`: Filter posts by author name
    - `startDate`: Filter posts from this date
    - `endDate`: Filter posts until this date
  - Response:
    ```typescript
    {
      posts: BlogPost[];
      meta: {
        total: number;
        filters: {
          search: string | null;
          author: string | null;
          startDate: string | null;
          endDate: string | null;
        }
      }
    }
    ```

### Comments

- `GET /api/comments?postSlug={slug}`
  - Get comments for a specific post
  - Response: `Comment[]`

- `POST /api/comments`
  - Create a new comment
  - Body: `{ postSlug: string; author: string; content: string; }`
  - Response: `Comment`

- `PUT /api/comments?id={id}&postSlug={slug}`
  - Update an existing comment
  - Body: `{ author: string; content: string; }`
  - Response: `Comment`

- `DELETE /api/comments?id={id}&postSlug={slug}`
  - Delete a comment
  - Response: `{ success: true }`

## Authentication

All API routes are protected with API key authentication. Include the API key in request headers:

```typescript
headers: {
  'x-api-key': process.env.NEXT_PUBLIC_API_KEY
}
```

## Contentful Setup

### Content Model

Create a content model in Contentful with the following fields:

- `title` (Short text)
- `slug` (Short text, unique)
- `author` (Short text)
- `date` (Date)
- `content` (Long text)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features

1. Create new components in `/components`
2. Add new API routes in `/app/api`
3. Update types as needed
4. Add new utility functions in `/lib`
5. Test thoroughly before committing

## Performance Optimizations

- Static Generation with dynamic routes
- Incremental Static Regeneration
- Client-side search with debouncing
- Optimized images with Next.js Image component
- Efficient pagination implementation
- Skeleton loading states
- Proper error boundaries

## Future Improvements

### Application Features
- 🔐 Authentication & User Management
  - OAuth integration
  - User profiles and preferences
  - Social connections
  - Activity tracking

- 💡 Enhanced Interaction
  - Real-time notifications
  - Live comments
  - Post reactions
  - Social sharing
  - Reading progress tracking

- 📱 Progressive Web App
  - Offline support
  - Push notifications
  - Background sync

### Performance & Development
- ⚡ Advanced Optimization
  - Redis caching
  - Performance monitoring
  - Error tracking
  - Analytics integration

- 🧪 Testing & Quality
  - Unit and integration tests
  - E2E testing
  - Performance testing
  - CI/CD pipeline

### CMS Enhancements
- 📝 Content Management
  - Rich text editing
  - Media management
  - Content scheduling
  - Localization support
  - Version control

- 🔌 Integration
  - Custom webhooks
  - Third-party integrations
  - Migration tools
  - Development utilities