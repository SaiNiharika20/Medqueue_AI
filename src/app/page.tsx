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
import { Clock, Users, Stethoscope, Activity } from 'lucide-react';

export default function DashboardPage() {
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8">
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
  );
}
