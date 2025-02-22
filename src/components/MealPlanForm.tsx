"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";

interface MealPlanFormProps {
  date: Date;
  onSave: (mealPlan: { mealType: string; dishName: string }[]) => void;
}

interface MealPlanResponse {
  mealPlans: Array<{
    mealType: string;
    dish: {
      name: string;
    };
  }>;
}

export function MealPlanForm({ date, onSave }: MealPlanFormProps) {
  const [meals, setMeals] = React.useState([
    { mealType: "breakfast", dishName: "" },
  ]);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    const fetchMealPlans = async () => {
      try {
        const response = await fetch(
          `/api/meal-plans?date=${date.toISOString()}`
        );
        const data = await response.json() as MealPlanResponse;
        
        if (data.mealPlans && data.mealPlans.length > 0) {
          setMeals(
            data.mealPlans.map((mp) => ({
              mealType: mp.mealType,
              dishName: mp.dish.name,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching meal plans:", error);
      }
    };

    fetchMealPlans();
  }, [date]);

  const addMeal = () => {
    setMeals([...meals, { mealType: "", dishName: "" }]);
  };

  const updateMeal = (index: number, field: "mealType" | "dishName", value: string) => {
    const newMeals = [...meals];
    newMeals[index][field] = value;
    setMeals(newMeals);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/meal-plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: date.toISOString(),
          meals,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save meal plans");
      }

      onSave(meals);
    } catch (error) {
      console.error("Error saving meal plans:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {meals.map((meal, index) => (
        <div key={index} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Meal Type</Label>
              <Select
                value={meal.mealType}
                onValueChange={(value) => updateMeal(index, "mealType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select meal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Dish Name</Label>
              <Input
                value={meal.dishName}
                onChange={(e) => updateMeal(index, "dishName", e.target.value)}
                placeholder="Enter dish name"
              />
            </div>
          </div>
        </div>
      ))}
      
      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={addMeal}>
          Add Another Meal
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Meal Plan"}
        </Button>
      </div>
    </form>
  );
} 