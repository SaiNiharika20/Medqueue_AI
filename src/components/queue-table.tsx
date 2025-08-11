import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { queueData, type Patient } from '@/lib/data';
import { cn } from '@/lib/utils';

export function QueueTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Queue</CardTitle>
        <CardDescription>Real-time view of patients waiting.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Wait Time</TableHead>
              <TableHead>Assigned Doctor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queueData.map((patient: Patient) => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium">{patient.name}</TableCell>
                <TableCell>
                  <Badge
                    className={cn({
                      'bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30': patient.status === 'Waiting',
                      'bg-blue-500/20 text-blue-700 hover:bg-blue-500/30': patient.status === 'In-progress',
                      'bg-green-500/20 text-green-700 hover:bg-green-500/30': patient.status === 'Completed',
                    })}
                  >
                    {patient.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {patient.status !== 'Completed' ? `${patient.waitTime} min` : '-'}
                </TableCell>
                <TableCell>{patient.doctor}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
