import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2 } from "lucide-react";

export default function CommunityPage() {
  return (
    <div className="flex justify-center py-6 md:py-8 px-4 md:px-6">
      <div className="w-full max-w-4xl flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community</h1>
          <p className="text-muted-foreground mt-1">
            Discover and share randomizer projects
          </p>
        </div>

        {/* Community Posts */}
        <div className="grid gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>U{i}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">User {i}</CardTitle>
                    <CardDescription className="text-xs">
                      Posted 2 hours ago
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">
                    Amazing Randomizer Project #{i}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Check out this cool randomizer project I created! It's
                    perfect for making decisions and has lots of customization
                    options.
                  </p>
                </div>
                <div className="flex items-center gap-4 pt-2">
                  <Button variant="ghost" size="sm">
                    <Heart className="mr-1.5 h-4 w-4" />
                    {12 + i}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="mr-1.5 h-4 w-4" />
                    {3 + i}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="mr-1.5 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
