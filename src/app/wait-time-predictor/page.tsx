"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { predictWaitTime, type PredictWaitTimeOutput } from "@/ai/flows/predict-wait-time";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Rocket, Lightbulb, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  currentPatientLoad: z.coerce.number().min(0, "Patient load cannot be negative."),
  staffingLevels: z.coerce.number().min(1, "There must be at least one staff member."),
  timeOfDay: z.string().nonempty("Time of day is required."),
  dayOfWeek: z.string().nonempty("Day of week is required."),
  patientAcuity: z.string().min(10, "Acuity description is too short.").max(200),
});

const historicalDataPlaceholder = `Monday, 9 AM: 15 patients, 5 staff, avg wait 20 min.
Monday, 2 PM: 25 patients, 5 staff, avg wait 45 min.
Tuesday, 10 AM: 12 patients, 6 staff, avg wait 15 min.
... (more data) ...`;

export default function WaitTimePredictorPage() {
  const [prediction, setPrediction] = useState<PredictWaitTimeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPatientLoad: 12,
      staffingLevels: 4,
      timeOfDay: new Date().toTimeString().slice(0,5),
      dayOfWeek: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
      patientAcuity: "Mix of routine check-ups and minor illnesses.",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setPrediction(null);
    try {
      const result = await predictWaitTime({
        ...values,
        historicalData: historicalDataPlaceholder,
      });
      setPrediction(result);
    } catch (error) {
      console.error("Prediction failed:", error);
      toast({
        title: "Error",
        description: "Failed to get a prediction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex-1 p-4 md:p-8">
       <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">AI Wait Time Predictor</h1>
            <p className="text-muted-foreground mt-2">
                Use our AI to forecast patient wait times based on current conditions.
            </p>
        </div>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Prediction Inputs</CardTitle>
                <CardDescription>Adjust the parameters to generate a new prediction.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="currentPatientLoad" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Current Patient Load</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="staffingLevels" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Staffing Levels</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="timeOfDay" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Time of Day</FormLabel>
                                <FormControl><Input type="time" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="dayOfWeek" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Day of Week</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a day" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                                            <SelectItem key={day} value={day}>{day}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </div>
                    <FormField control={form.control} name="patientAcuity" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Patient Acuity</FormLabel>
                            <FormControl><Textarea placeholder="Describe the general patient condition..." {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Predicting..." : "Predict Wait Time"}
                    </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
        <div className="flex items-center justify-center">
            {isLoading ? (
                 <div className="flex flex-col items-center gap-4 text-muted-foreground">
                    <Rocket className="h-16 w-16 animate-pulse" />
                    <p className="text-lg">AI is crunching the numbers...</p>
                 </div>
            ) : prediction ? (
                <Card className="w-full bg-accent/20">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Prediction Result</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <div className="flex items-center justify-center gap-2 text-6xl font-bold text-primary">
                            <Clock className="h-12 w-12"/>
                            {prediction.predictedWaitTimeMinutes}
                            <span className="text-4xl text-muted-foreground">min</span>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">Confidence Level: <strong>{prediction.confidenceLevel}</strong></p>
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-2 text-sm">
                        <div className="flex items-center gap-2 font-semibold">
                            <Lightbulb className="h-5 w-5"/>
                            Rationale
                        </div>
                        <p className="text-muted-foreground">{prediction.rationale}</p>
                    </CardFooter>
                </Card>
            ) : (
                <div className="flex flex-col items-center gap-4 text-muted-foreground text-center">
                    <Rocket className="h-16 w-16" />
                    <p className="text-lg">Your prediction will appear here.</p>
                    <p className="text-sm">Fill out the form and click "Predict Wait Time" to start.</p>
                </div>
            )}
        </div>
      </div>
    </main>
  );
}
