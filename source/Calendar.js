/**
	_moon.CalendarDate_ implements a control representing a single day, used by
	the monthly calendar kind [moon.Calendar](#moon.Calendar).
*/
enyo.kind({
	name: "moon.CalendarDate",
	kind: "moon.Button",
	//* @protected
	small: true,
	marquee: false,
	minWidth: false,
	classes: "moon-calendar-picker-date enyo-unselectable",
	//* @public
	published: {
		value: null,
		color: 0
	},
	events: {
		onDateSelected:""
	},
	//* @protected
	create: function() {
		this.inherited(arguments);
		if (typeof ilib !== "undefined") {
			this._tf = new ilib.DateFmt({
				type: "date",	//only format the date component, not the time
				date: "d",		//'d' is the date of month
				length: "short"	//it uses 2 chars to abbreviate properly
			});
		}
	},
	colorChanged: function(inOld) {
		this.addRemoveClass("moon-calendar-picker-date-shadow", this.color);
	},
	valueChanged: function() {
		if (typeof ilib !== "undefined") {
			var date = ilib.Date.newInstance({unixtime: (this.value.getDate() - 1) * (24*60*60*1000)});
			this.setContent(this._tf.format(date));
		} else {
			this.setContent(this.value.getDate());
		}
	},
	tap: function() {
		this.doDateSelected();
	}
});
/**
	_moon.Calendar_ is a control that displays a monthly calendar, with the
	month name at the top and a grid of days, grouped into rows by week, below.

	The header buttons are used to navigate to the desired month; the desired day
	is selected by tapping on it.

		{kind: "moon.Calendar", content: "Calendar Title"}
*/
enyo.kind({
	name: "moon.Calendar",
	classes: "moon-calendar-picker",
	//* @public
	events: {
		/**
			Fires when the date changes.

			_inEvent.name_ contains the name of this control.

			_inEvent.value_ contains a standard JavaScript Date object representing
			the current date.
		*/
		onChange: ""
	},
	published: {
		/**
			Current locale used for formatting. May be set after the control is
			created, in which case the control will be updated to reflect the
			new value.  Only valid if _ilib_ is loaded.
		*/
		locale: "",
		/**
			The current Date object. When a Date object is passed to _setValue()_,
			the control is updated to reflect the new value. _getValue()_ returns
			a Date object.
		*/
		value: null,
		/**
			The first day of the week in the current locale.
			Valid values are Sunday (0) through Saturday (6). Default is Sunday (0).
		*/
		firstDayOfWeek: 0,
		/**
			Maximum number of weeks to display on a screen.
			If this value is greater than 9, dates two months in the future may be
			shown. Unexpected input may result in errors.
		*/
		maxWeeks: 6,
		/**
			Start value for range of years displayed in year picker
		*/
		startYear: 1900,
		/**
			End value for range of years displayed in year picker
		*/
		endYear: 2200,
		/**
			CSS classes used to decorate day labels (e.g., _"moon-divider"_)
		*/
		dayOfWeekClasses: "",
		/**
			Length of abbreviation to use for day of the week.
			Accepted values are _"short"_, _"medium"_, _"long"_, and _"full"_.
			Only valid if _ilib_ is loaded.
		*/
		dayOfWeekLength: "short"
	},
	//*@protected
	months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	days: ["S","M","T","W","T","F","S"],
	components: [
		{name: "monthPicker", kind: "moon.SimplePicker", classes: "moon-calendar-picker-month", onChange: "selectMonthPicker"},
		{name: "yearPicker", kind: "moon.SimplePicker", classes: "moon-calendar-picker-year", onChange: "selectYearPicker"},
		{name: "days", classes: "moon-calendar-picker-days moon-neutral", kind: "enyo.Group"},
		{name: "dates", kind: "enyo.Group"}
	],
	create: function() {
		this.inherited(arguments);
		this.initYearPicker(this.startYear, this.endYear);
		this.initMonthPicker();
		this.initDays();
		this.initCalendar();

		if (typeof ilib !== "undefined") {
			this._tf = new ilib.DateFmt({
				type: "date",	//only format the date component, not the time
				date: "w",		//'w' is the day of the week
				length: this.dayOfWeekLength
			});
			this.setLocale(new ilib.LocaleInfo().locale);
		} else {
			this.initDefaults();
		}
	},
	initDefaults: function() {
		this.setValue(this.value || new Date());
		//Attempt to use the ilib lib (assuming that it is loaded)
		if (typeof ilib !== "undefined") {
			this.firstDayOfWeek = new ilib.LocaleInfo(this.locale).getFirstDayOfWeek();
		}
		this.firstDayOfWeekChanged();
	},
	/**
		Populates SimplePicker with years.
	*/
	initYearPicker: function(startYear, endYear) {
		for (var i = startYear; i <= endYear; i++) {
			this.$.yearPicker.createComponent(
				{content: i, classes: "picker-content"}
			);
		}
	},
	/**
		Populates SimplePicker with months of the year, from JAN to DEC.
	*/
	initMonthPicker: function() {
		var months = this.months;
		for (var i = 0; i < 12; i++) {
			this.$.monthPicker.createComponent(
				{content: months[i], classes: "picker-content"}
			);
		}
	},
	/**
		Initializes days of the week from first to last.
		Initially, SUN is the first day of the week and SAT is the last.
	*/
	initDays: function() {
		for(var i = 0; i < 7; i++) {
			this.$.days.createComponent({
				classes: "moon-calendar-picker-day-base " + (this.dayOfWeekClasses || "moon-calendar-picker-day"),
				disabled: true
			});
		}
	},
	/**
		Populates Calendar with CalendarDate objects.
	*/
	initCalendar: function() {
		if (!this.$.dates.controls.length) {
			for (var i = 1; i <= this.maxWeeks * 7; i++) {
				this.$.dates.createComponent({kind: "moon.CalendarDate", onDateSelected:"selectDate"}, {owner:this});
			}
		}
	},
	parseDate: function() {
		if (this._tf) {
			return this._tf.format(new ilib.Date.GregDate({unixtime: this.value.getTime(), timezone:"UTC"}));
		} else {
			return this.months[this.value.getMonth()] + " " + this.value.getDate() + ", " + this.value.getFullYear();
		}
	},
	/**
		Updates month name displayed in month picker.
	*/
	updateMonthPicker: function() {
		if (typeof ilib !== "undefined") {
			var fmt = new ilib.DateFmt({
				locale: this.locale,
				type: "date",	//only format the date component, not the time
				date: "m",		//'m' is the month of year
				length: "long"
			});
			var monthPickerControls = this.$.monthPicker.getClientControls();
			for (var i = 0; i < 12; i++) {
				var date = ilib.Date.newInstance({
					type: fmt.getCalendar(),
					unixtime: i * 31 * (24*60*60*1000)
				});
				monthPickerControls[i].setContent(fmt.format(date));
			}
		}
	},
	/**
		Updates days of the week from first day to last day.
	*/
	updateDays: function() {
		var daysControls = this.$.days.getClientControls();
		for(var i = 0; i < 7; i++) {
			if (typeof ilib !== "undefined") {
				var date = ilib.Date.newInstance({
					type: this._tf.getCalendar(),
					unixtime: i*(24*60*60*1000) + this._firstTime
				});
				var day = this._tf.format(date);
				daysControls[i].setContent(day);
			} else {
				daysControls[i].setContent(this.days[(this.firstDayOfWeek + i) % 7]);
			}
		}
	},
	/**
		Sets up first week of this month.
		Before the first day of this month, days from the previous month will be
		used to fill the calendar.
	*/
	updatePrevMonth: function() {
		var value = this.value;
		var dt = new Date(value.getFullYear(), value.getMonth(), value.getDate());
		dt.setDate(0);
		var thisYear = dt.getFullYear(),
			datesOfPrevMonth = dt.getDate(),
			dayOfLastDate = dt.getDay() - this.firstDayOfWeek,
			prevMonth = dt.getMonth();
		if (dayOfLastDate < 0) {
			dayOfLastDate += 7;
		}
		if (dayOfLastDate !== 6) {
			var dates = this.$.dates.getControls();
			for (var i = 0; i <= dayOfLastDate; i++) {
				dates[i].setValue(new Date(thisYear, prevMonth, datesOfPrevMonth - dayOfLastDate + i));
				dates[i].setColor(1);
			}
			return i;
		}
		return 0;
	},
	/**
		Sets up last week of this month.
		After the last day of this month, days from the next month will be used to
		fill the calendar.
	*/
	updateNextMonth: function(startIndex) {
		var value = this.value;
		var dt = new Date(value.getFullYear(), value.getMonth(), value.getDate());
		dt.setMonth(dt.getMonth() + 1);
		var thisYear = dt.getFullYear(),
			nextMonth = dt.getMonth();
		var dates = this.$.dates.getControls();
		for (var i = 0; i < this.$.dates.controls.length - startIndex; i++) {
			dates[startIndex + i].setValue(new Date(thisYear, nextMonth, i + 1));
			dates[startIndex + i].setColor(1);
		}
	},
	updateDates: function() {
		var datesOfPrevMonth = this.updatePrevMonth();

		var thisYear = this.value.getFullYear(),
			thisMonth = this.value.getMonth();
		var	monthLength = this.getMonthLength(thisYear, thisMonth);
		var dates = this.$.dates.getControls();
		for (var i = 0; i < monthLength; i++) {
			dates[datesOfPrevMonth + i].setValue(new Date(thisYear, thisMonth, i + 1));
			dates[datesOfPrevMonth + i].setColor(0);
		}
		this.$.dates.setActive(dates[datesOfPrevMonth - 1 + this.value.getDate()]);
		this.updateNextMonth(datesOfPrevMonth + monthLength);
	},
	setYear: function(newYear) {
		if (this.value.getYear() != newYear) {
			var value = this.value,
				newValue,
				newMonthLength = this.getMonthLength(newYear, value.getMonth());
			if(newMonthLength < value.getDate()) {
				newValue = new Date(newYear, value.getMonth(), newMonthLength);
			} else {
				newValue = new Date(newYear, value.getMonth(), value.getDate());
			}
			this.setValue(newValue);
		}
	},
	setMonth: function(newMonth) {
		if (this.value.getMonth() != newMonth) {
			var value = this.value,
				newValue,
				newMonthLength = this.getMonthLength(value.getFullYear(), newMonth);
			if(newMonthLength < value.getDate()) {
				newValue = new Date(value.getFullYear(), newMonth, newMonthLength);
			} else {
				newValue = new Date(value.getFullYear(), newMonth, value.getDate());
			}
			this.setValue(newValue);
		}
	},
	setDate: function(newDate) {
		var value = this.value,
			newValue,
			monthLength = this.getMonthLength(value.getFullYear(), value.getMonth());
		if(monthLength < newDate) {
			newValue = new Date(value.getFullYear(), value.getMonth(), monthLength);
		} else {
			newValue = new Date(value.getFullYear(), value.getMonth(), newDate);
		}
		this.setValue(newValue);
	},
	/**
		Responds to selection of a particular CalendarDate.
	*/
	selectDate: function(inSender, inEvent) {
		var newValue = inEvent.originator.value;
		this.setValue(newValue);
		return true;
	},
	/**
		Responds to change of year in year picker.
	*/
	selectYearPicker: function(inSender, inEvent) {
		var year = this.$.yearPicker.getSelected().getContent();
		this.setYear(year);
	},
	/**
		Responds to change of month in month picker.
	*/
	selectMonthPicker: function(inSender, inEvent) {
		var month = this.$.monthPicker.getSelectedIndex();
		this.setMonth(month);
	},
	/**
		Returns number of days in a particular month/year.
	*/
	getMonthLength: function(inYear, inMonth) {
		if (typeof ilib !== "undefined") {
			var d = ilib.Date.newInstance({unixtime: this.value.getTime()});
			var cal = ilib.Cal.newInstance({name: d.getCalendar()});
			return cal.getMonLength(inMonth + 1, inYear);
		} else {
			return 32 - new Date(inYear, inMonth, 32).getDate();
		}
	},
	localeChanged: function() {
		if (typeof ilib !== "undefined") {
			this._tf = new ilib.DateFmt({
				locale: this.locale,
				type: "date",	//only format the date component, not the time
				date: "w",		//'w' is the day of the week
				length: this.dayOfWeekLength
			});
		}
		this.updateMonthPicker();
		this.initDefaults();
		this.doChange({value: this.value});
	},
	valueChanged: function(inOld) {
		if(isNaN(this.value) || this.value === null) {
			this.setValue(new Date());
			return;
		}
		if (!this.generated || this.$.monthPicker.getSelectedIndex() != this.value.getMonth()) {
			this.$.monthPicker.setSelectedIndex(this.value.getMonth());
		}
		if (!this.generated || this.$.yearPicker.getSelected().getContent() != this.value.getFullYear()) {
			this.$.yearPicker.setSelectedIndex(this.value.getFullYear() - this.startYear);
		}
		this.updateDates();
		if (this.value) {
			this.doChange({value: this.value});
		}
	},
	/**
		Switches CSS classes when the user (or developer) changes the day label
		style dynamically.
	*/
	dayOfWeekClassesChanged: function(inOld) {
		var dayControls = this.$.days.getClientControls();
		for (var i = 0; i < dayControls.length; i++) {
			dayControls[i].removeClass(inOld || "moon-calendar-picker-day");
			dayControls[i].addClass(this.dayOfWeekClasses || "moon-calendar-picker-day");
		}
	},
	dayOfWeekLengthChanged: function() {
		if (typeof ilib !== "undefined") {
			this._tf = new ilib.DateFmt({
				locale: this.locale,
				type: "date",	//only format the date component, not the time
				date: "w",		//'w' is the day of the week
				length: this.dayOfWeekLength
			});
			this.updateDays();
		}
	},
	/**
		Sometimes the first day of week changes because of a locale change.
		When this happens, we destroy the day label and reconstruct it.
		We create a new _ilib.Date_ instance with the time of the given day, and get
		a Gregorian date instance that represents the first day of the week.
	*/
	firstDayOfWeekChanged: function() {
		if (typeof ilib !== "undefined") {
			var d = ilib.Date.newInstance({unixtime: this.value.getTime()});
			var firstDate = d.onOrBefore(this.firstDayOfWeek);
			this._firstTime = firstDate.getTime();	//get unix time
		}
		this.updateDays();
		this.updateDates();
	}
});