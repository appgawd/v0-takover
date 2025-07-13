import { ArrowLeft, MapPin, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default function CreateTakeoverPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 pt-8">
        <Link href="/">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold">Create Takeover</h1>
      </div>

      {/* Form */}
      <div className="px-4 space-y-6 mb-20">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 space-y-4">
            <div>
              <Label htmlFor="title" className="text-sm font-medium">
                Event Title
              </Label>
              <Input
                id="title"
                placeholder="Enter event name..."
                className="mt-1 bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your event..."
                className="mt-1 bg-gray-700 border-gray-600 text-white"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="location" className="text-sm font-medium">
                Location
              </Label>
              <div className="relative mt-1">
                <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  id="location"
                  placeholder="Enter location..."
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date" className="text-sm font-medium">
                  Date
                </Label>
                <Input id="date" type="date" className="mt-1 bg-gray-700 border-gray-600 text-white" />
              </div>
              <div>
                <Label htmlFor="time" className="text-sm font-medium">
                  Time
                </Label>
                <Input id="time" type="time" className="mt-1 bg-gray-700 border-gray-600 text-white" />
              </div>
            </div>

            <div>
              <Label htmlFor="privacy" className="text-sm font-medium">
                Privacy
              </Label>
              <Select>
                <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select privacy level" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="public">Public - Anyone can join</SelectItem>
                  <SelectItem value="invite-only">Invite Only - Approval required</SelectItem>
                  <SelectItem value="members-only">Members Only - Club members only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="max-attendees" className="text-sm font-medium">
                Max Attendees
              </Label>
              <Input
                id="max-attendees"
                type="number"
                placeholder="Leave blank for unlimited"
                className="mt-1 bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <Label className="text-sm font-medium">Event Photo</Label>
            <div className="mt-2 border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
              <Camera className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-400">Tap to add a photo</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Button className="w-full bg-green-600 hover:bg-green-700 py-3">Create Takeover</Button>
          <Button variant="outline" className="w-full border-gray-600 text-gray-300 bg-transparent">
            Save as Draft
          </Button>
        </div>
      </div>
    </div>
  )
}
