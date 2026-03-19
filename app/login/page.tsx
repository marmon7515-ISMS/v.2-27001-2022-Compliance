import LoginForm from "@/components/login-form";
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "@/components/ui";

export default function LoginPage() {
  return (
    <main className="mx-auto grid min-h-screen max-w-5xl gap-6 p-6 lg:grid-cols-2">
      <Card>
        <CardBody>
          <div className="inline-flex rounded-full border px-3 py-1 text-xs">Area riservata</div>
          <h1 className="mt-6 text-4xl font-bold">Compliance OS</h1>
          <p className="mt-3 text-sm text-slate-500">
            Login protetto con username e password. Nel backend le password sono hashate e la sessione è salvata
            in cookie HTTP-only.
          </p>
          <div className="mt-8 grid gap-2 rounded-2xl border p-4 text-sm">
            <div>admin / admin12345</div>
            <div>acme / acme12345</div>
            <div>beta / beta12345</div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Accedi</CardTitle>
          <CardDescription>Username e password obbligatori</CardDescription>
        </CardHeader>
        <CardBody>
          <LoginForm />
        </CardBody>
      </Card>
    </main>
  );
}
