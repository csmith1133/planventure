import { useEffect, useState } from 'react';
import './WorldClocks.css';

interface TimeZone {
  city: string;
  state?: string;
  country: string;
  timezone: string;
  abbr: string;
}

interface TimeInfo {
  time: string;
  date: string;
  diff: string;
}

const timeZones: TimeZone[] = [
  { city: 'Honolulu', state: 'Hawaii', country: 'USA', timezone: 'Pacific/Honolulu', abbr: 'HST' },
  { city: 'Anchorage', state: 'Alaska', country: 'USA', timezone: 'America/Anchorage', abbr: 'AKDT' },
  { city: 'Los Angeles', state: 'California', country: 'USA', timezone: 'America/Los_Angeles', abbr: 'PST' },
  { city: 'Denver', state: 'Colorado', country: 'USA', timezone: 'America/Denver', abbr: 'MT' },
  { city: 'Chicago', state: 'Illinois', country: 'USA', timezone: 'America/Chicago', abbr: 'CT' },
  { city: 'New York', state: 'New York', country: 'USA', timezone: 'America/New_York', abbr: 'ET' },
  { city: 'São Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo', abbr: 'BRT' },
  { city: 'Reykjavik', country: 'Iceland', timezone: 'Atlantic/Reykjavik', abbr: 'GMT' },
  { city: 'London', country: 'United Kingdom', timezone: 'Europe/London', abbr: 'BST' },
  { city: 'Paris', country: 'France', timezone: 'Europe/Paris', abbr: 'CET' },
  { city: 'Cairo', country: 'Egypt', timezone: 'Africa/Cairo', abbr: 'EET' },
  { city: 'Istanbul', country: 'Turkey', timezone: 'Europe/Istanbul', abbr: 'TRT' },
  { city: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai', abbr: 'GST' },
  { city: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata', abbr: 'IST' },
  { city: 'Dhaka', country: 'Bangladesh', timezone: 'Asia/Dhaka', abbr: 'BST' },
  { city: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok', abbr: 'ICT' },
  { city: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', abbr: 'SGT' },
  { city: 'Hong Kong', country: 'China', timezone: 'Asia/Hong_Kong', abbr: 'HKT' },
  { city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', abbr: 'JST' },
  { city: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul', abbr: 'KST' },
  { city: 'Darwin', state: 'Northern Territory', country: 'Australia', timezone: 'Australia/Darwin', abbr: 'ACST' },
  { city: 'Sydney', state: 'New South Wales', country: 'Australia', timezone: 'Australia/Sydney', abbr: 'AEST' },
  { city: 'Auckland', country: 'New Zealand', timezone: 'Pacific/Auckland', abbr: 'NZST' },
  { city: 'UTC', country: 'Universal Time', timezone: 'UTC', abbr: 'UTC' }
];

export default function WorldClocks() {
  const [times, setTimes] = useState<{ [key: string]: TimeInfo }>({});
  const [localTimezone, setLocalTimezone] = useState<string>('');

  useEffect(() => {
    // Get user's local timezone
    setLocalTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);

    const updateTimes = () => {
      const newTimes: { [key: string]: TimeInfo } = {};
      const localTime = new Date();
      
      timeZones.forEach(({ timezone }) => {
        if (timezone === 'UTC') {
          // Get UTC time directly
          const utcNow = new Date();
          const time = utcNow.toLocaleTimeString('en-US', {
            timeZone: 'UTC',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          });
          
          const date = utcNow.toLocaleDateString('en-US', {
            timeZone: 'UTC',
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          });

          const diffHours = Math.round(localTime.getTimezoneOffset() / 60);
          const diff = diffHours === 0 ? 'Local time' : `${diffHours > 0 ? '+' : ''}${diffHours}h`;

          newTimes[timezone] = { time, date, diff };
        } else {
          let time, date;
          
          time = new Date().toLocaleTimeString('en-US', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          });
          date = new Date().toLocaleDateString('en-US', {
            timeZone: timezone,
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          });
          

          // Calculate time difference
          const targetTime = timezone === 'UTC' 
            ? new Date(new Date().toISOString()) 
            : new Date(new Date().toLocaleString('en-US', { timeZone: timezone }));
          
          const diffHours = Math.round((targetTime.getTime() - localTime.getTime()) / (1000 * 60 * 60));
          
          const diff = diffHours === 0 
            ? 'Local time'
            : `${diffHours > 0 ? '+' : ''}${diffHours}h`;

          newTimes[timezone] = { time, date, diff };
        }
      });
      setTimes(newTimes);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="world-clocks">
      <div className="clocks-grid">
        {timeZones.map(({ city, state, country, timezone, abbr }) => (
          <div key={timezone} className={`clock-card ${timezone === localTimezone ? 'local-time' : ''}`}>
            <div className="clock-main">
              <div className="clock-time">{times[timezone]?.time}</div>
              <div className="clock-location">
                <span className="city-name">{city}</span>
                <span className="zone-diff">
                  <span>{abbr}</span>
                  <span className="diff">{times[timezone]?.diff}</span>
                </span>
              </div>
              <div className="location-details">{state ? `${state}, ${country}` : country}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
