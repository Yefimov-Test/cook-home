import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">Вход</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Войдите в свой аккаунт HomeCook
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
