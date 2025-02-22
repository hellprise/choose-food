import { Calendar } from "@/components/Calendar";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export const runtime = 'nodejs';

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    redirect("/login");
  }

  const userData = await verifyToken(token);
  if (!userData) {
    redirect("/login");
  }

  async function handleLogout() {
    "use server";
    const cookieStore = await cookies();
    cookieStore.delete("token");
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">
            Welcome, {userData.name || userData.email}
          </h1>
          <form action={handleLogout}>
            <Button variant="outline">Logout</Button>
          </form>
        </div>
        <Calendar />
      </div>
    </main>
  );
}
