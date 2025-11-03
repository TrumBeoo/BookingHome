# backend/app/services/calendar_sync.py
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from datetime import datetime, timedelta
import asyncio

class CalendarSyncService:
    def __init__(self, credentials):
        self.credentials = Credentials.from_authorized_user_info(credentials)
        self.service = build('calendar', 'v3', credentials=self.credentials)
    
    async def sync_availability(self, calendar_id: str, homestay_id: int, db):
        """
        Sync availability from Google Calendar to homestay
        """
        # Get events from Google Calendar
        now = datetime.utcnow()
        time_min = now.isoformat() + 'Z'
        time_max = (now + timedelta(days=365)).isoformat() + 'Z'
        
        events_result = self.service.events().list(
            calendarId=calendar_id,
            timeMin=time_min,
            timeMax=time_max,
            singleEvents=True,
            orderBy='startTime'
        ).execute()
        
        events = events_result.get('items', [])
        
        synced_count = 0
        
        for event in events:
            start = event['start'].get('dateTime', event['start'].get('date'))
            end = event['end'].get('dateTime', event['end'].get('date'))
            
            # Parse dates
            start_date = datetime.fromisoformat(start.replace('Z', '+00:00')).date()
            end_date = datetime.fromisoformat(end.replace('Z', '+00:00')).date()
            
            # Block dates in availability
            current_date = start_date
            while current_date < end_date:
                availability = db.query(Availability).filter(
                    and_(
                        Availability.homestay_id == homestay_id,
                        Availability.date == current_date
                    )
                ).first()
                
                if not availability:
                    availability = Availability(
                        homestay_id=homestay_id,
                        date=current_date,
                        status='blocked',
                        notes=f"Synced from Google Calendar: {event.get('summary', 'Event')}"
                    )
                    db.add(availability)
                else:
                    availability.status = 'blocked'
                    availability.notes = f"Synced from Google Calendar: {event.get('summary', 'Event')}"
                
                synced_count += 1
                current_date += timedelta(days=1)
        
        db.commit()
        return synced_count
    
    async def export_to_calendar(self, calendar_id: str, booking, db):
        """
        Export booking to Google Calendar
        """
        event = {
            'summary': f'Booking: {booking.booking_code}',
            'description': f'Guest: {booking.guest_info.get("fullName", "N/A")}\nGuests: {booking.guests}',
            'start': {
                'date': booking.check_in.isoformat(),
                'timeZone': 'Asia/Ho_Chi_Minh',
            },
            'end': {
                'date': booking.check_out.isoformat(),
                'timeZone': 'Asia/Ho_Chi_Minh',
            },
            'reminders': {
                'useDefault': False,
                'overrides': [
                    {'method': 'email', 'minutes': 24 * 60},
                    {'method': 'popup', 'minutes': 60},
                ],
            },
        }
        
        created_event = self.service.events().insert(
            calendarId=calendar_id, 
            body=event
        ).execute()
        
        # Store calendar event ID in booking
        booking.calendar_event_id = created_event['id']
        db.commit()
        
        return created_event['htmlLink']

# API endpoint for calendar sync
@router.post("/sync-calendar/{homestay_id}")
async def sync_with_calendar(
    homestay_id: int,
    config: CalendarSyncConfig,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Sync homestay availability with external calendar (Google/Outlook)
    """
    # Validate homestay ownership
    homestay = db.query(Homestay).filter(Homestay.id == homestay_id).first()
    if not homestay:
        raise HTTPException(status_code=404, detail="Homestay not found")
    
    try:
        if config.provider == 'google':
            # Get Google Calendar credentials from user settings
            # This would be stored securely after OAuth flow
            credentials = current_user.google_calendar_credentials
            
            if not credentials:
                raise HTTPException(
                    status_code=400, 
                    detail="Google Calendar not connected. Please authorize first."
                )
            
            sync_service = CalendarSyncService(credentials)
            synced_count = await sync_service.sync_availability(
                config.calendar_id,
                homestay_id,
                db
            )
            
            return {
                "success": True,
                "message": f"Synced {synced_count} dates from Google Calendar",
                "provider": "google",
                "synced_count": synced_count
            }
        
        elif config.provider == 'outlook':
            # Similar implementation for Outlook
            pass
        
        else:
            raise HTTPException(status_code=400, detail="Unsupported calendar provider")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sync failed: {str(e)}")