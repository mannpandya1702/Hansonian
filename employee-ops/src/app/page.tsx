import { redirect } from "next/navigation";

// Root redirects to the main dashboard
export default function EmployeeOpsRoot() {
  redirect("/dashboard");
}
