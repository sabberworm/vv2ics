require "appscript"
include Appscript
require "json"
require "time"

js = File.read("get_info.js")

safari = app("Safari")
ical = app("iCal")

current_tab = safari.windows[1].current_tab.get
events = JSON.parse(safari.do_JavaScript(js, in: current_tab))

events.each do |event|
	calendar = ical.calendars[event["calendar"]].get
	event["start_date"] = Time::parse(event["start_date"])
	event["end_date"] = Time::parse(event["end_date"])
	puts event
	# calendar.make(:new => :event, at: calendar.events.end, with_properties: {:summary => event["summary"], :url => event["url"], :start_date => event["start_date"], :end_date => event["end_date"], :location => event["location"], :recurrence => "FREQ=WEEKLY", :description => event["notes"]})
end
