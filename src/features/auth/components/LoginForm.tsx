import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { z } from "zod";
import { useAuth } from "../hooks/useAuth";
import { ApiError } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { GoogleButton } from "./GoogleButton";
import { PasskeyButton } from "./PasskeyButton";
import { routes } from "@/config/routes";

// The backend takes a single "identifier" (email or username), so this
// deliberately isn't validated as an email format — a valid username
// would fail that check.
const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Email or username is required.")
    .max(254, "That's too long."),
  password: z.string().min(1, "Password is required."),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type LoginFormErrors = Partial<Record<keyof LoginFormValues, string>> & {
  form?: string;
};

export function LoginForm() {
  const { login, loginWithGoogle, loginWithPasskey } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): LoginFormValues | null {
    const result = loginSchema.safeParse({ identifier, password });
    if (!result.success) {
      const fieldErrors: LoginFormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof LoginFormValues;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return null;
    }
    setErrors({});
    return result.data;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (isSubmitting) return;

    const values = validate();
    if (!values) return;

    setIsSubmitting(true);
    setErrors({});
    try {
      await login(values);
      navigate(routes.dashboard);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again.";
      setErrors({ form: message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="login-identifier">Email or username</Label>
          <Input
            id="login-identifier"
            type="text"
            autoComplete="username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            disabled={isSubmitting}
            aria-invalid={!!errors.identifier}
            aria-describedby={
              errors.identifier ? "login-identifier-error" : undefined
            }
          />
          {errors.identifier && (
            <p id="login-identifier-error" className="text-sm text-destructive">
              {errors.identifier}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="login-password">Password</Label>
          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              className="pr-10"
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? "login-password-error" : undefined
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p id="login-password-error" className="text-sm text-destructive">
              {errors.password}
            </p>
          )}
        </div>

        {errors.form && (
          <Alert variant="destructive">
            <AlertDescription>{errors.form}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <div className="relative">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
          or continue with
        </span>
      </div>

      <div className="space-y-3">
        <GoogleButton onClick={loginWithGoogle} disabled={isSubmitting} />
        <PasskeyButton onClick={loginWithPasskey} disabled={isSubmitting} />
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link
          to={routes.register}
          className="font-medium text-foreground hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
