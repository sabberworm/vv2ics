# vv2ics

Get data from Unibas Vorlesungsverzeichnis into iCal

## Usage

* Define your calendars in get_info.js.
* Open Safari and navigate to the desired detail page on http://vorlesungsverzeichnis.unibas.ch/
* Run `ruby vv2ics`.

## Dependencies

* Ruby 1.9
* `appscript` gem
* `json` parser gem

## Known Bugs

* Needs Safari (could be re-implemented using Nokogiri)
* Only works on Mac OS X
