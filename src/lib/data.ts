export type Patient = {
  id: string;
  name: string;
  status: 'Waiting' | 'In-progress' | 'Completed';
  doctor: string;
  waitTime: number;
};

export const queueData: Patient[] = [
  { id: 'PT001', name: 'Liam Johnson', status: 'In-progress', doctor: 'Dr. Miller', waitTime: 5 },
  { id: 'PT002', name: 'Olivia Smith', status: 'Waiting', doctor: 'Dr. Davis', waitTime: 15 },
  { id: 'PT003', name: 'Noah Williams', status: 'Waiting', doctor: 'Dr. Garcia', waitTime: 22 },
  { id: 'PT004', name: 'Emma Brown', status: 'Waiting', doctor: 'Dr. Rodriguez', waitTime: 28 },
  { id: 'PT005', name: 'James Jones', status: 'Completed', doctor: 'Dr. Miller', waitTime: 0 },
  { id: 'PT006', name: 'Ava Garcia', status: 'Waiting', doctor: 'Dr. Davis', waitTime: 35 },
  { id: 'PT007', name: 'Logan Miller', status: 'Completed', doctor: 'Dr. Garcia', waitTime: 0 },
  { id: 'PT008', name: 'Isabella Davis', status: 'Waiting', doctor: 'Dr. Smith', waitTime: 42 },
];

export type Announcement = {
  id: number;
  message: string;
};

export const announcements: Announcement[] = [
  { id: 1, message: 'Flu shots are now available. Please ask the front desk for details.' },
  { id: 2, message: 'The clinic will be closed this coming Saturday. Please plan accordingly.' },
  { id: 3, message: 'Please wear a mask if you are experiencing cough or fever symptoms.' },
  { id: 4, message: 'Welcome to our new practitioner, Dr. Wilson!' },
];

export const chartData = [
  { hour: '8 AM', patients: 5 },
  { hour: '9 AM', patients: 8 },
  { hour: '10 AM', patients: 12 },
  { hour: '11 AM', patients: 15 },
  { hour: '12 PM', patients: 10 },
  { hour: '1 PM', patients: 14 },
  { hour: '2 PM', patients: 18 },
  { hour: '3 PM', patients: 16 },
  { hour: '4 PM', patients: 11 },
];
