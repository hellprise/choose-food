"use client";

import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from "date-fns";
import { MealPlanForm } from "./MealPlanForm";
import { cn } from "@/lib/utils";

export function Calendar() {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });

  // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
  const startingDayIndex = firstDayOfMonth.getDay();

  // Create array for empty days at the start
  const emptyDays = Array(startingDayIndex).fill(null);

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleSelect = (date: Date) => {
    setSelectedDate(date);
    setIsDrawerOpen(true);
  };

  const handleSaveMealPlan = async (mealPlan: { mealType: string; dishName: string }[]) => {
    // TODO: Implement saving to database
    console.log("Saving meal plan:", mealPlan);
    setIsDrawerOpen(false);
  };

  return (
    <div className="flex flex-col items-center p-8">
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handlePreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              ←
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {/* Calendar header */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="flex items-center justify-center p-2 text-sm font-semibold"
            >
              {day}
            </div>
          ))}
          
          {/* Empty days from previous month */}
          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} className="p-2" />
          ))}

          {/* Days of current month */}
          {daysInMonth.map((date) => (
            <button
              key={date.toISOString()}
              onClick={() => handleSelect(date)}
              className={cn(
                "flex flex-col items-center justify-center p-2 hover:bg-gray-100 rounded-lg transition-colors",
                !isSameMonth(date, currentDate) && "text-gray-400",
                isToday(date) && "bg-blue-100 hover:bg-blue-200",
                selectedDate && isSameMonth(date, selectedDate) && date.getDate() === selectedDate.getDate() && "bg-blue-500 text-white hover:bg-blue-600"
              )}
            >
              <span className="text-sm">{date.getDate()}</span>
            </button>
          ))}
        </div>

        <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>
                Meal Plan for {selectedDate ? format(selectedDate, "MMMM d, yyyy") : ""}
              </SheetTitle>
              <SheetDescription>
                Choose your meals for this day
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              {selectedDate && (
                <MealPlanForm date={selectedDate} onSave={handleSaveMealPlan} />
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
} 