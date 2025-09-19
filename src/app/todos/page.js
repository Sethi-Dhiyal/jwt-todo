"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PlusCircle, LogOut, CheckCircle } from "lucide-react";

export default function TodoPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const[loading,setLoading]=useState("");

   // ✅ wait for auth check to complete
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  function addTodo(e) {
    e.preventDefault();
    if (!task.trim()) return;
    setTodos([...todos, { id: Date.now(), text: task }]);
    setTask("");
  }

  if (loading) {
    // ✅ show loading while auth check
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  if (!user) return null; // will redirect

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
        <h1 className="text-2xl text-green-500 font-bold mb-4">Welcome, {user.email}</h1>
        <form onSubmit={addTodo} className="flex gap-2 mb-4">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter a todo"
            className="flex-1 border rounded-lg px-4 text-green-500 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <button className="bg-green-600 text-white px-4 cursor-pointer rounded-lg hover:bg-gray-700">
            Add
          </button>
        </form>
        <ul className="space-y-2 mb-4">
          {todos.map((t) => (
            <li key={t.id} className="border p-2 rounded flex justify-between">
              {t.text}
            </li>
          ))}
        </ul>
        <button
          onClick={logout}
          className="w-full bg-green-600 text-white py-2 cursor-pointer rounded hover:bg-gray-700"
        >
          Logout
        </button>
      </div>
    </main>
  );
}