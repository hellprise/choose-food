# Meal Planning Calendar

A simple meal planning application built with Next.js that allows users to plan their meals for each day using a calendar interface.

## Features

- Full-page calendar with month and year navigation
- Add multiple meals for each day
- Support for different meal types (breakfast, lunch, dinner, snack)
- Persistent storage using PostgreSQL database
- Modern UI using shadcn/ui components

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Prisma (ORM)
- PostgreSQL
- shadcn/ui (UI Components)
- Tailwind CSS

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your database:
   - Create a PostgreSQL database
   - Copy `.env.example` to `.env`
   - Update the `DATABASE_URL` in `.env` with your database connection string

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── meal-plans/
│   │       └── route.ts    # API routes for meal plans
│   ├── layout.tsx
│   └── page.tsx            # Main page component
├── components/
│   ├── Calendar.tsx        # Calendar component
│   └── MealPlanForm.tsx    # Meal planning form
├── lib/
│   └── db.ts              # Prisma client configuration
└── prisma/
    └── schema.prisma      # Database schema
```

## Database Schema

The application uses two main models:

### Dish
- `id`: Unique identifier
- `name`: Name of the dish
- `description`: Optional description
- `createdAt`: Timestamp of creation
- `updatedAt`: Timestamp of last update

### MealPlan
- `id`: Unique identifier
- `date`: Date of the meal
- `mealType`: Type of meal (breakfast, lunch, dinner, snack)
- `dishId`: Reference to the Dish
- `createdAt`: Timestamp of creation
- `updatedAt`: Timestamp of last update

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
