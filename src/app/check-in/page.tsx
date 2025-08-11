import { CheckInForm } from './check-in-form';

export default function CheckInPage() {
  return (
    <main className="flex-1 p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Web Check-in</h1>
            <p className="text-muted-foreground mt-2">
                Please fill out the form below to check in for your appointment.
            </p>
        </div>
        <CheckInForm />
      </div>
    </main>
  );
}
