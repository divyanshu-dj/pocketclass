import moment from "moment";

/* DATE FUNCTIONS */
export const isAfter30Days = (date) => {
	return moment(date)?.isAfter(moment().clone().add(30, "days"));
};

export const isBeforeNow = (date) => {
	return moment(date).isBefore(moment());
};

export const isBeforeToday = (date) => {
	return moment(date).isBefore(moment().startOf("day"));
};

export const getDateOnly = (date) => {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};
