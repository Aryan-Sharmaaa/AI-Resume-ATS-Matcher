import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Log in — ResumeRAG" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  return (
    <AuthCard
      mode="login"
      onSuccess={() => navigate({ to: "/dashboard" })}
    />
  );
}

export function AuthCard({
  mode,
  onSuccess,
}: {
  mode: "login" | "signup";
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Email / Password Login or Signup
  const handleSubmit = async () => {
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    if (mode === "signup" && !name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (mode === "login") {
        // LOGIN
        const { error: loginError } =
          await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

        if (loginError) {
          throw loginError;
        }

        onSuccess();
      } else {
        // SIGNUP
        const { data, error: signupError } =
          await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: {
              data: {
                full_name: name.trim(),
              },
            },
          });

        if (signupError) {
          throw signupError;
        }

        // If email confirmation is enabled,
        // Supabase may create the user without a session.
        if (!data.session) {
          setError(
            "Account created. Please check your email and confirm your account before logging in."
          );
          return;
        }

        onSuccess();
      }
    } catch (err) {
      console.error("Authentication failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Authentication failed."
      );
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error: googleError } =
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/dashboard`,
          },
        });

      if (googleError) {
        throw googleError;
      }
    } catch (err) {
      console.error("Google login failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Google login failed."
      );

      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">

      <div className="w-full max-w-sm">

        {/* LOGO */}

        <div className="mb-8 text-center">

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-foreground text-background">
              <Sparkles className="h-3.5 w-3.5" />
            </div>

            ResumeRAG
          </Link>

        </div>

        {/* CARD */}

        <div className="rounded-lg border bg-card p-6 shadow-sm">

          <h1 className="text-xl font-semibold tracking-tight">
            {mode === "login"
              ? "Welcome back"
              : "Create your account"}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "login"
              ? "Log in to analyze your next opportunity."
              : "Start matching your resume in seconds."}
          </p>

          {/* ERROR */}

          {error && (
            <div className="mt-4 rounded-md border border-destructive/50 bg-destructive/10 p-3">
              <p className="text-xs text-destructive">
                {error}
              </p>
            </div>
          )}

          {/* FORM */}

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >

            {/* NAME - SIGNUP ONLY */}

            {mode === "signup" && (
              <div>

                <Label htmlFor="name">
                  Full name
                </Label>

                <Input
                  id="name"
                  type="text"
                  placeholder="Alex Kumar"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  className="mt-1.5"
                  disabled={loading}
                />

              </div>
            )}

            {/* EMAIL */}

            <div>

              <Label htmlFor="email">
                Email
              </Label>

              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="mt-1.5"
                disabled={loading}
              />

            </div>

            {/* PASSWORD */}

            <div>

              <Label htmlFor="password">
                Password
              </Label>

              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="mt-1.5"
                disabled={loading}
              />

            </div>

            {/* SUBMIT */}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                  ? "Log in"
                  : "Create account"}
            </Button>

          </form>

          {/* DIVIDER */}

          <div className="my-5 flex items-center gap-3">

            <div className="h-px flex-1 bg-border" />

            <span className="text-xs text-muted-foreground">
              or
            </span>

            <div className="h-px flex-1 bg-border" />

          </div>

          {/* GOOGLE */}

          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={loading}
            onClick={handleGoogleLogin}
          >
            <GoogleIcon className="mr-2 h-4 w-4" />

            Continue with Google
          </Button>

          {/* LOGIN / SIGNUP LINK */}

          <p className="mt-6 text-center text-xs text-muted-foreground">

            {mode === "login" ? (
              <>
                Don't have an account?{" "}

                <Link
                  to="/signup"
                  className="text-foreground hover:underline"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}

                <Link
                  to="/login"
                  className="text-foreground hover:underline"
                >
                  Log in
                </Link>
              </>
            )}

          </p>

        </div>

      </div>

    </div>
  );
}

function GoogleIcon(
  props: React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />

      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />

      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />

      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 0 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />

    </svg>
  );
}