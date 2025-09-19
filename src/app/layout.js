import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "JWT Todo App",
  description: "Simple JWT auth + todo app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
