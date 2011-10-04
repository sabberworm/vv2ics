String.prototype.trim = function() {
	return this.replace(/^(\s\n)+|(\s\n)+$/g,"");
};

var url_prototype = 'http://vorlesungsverzeichnis.unibas.ch/vvo_show_Detail.cfm?clear=1&eobjectDetail=%id';
var days = {Montag: 1, Dienstag: 2, Mittwoch: 3, Donnerstag: 4, Freitag: 5, Samstag: 6, Sonntag: 0};
var calendars = ['Philosophie', 'Informatik'];
var i;

var time_list = document.evaluate('//td[@class="tddetailbold" and text()="Zeit"]', document.documentElement, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null).iterateNext().nextSibling.childNodes;
var counter = 0;
var times = [];
for(i=0;i<time_list.length;i++) {
	if(time_list[i].nodeType === Node.TEXT_NODE) {
		if(times[counter]) {
			times[counter] += time_list[i].nodeValue.trim();
		} else {
			times[counter] = time_list[i].nodeValue.trim();
		}
	} else if(time_list[i].tagName.toLowerCase() === 'a') {
		time_list[i].normalize();
		times[counter] += " "+time_list[i].childNodes[0].nodeValue.trim();
	} else {
		counter++;
	}
}
times = times.slice(0, -1);

var first_date = document.evaluate('//td[@class="tddetailbold" and text()="Beginndatum"]', document.documentElement, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null).iterateNext().nextSibling.textContent.split(/\./);
first_date = new Date(parseInt(first_date[2], 10), parseInt(first_date[1], 10)-1, parseInt(first_date[0], 10));

var modules = document.evaluate('//td[@class="tddetailbold" and text()="Module"]', document.documentElement, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null).iterateNext().nextSibling.textContent;
var calendar = 'Außerfakultärer Bereich';
for(i=0;i<calendars.length;i++) {
	if(modules.indexOf(calendars[i]) > -1) {
		calendar = calendars[i];
		break;
	}
}
var title = document.evaluate('//div[@class="conttext"]/h2/text()', document.documentElement, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null).iterateNext().nodeValue.trim();
title = title.substr(title.lastIndexOf(' ')+1);
var id = window.location.search;
if(id.indexOf('DID=') > -1) {
	id = id.substr(id.indexOf('DID=')+4);
} else {
	id = id.substr(id.indexOf('eobjectDetail=')+14);
}
if(id.indexOf('&') > -1) {
	id = id.substr(0, id.indexOf('&'));
}
url = url_prototype.replace(/%id/g, id);

var entries = [];
var notes = "";

for(i=0;i<times.length;i++) {
	try {
		var time = times[i];
		var day = time.substr(0, time.indexOf(',')).trim();
		if(!days[day]) {
			notes += times[i];
			continue;
		}
		day = days[day];
		time = time.substr(time.indexOf(',')+1);
	
		var start_time = time.substr(0, time.indexOf('-')).trim().split(/\./);
		start_time = [parseInt(start_time[0], 10), parseInt(start_time[1], 10)];
		if(isNaN(start_time[0]) || isNaN(start_time[1])) {
			notes += times[i];
			continue;
		}
		time = time.substr(time.indexOf('-')+1);
		
		var day_offset = day - first_date.getDay();
		while(day_offset < 0) {
			day_offset += 7;
		}
	
		var start_time_date = new Date(first_date.getTime());
		start_time_date.setDate(start_time_date.getDate()+day_offset);
		start_time_date.setHours(start_time[0]);
		start_time_date.setMinutes(start_time[1]);
	
		var end_time = time.substr(0, time.indexOf(' ')).trim().split(/\./);
		end_time = [parseInt(end_time[0], 10), parseInt(end_time[1], 10)];
		if(isNaN(end_time[0]) || isNaN(end_time[1])) {
			notes += times[i];
			continue;
		}
		time = time.substr(time.indexOf(' ')+1);
	
		var end_time_date = new Date(start_time_date.getTime());
		end_time_date.setHours(end_time[0]);
		end_time_date.setMinutes(end_time[1]);
	
		time = time.trim();
	
		entries.push({start_date: start_time_date, end_date: end_time_date, location: time, url: url, summary: title, calendar: calendar});
	} catch (e) {}
}

for(i=0;i<entries.length;i++) {
	entries[i].notes = notes;
}

JSON.stringify(entries);
