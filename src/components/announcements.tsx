import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { announcements } from '@/lib/data';
import { Megaphone } from 'lucide-react';

export function Announcements() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Announcements</CardTitle>
        <CardDescription>Important updates for our patients.</CardDescription>
      </CardHeader>
      <CardContent>
        <Carousel className="w-full">
          <CarouselContent>
            {announcements.map((announcement) => (
              <CarouselItem key={announcement.id}>
                <div className="p-1">
                  <div className="flex aspect-video flex-col items-center justify-center rounded-lg bg-secondary p-6 text-center">
                    <Megaphone className="h-12 w-12 text-secondary-foreground/50 mb-4" />
                    <p className="text-lg font-medium text-secondary-foreground">
                      {announcement.message}
                    </p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </CardContent>
    </Card>
  );
}
