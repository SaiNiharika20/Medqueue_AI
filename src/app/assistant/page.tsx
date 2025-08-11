"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getQueueStatusAndFAQ, type GetQueueStatusAndFAQOutput } from "@/ai/flows/voice-assistant-updates";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Bot, User, Mic, Volume2 } from "lucide-react";

const formSchema = z.object({
  patientId: z.string().regex(/^PT\d{3}$/, "Please enter a valid Patient ID (e.g., PT001)."),
  query: z.string().min(5, "Query must be at least 5 characters long.").max(150),
});

export default function AssistantPage() {
  const [response, setResponse] = useState<GetQueueStatusAndFAQOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: "PT002",
      query: "What is my current wait time?",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResponse(null);
    setCurrentQuery(values.query);

    try {
      const result = await getQueueStatusAndFAQ(values);
      setResponse(result);
    } catch (error) {
      console.error("Assistant failed:", error);
      toast({
        title: "Error",
        description: "Failed to get a response from the assistant. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex-1 p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">AI Voice Assistant</h1>
            <p className="text-muted-foreground mt-2">
                Get queue updates and ask questions using our AI assistant.
            </p>
        </div>

        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Ask a Question</CardTitle>
                    <CardDescription>Enter your patient ID and your question below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="patientId" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Patient ID</FormLabel>
                                <FormControl><Input placeholder="e.g., PT001" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="query" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Your Question</FormLabel>
                                <FormControl><Textarea placeholder="e.g., How much longer until I see the doctor?" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Getting Answer..." : "Submit Question"}
                        </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {(isLoading || response) && (
                 <Card>
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex items-start gap-4">
                            <Avatar className="w-10 h-10 border">
                                <AvatarFallback><User /></AvatarFallback>
                            </Avatar>
                            <div className="rounded-lg bg-muted p-3">
                                <p className="font-semibold">You</p>
                                <p>{currentQuery}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <Avatar className="w-10 h-10 border bg-primary text-primary-foreground">
                                <AvatarFallback><Bot /></AvatarFallback>
                            </Avatar>
                            <div className="rounded-lg bg-primary/10 p-3 flex-1">
                                <p className="font-semibold text-primary">AI Assistant</p>
                                {isLoading ? (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Mic className="h-4 w-4 animate-pulse" />
                                        <span>Thinking...</span>
                                    </div>
                                ) : response ? (
                                    <>
                                        <p>{response.response}</p>
                                        {response.audio && (
                                            <div className="mt-4">
                                                <audio controls autoPlay src={response.audio} className="w-full">
                                                    Your browser does not support the audio element.
                                                </audio>
                                            </div>
                                        )}
                                    </>
                                ) : null}
                            </div>
                        </div>
                    </CardContent>
                 </Card>
            )}
        </div>
      </div>
    </main>
  );
}

function Avatar({children, className}: {children: React.ReactNode, className?: string}) {
    return (
        <div className={`rounded-full flex items-center justify-center ${className}`}>
            {children}
        </div>
    )
}

function AvatarFallback({children}: {children: React.ReactNode}) {
    return (
        <div className="flex items-center justify-center w-full h-full">
            {children}
        </div>
    )
}
