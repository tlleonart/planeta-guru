import { redirect } from "next/navigation";

/**
 * Root Not Found Page
 * Redirects to default locale's home page
 */
export default function RootNotFound() {
  redirect("/ar-es");
}
