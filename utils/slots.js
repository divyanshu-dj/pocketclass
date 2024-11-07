import moment from "moment";



export const generateHourlySlotsForDate = (
	slotDate,
	scheduleData,
	appointments,
	check = false,
	allClassStudent
  ) => {
	const slots = [];
	const selectedDate = moment(slotDate).format("YYYY-MM-DD");
	const startDate = moment(`${selectedDate} 00:00`);
	const endDate = moment(`${selectedDate} 23:59`);
  
	while (startDate.isBefore(endDate)) {
	  const startHour = startDate.toDate();
	  const endHour = startDate.isSame(moment(`${selectedDate} 23:00`))
		? startDate.add(59, "minutes").toDate()
		: startDate.add(1, "hour").toDate();
  
	  const formattedStart = moment(startHour).utcOffset(-300)
		.format('ddd MMM DD YYYY HH:mm:ss [GMT]-0500 [(]Eastern Standard Time[)]');
  
	  const slot = {
		label: `${moment(startHour).format("h:mm A")} - ${moment(endHour).format("h:mm A")}`,
		start: formattedStart,
		end: endHour,
		isAvailable: false
	  };
  
	  const hasAvailableSlot = scheduleData?.some(schedule => 
		schedule.availability?.some(timeSlot => {
		  const slotStart = timeSlot?.start?.toDate ? timeSlot.start.toDate() : new Date(timeSlot.start);
		  return moment(slotStart).isSame(startHour, 'hour') && timeSlot.availability;
		})
	  );
  
	  if (
		check &&
		hasAvailableSlot &&
		!isAppointmentOverlapping(
		  getDateList(appointments),
		  startHour,
		  endHour,
		  allClassStudent
		)
	  ) {
		slot.isAvailable = true;
	  }
  
	  slots.push(slot);
	}
  
	return slots;
  };

export const isAppointmentOverlapping = (appointments, newStart, newEnd, allClassStudent) => {
	return appointments?.some?.((appointment) => {
		const appointmentStart = moment(appointment.start);
		const appointmentEnd = moment(appointment.end);

		// Check if the appointment overlaps and if the classStudents match allClassStudent
		const isOverlapping = (
			(moment(newStart).isSameOrAfter(appointmentStart) && moment(newStart).isBefore(appointmentEnd)) ||
			(moment(newEnd).isSameOrBefore(appointmentEnd) && moment(newEnd).isAfter(appointmentStart))
		);
		if(allClassStudent > 0){
			return isOverlapping && appointment.classStudents == allClassStudent;
		}else{
			return isOverlapping;
		}

		// Return true if it overlaps and the classStudents match allClassStudent
	});
};



export const alreadyHasAvailability = (availability, newStart) => {
	return availability?.some?.((avl) => {
		const date = moment(avl?.date?.toDate?.());
		return moment(newStart)?.isSame(date);
	});
};

export const getFlatList = (list) => {
	const flattenedList = list?.reduce?.((accumulator, currentValue) => {
	  return accumulator?.concat?.(currentValue.availability);
	}, []);
	
	const finalList = flattenedList?.filter(a => a.availability)?.map?.((a) => ({
	  ...a,
	  start: a?.start?.toDate?.() || new Date(a?.start),
	  end: a?.end?.toDate?.() || new Date(a?.end),
	}));
  
	return finalList;
  };
  

export const getDateList = (list) => {
  const finalList = list?.map?.((a) => ({
    ...a,
    start: a?.start?.toDate ? a?.start?.toDate() : new Date(a?.start),
    end: a?.end?.toDate ? a?.end?.toDate() : new Date(a?.end),
  }));

  return finalList;
};
