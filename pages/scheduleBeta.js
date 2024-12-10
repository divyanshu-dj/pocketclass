"use client";

import React, { useState, useEffect } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { auth } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import Select from "react-select";
import Header from "../components/Header";

const localizer = momentLocalizer(moment);

export default function Schedule() {
  const [user, userLoading] = useAuthState(auth);
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    classId: "",
    durationMins: 30,
    startTime: "",
    endTime: "",
    repeat: [], 
    date: null,
    repeatWeeks: 4,
    availabilityMode: true,
  });

  useEffect(() => {
    if (!userLoading && !user) router.push("/");
  }, [userLoading, user]);

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddSlot = () => {
    const {
      startTime,
      endTime,
      repeat,
      date,
      repeatWeeks,
      durationMins,
      availabilityMode,
    } = formData;

    if (startTime && endTime && (repeat.length || date)) {
      const slots = [];
      const start = moment(startTime, "HH:mm");
      const end = moment(endTime, "HH:mm");

      const generateRepeatDates = () => {
        const today = moment().startOf("day");
        const rangeEnd = moment().add(repeatWeeks, "weeks");
        const repeatDates = [];
        repeat.forEach((day) => {
          let current = today.clone().day(day);
          if (current.isBefore(today)) {
            current.add(1, "week");
          }
          while (current.isBefore(rangeEnd)) {
            repeatDates.push(current.clone().format("YYYY-MM-DD"));
            current.add(1, "week");
          }
        });
        return repeatDates;
      };

      const repeatDates = repeat.length > 0 ? generateRepeatDates() : [];

      if (availabilityMode) {
        while (start.isBefore(end)) {
          const sessionEnd = moment.min(
            start.clone().add(durationMins, "minutes"),
            end
          );
          if (repeatDates.length > 0) {
            repeatDates.forEach((date) => {
              slots.push({
                title: "Available",
                start: moment(date, "YYYY-MM-DD")
                  .set({
                    hour: start.hour(),
                    minute: start.minute(),
                  })
                  .toDate(),
                end: moment(date, "YYYY-MM-DD")
                  .set({
                    hour: sessionEnd.hour(),
                    minute: sessionEnd.minute(),
                  })
                  .toDate(),
                isUnavailable: false,
                color: "blue",
              });
            });
          } else if (date) {
            slots.push({
              title: "Available",
              start: moment(date)
                .set({
                  hour: start.hour(),
                  minute: start.minute(),
                })
                .toDate(),
              end: moment(date)
                .set({
                  hour: sessionEnd.hour(),
                  minute: sessionEnd.minute(),
                })
                .toDate(),
              isUnavailable: false,
              color: "blue",
            });
          }
          start.add(durationMins, "minutes");
        }
      } else {
        if (repeatDates.length > 0) {
          repeatDates.forEach((date) => {
            slots.push({
              title: "Unavailable",
              start: moment(date, "YYYY-MM-DD")
                .set({
                  hour: start.hour(),
                  minute: start.minute(),
                })
                .toDate(),
              end: moment(date, "YYYY-MM-DD")
                .set({
                  hour: end.hour(),
                  minute: end.minute(),
                })
                .toDate(),
              isUnavailable: true,
              color: "red",
            });
          });
        } else if (date) {
          slots.push({
            title: "Unavailable",
            start: moment(date)
              .set({
                hour: start.hour(),
                minute: start.minute(),
              })
              .toDate(),
            end: moment(date)
              .set({
                hour: end.hour(),
                minute: end.minute(),
              })
              .toDate(),
            isUnavailable: true,
            color: "red",
          });
        }
      }

      if (availabilityMode) {
        const newEvents = slots.filter((slot) => {
          return !events.some((event) => {
            return (
              moment(slot.start).isBefore(event.end) &&
              moment(slot.end).isAfter(event.start) &&
              event.isUnavailable
            );
          });
        });
        setEvents((prevEvents) => [...prevEvents, ...newEvents]);
      } else {
        const newEvents = events.filter((event) => {
          return !slots.some((slot) => {
            return (
              moment(slot.start).isBefore(event.end) &&
              moment(slot.end).isAfter(event.start)
            );
          });
        });
        setEvents((prevEvents) => [...newEvents, ...slots]);
      }

      resetInputs();
    }
  };

  const resetInputs = () => {
    setFormData({
      classId: "",
      durationMins: 30,
      startTime: "",
      endTime: "",
      repeat: [], 
      date: null,
      repeatWeeks: 4,
      availabilityMode: true,
    });
  };

  const toggleMode = () => {
    setFormData((prev) => ({
      ...prev,
      availabilityMode: !prev.availabilityMode,
    }));
  };

  const {
    startTime,
    endTime,
    durationMins,
    repeat,
    date,
    repeatWeeks,
    availabilityMode,
  } = formData;

  const daysOfWeek = [
    { value: 0, label: "Sunday" },
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
  ];

  return (
    <div className="flex flex-col lg:h-screen">
      <Header />
      <div className="flex flex-grow flex-col lg:flex-row overflow-hidden  bg-gray-50 text-black">
        <div className="w-full overflow-auto lg:w-1/3 overflow-y-auto  p-4 border-r bg-white shadow-md">
          <h2 className="text-2xl font-bold text-gray-700 mb-6">
            {availabilityMode ? "Adjust Availability" : "Set Unavailability"}
          </h2>
          <div className="mb-4 flex items-center justify-center">
            <DayPicker
              mode="single"
              selected={date}
              onSelect={(selectedDate) =>
                handleInputChange("date", selectedDate)
              }
              className="border rounded-lg shadow-sm"
            />
          </div>
          <div>
            <label
              htmlFor="repeat-days"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Repeat Days:
            </label>
            <Select
              isMulti
              options={daysOfWeek}
              value={repeat.map((r) =>
                daysOfWeek.find((day) => day.value === r)
              )}
              onChange={(selected) =>
                handleInputChange(
                  "repeat",
                  selected.map((item) => item.value)
                )
              }
              className="mb-4"
            />
          </div>
          <div>
            <label
              htmlFor="repeat-weeks"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Repeat for How Many Weeks:
            </label>
            <input
              type="number"
              id="repeat-weeks"
              className="w-full mb-4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={repeatWeeks}
              onChange={(e) =>
                handleInputChange("repeatWeeks", Number(e.target.value))
              }
              min="1"
            />
          </div>
          <div>
            <label
              htmlFor="start-time"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Start Time:
            </label>
            <input
              type="time"
              id="start-time"
              className="w-full mb-4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={startTime}
              onChange={(e) => handleInputChange("startTime", e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="end-time"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              End Time:
            </label>
            <input
              type="time"
              id="end-time"
              className="w-full mb-4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={endTime}
              onChange={(e) => handleInputChange("endTime", e.target.value)}
            />
          </div>
          {availabilityMode && (
            <div>
              <label
                htmlFor="duration"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Duration (in minutes):
              </label>
              <input
                type="number"
                id="duration"
                className="w-full mb-4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={durationMins}
                onChange={(e) =>
                  handleInputChange("durationMins", Number(e.target.value))
                }
                min="5"
              />
            </div>
          )}
          <button
            className="w-full mb-4 py-2 bg-blue-500 text-white rounded-lg"
            onClick={handleAddSlot}
          >
            {availabilityMode ? "Add Availability" : "Add Unavailability"}
          </button>
          <button
            className="w-full py-2 bg-gray-500 text-white rounded-lg"
            onClick={toggleMode}
          >
            {availabilityMode? "Set Unavailability" : "Adjust Availability"}
          </button>
        </div>
        <div className="w-full lg:w-2/3 p-4">
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            defaultView="week"
            style={{ height: "calc(100vh - 150px)" }}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: event.color,
              },
            })}
          />
        </div>
      </div>
    </div>
  );
}
