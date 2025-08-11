import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { StatCard } from '@/components/stat-card';
import { QueueTable } from '@/components/queue-table';
import { Announcements } from '@/components/announcements';
import { PatientFlowChart } from '@/components/patient-flow-chart';
import { Clock, Users, Stethoscope, Activity, HeartPulse } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <section className="relative h-[450px] w-full">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://placehold.co/1920x1080.png')" }}
          data-ai-hint="hospital waiting room"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
          <HeartPulse className="h-24 w-24 text-primary" />
          <h1 className="mt-4 text-5xl font-bold tracking-tight text-foreground md:text-6xl">
            Welcome to MedQueue AI
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Efficiently manage patient flow, predict wait times, and enhance
            clinic operations with the power of AI.
          </p>
          <div className="mt-8 flex gap-4">
            <Button asChild size="lg">
              <Link href="/check-in">Patient Check-in</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/wait-time-predictor">Predict Wait Times</Link>
            </Button>
          </div>
        </div>
      </section>

      <main className="p-4 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <StatCard
            title="Avg. Wait Time"
            value="24m"
            icon={Clock}
            description="+2m from yesterday"
          />
          <StatCard
            title="Patients in Queue"
            value="12"
            icon={Users}
            description="3 high priority"
          />
          <StatCard
            title="Available Doctors"
            value="4"
            icon={Stethoscope}
            description="Dr. Smith is on break"
          />
          <StatCard
            title="Patient Throughput"
            value="15/hr"
            icon={Activity}
            description="Peak hour: 2-4 PM"
          />
        </div>
        <div className="mt-8 grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <QueueTable />
          </div>
          <div>
            <Announcements />
          </div>
        </div>
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Patient Flow</CardTitle>
              <CardDescription>
                Number of patients checked in per hour.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PatientFlowChart />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
