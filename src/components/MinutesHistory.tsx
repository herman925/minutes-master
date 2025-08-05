import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { FileText, Menu, PlusCircle } from '@phosphor-icons/react'
import type { GeneratedMinutes } from '@/types'

interface MinutesHistoryProps {
  meetings: GeneratedMinutes[]
  onNewMeeting: () => void
}

export default function MinutesHistory({ meetings, onNewMeeting }: MinutesHistoryProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="p-2">
          <Menu className="text-muted-foreground" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle className="text-base font-semibold text-muted-foreground uppercase">
            Recent Meetings
          </SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <Button
            onClick={onNewMeeting}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-3 rounded-md text-sm font-semibold flex items-center gap-2 mb-4"
          >
            <PlusCircle className="w-5 h-5" />
            New Meeting
          </Button>
          <ul className="space-y-2 font-medium">
            {meetings.length === 0 && (
              <li className="text-sm text-muted-foreground">No meetings yet</li>
            )}
            {meetings.map(meeting => (
              <li key={meeting.title}>
                <div className="flex items-center p-2 text-foreground rounded-lg hover:bg-accent group cursor-pointer">
                  <FileText className="mr-3" />
                  <span>{meeting.title}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  )
}
