import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AuthCard } from "./login";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [{ title: "Sign up — ResumeRAG" }],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();

  return (
    <AuthCard
      mode="signup"
      onSuccess={() => navigate({ to: "/dashboard" })}
    />
  );
}