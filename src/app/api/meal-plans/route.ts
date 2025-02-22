import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export const runtime = 'nodejs';

async function getUserFromToken(request: Request) {
  const token = request.headers.get('x-auth-token');
  if (!token) return null;
  return verifyToken(token);
}

export async function POST(request: Request) {
  try {
    const userData = await getUserFromToken(request);
    if (!userData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { date, meals } = body;

    if (!date || !meals || !Array.isArray(meals)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Create or update meal plans for the given date
    const mealPlans = await Promise.all(
      meals.map(async (meal: { mealType: string; dishName: string }) => {
        if (!meal.mealType || !meal.dishName) {
          throw new Error('Missing required meal data');
        }

        // First, create or find the dish
        const dish = await prisma.dish.upsert({
          where: {
            name_userId: {
              name: meal.dishName,
              userId: userData.userId,
            },
          },
          update: {},
          create: {
            name: meal.dishName,
            userId: userData.userId,
          },
        });

        // Then create or update the meal plan
        return prisma.mealPlan.upsert({
          where: {
            date_mealType_userId: {
              date: new Date(date),
              mealType: meal.mealType,
              userId: userData.userId,
            },
          },
          update: {
            dishId: dish.id,
          },
          create: {
            date: new Date(date),
            mealType: meal.mealType,
            dishId: dish.id,
            userId: userData.userId,
          },
        });
      })
    );

    return NextResponse.json({ mealPlans });
  } catch (error) {
    console.error('Error creating meal plans:', error);
    return NextResponse.json(
      { error: 'Failed to create meal plans' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const userData = await getUserFromToken(request);
    if (!userData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      );
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    const mealPlans = await prisma.mealPlan.findMany({
      where: {
        date: parsedDate,
        userId: userData.userId,
      },
      include: {
        dish: true,
      },
    });

    return NextResponse.json({ mealPlans });
  } catch (error) {
    console.error('Error fetching meal plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meal plans' },
      { status: 500 }
    );
  }
} 