"use client";

import React, { useState, useEffect } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Select from "react-select";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-day-picker/dist/style.css";
import { DayPicker } from "react-day-picker";
import { auth } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import Header from "../components/Header";
import { db } from "../firebaseConfig";
import { toast } from "react-toastify";
import {
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  onSnapshot,
  collection,
} from "firebase/firestore";

const localizer = momentLocalizer(moment);

export default function Schedule() {
  const [user, userLoading] = useAuthState(auth);
  const router = useRouter();

  const [events, setEvents] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [appointmentDuration, setAppointmentDuration] = useState(30);
  const [generalAvailability, setGeneralAvailability] = useState(
    [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ].map((day) => ({
      day,
      slots: [],
    }))
  );
  const [adjustedAvailability, setAdjustedAvailability] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [view, setView] = useState("week");
  const [scheduleLoading, setScheduleLoading] = useState(false);

  const saveSchedule = async (
    db,
    user,
    generalAvailability,
    adjustedAvailability
  ) => {
    try {
      setScheduleLoading(true);
      const data = {
        generalAvailability,
        adjustedAvailability,
      };

      await setDoc(doc(db, "Schedule", user.uid), data, { merge: true });

      toast.success("Schedule saved successfully");
      setScheduleLoading(false);
    } catch (error) {
      toast.error("Error saving schedule");
      console.error("Error saving schedule:", error);
      setScheduleLoading(false);
    }
  };


  useEffect(() => {
    if (user) {
      const loadSc = onSnapshot(
        doc(db, "Schedule", user.uid),
        (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            if (data) {
              setGeneralAvailability(data.generalAvailability);
              setAdjustedAvailability(data.adjustedAvailability);
            }
          }
        },
        (error) => {
          console.error("Error loading schedule:", error);
        }
      );

      return () => loadSc();
    }
  }, [user]);
  useEffect(() => {
    const updateView = () => {
      setView(window.innerWidth <= 768 ? "day" : "week");
    };
    updateView();
    window.addEventListener("resize", updateView);
    return () => window.removeEventListener("resize", updateView);
  }, []);

  useEffect(() => {
    if (!userLoading && !user) router.push("/");
  }, [userLoading, user]);
  const customFormats = {
    timeGutterFormat: (date, culture, localizer) =>
      localizer.format(date, "ha").replace(":00", ""),
    timeGutterFormat: (date, culture, localizer) =>
      localizer.format(date, "ha").replace("am", "AM").replace("pm", "PM"),
  };

  useEffect(() => {
    generateEvents(generalAvailability, adjustedAvailability);
  }, [appointmentDuration, generalAvailability, adjustedAvailability]);

  const handleGeneralInputChange = (dayIndex, slotIndex, key, value) => {
    const updatedAvailability = [...generalAvailability];
    updatedAvailability[dayIndex].slots[slotIndex][key] = value;
    setGeneralAvailability(updatedAvailability);
  };

  const addGeneralSlot = (dayIndex) => {
    const updatedAvailability = [...generalAvailability];
    updatedAvailability[dayIndex].slots.push({
      startTime: "09:00",
      endTime: "09:30",
    });
    setGeneralAvailability(updatedAvailability);
  };

  const removeGeneralSlot = (dayIndex, slotIndex) => {
    const updatedAvailability = [...generalAvailability];
    updatedAvailability[dayIndex].slots.splice(slotIndex, 1);
    setGeneralAvailability(updatedAvailability);
  };

  const copyToAllDays = (dayIndex) => {
    const slotsToCopy = generalAvailability[dayIndex].slots.map((slot) => ({
      ...slot,
    }));

    const updatedAvailability = generalAvailability.map((day, index) => {
      if (index === dayIndex) return day;
      return {
        ...day,
        slots: slotsToCopy.map((slot) => ({ ...slot })),
      };
    });

    setGeneralAvailability(updatedAvailability);
  };

  const addAdjustedAvailabilityDate = (date) => {
    const dateStr = moment(date).format("YYYY-MM-DD");
    if (!adjustedAvailability.some((item) => item.date === dateStr)) {
      setAdjustedAvailability((prev) => [
        ...prev,
        { date: dateStr, slots: [] },
      ]);
    }
  };

  const addAdjustedSlot = (date) => {
    const updatedAvailability = adjustedAvailability.map((item) =>
      item.date === date
        ? {
            ...item,
            slots: [...item.slots, { startTime: "09:00", endTime: "09:30" }],
          }
        : item
    );
    setAdjustedAvailability(updatedAvailability);
  };

  const handleAdjustedInputChange = (date, slotIndex, key, value) => {
    const updatedAvailability = adjustedAvailability.map((item) => {
      if (item.date === date) {
        const updatedSlots = [...item.slots];
        updatedSlots[slotIndex][key] = value;
        return { ...item, slots: updatedSlots };
      }
      return item;
    });
    setAdjustedAvailability(updatedAvailability);
  };

  const removeAdjustedSlot = (date, slotIndex) => {
    const updatedAvailability = adjustedAvailability.map((item) =>
      item.date === date
        ? {
            ...item,
            slots: item.slots.filter((_, index) => index !== slotIndex),
          }
        : item
    );
    setAdjustedAvailability(updatedAvailability);
  };

  const removeAdjustedDate = (date) => {
    setAdjustedAvailability((prev) =>
      prev.filter((item) => item.date !== date)
    );
  };

  const generateEvents = (general, adjusted) => {
    let newEvents = [];

    general.forEach((day, index) => {
      day.slots.forEach((slot) => {
        if (slot.startTime && slot.endTime) {
          const slotStart = moment(slot.startTime, "HH:mm");
          const slotEnd = moment(slot.endTime, "HH:mm");
          let current = slotStart.clone();

          while (current.isBefore(slotEnd)) {
            const next = current.clone().add(appointmentDuration, "minutes");
            if (next.isAfter(slotEnd)) break;

            for (let i = 0; i < 52; i++) {
              const start = moment()
                .startOf("week")
                .add(index, "days")
                .add(i, "weeks")
                .set({
                  hour: current.hours(),
                  minute: current.minutes(),
                });
              const end = moment()
                .startOf("week")
                .add(index, "days")
                .add(i, "weeks")
                .set({
                  hour: next.hours(),
                  minute: next.minutes(),
                });
              newEvents.push({
                title: "Available",
                start: start.toDate(),
                end: end.toDate(),
                color: "#f5bdb6",
              });
            }
            current = next;
          }
        }
      });
    });

    adjusted.forEach((item) => {
      const date = moment(item.date, "YYYY-MM-DD");

      newEvents = newEvents.filter(
        (event) => !moment(event.start).isSame(date, "day")
      );

      item.slots.forEach((slot) => {
        if (slot.startTime && slot.endTime) {
          const slotStart = moment(slot.startTime, "HH:mm");
          const slotEnd = moment(slot.endTime, "HH:mm");
          let current = slotStart.clone();

          while (current.isBefore(slotEnd)) {
            const next = current.clone().add(appointmentDuration, "minutes");
            if (next.isAfter(slotEnd)) break;

            const start = date.clone().set({
              hour: current.hours(),
              minute: current.minutes(),
            });
            const end = date.clone().set({
              hour: next.hours(),
              minute: next.minutes(),
            });

            newEvents.push({
              title: "Available",
              start: start.toDate(),
              end: end.toDate(),
              color: "#f5bdb6",
            });

            current = next;
          }
        }
      });
    });

    setEvents(newEvents);
  };

  // time slots from 30 minutes to 3 hours slotOptions

  const slotOptions = [
    { value: 30, label: "30 minutes" },
    { value: 60, label: "1 hour" },
    { value: 90, label: "1 hour 30 minutes" },
    { value: 120, label: "2 hours" },
    { value: 150, label: "2 hours 30 minutes" },
    { value: 180, label: "3 hours" },
    { value: 210, label: "3 hours 30 minutes" },
    { value: 240, label: "4 hours" },
  ];

  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2)
      .toString()
      .padStart(2, "0");
    const minute = i % 2 === 0 ? "00" : "30";
    const time = `${hour}:${minute}`;
    return { value: time, label: time };
  });

  return (
    <div className="flex flex-col lg:h-screen">
      <Header />
      <div className="flex flex-grow flex-col lg:flex-row overflow-hidden bg-gray-50 text-black">
        <div className="overflow-auto p-4 border-r bg-white shadow-md">
          <h2 className="text-2xl font-bold text-gray-700 mb-3">Schedule</h2>

          <div className="mb-6">
            <label
              htmlFor="appointment-duration"
              className="block font-semibold text-gray-600 mb-2"
            >
              Appointment Duration (in minutes)
            </label>

            <Select
              value={slotOptions.find(
                (option) => option.value === appointmentDuration
              )}
              onChange={(selected) => setAppointmentDuration(selected.value)}
              options={slotOptions}
              className="w-full"
            />
          </div>

          <h2 className="text-2xl font-bold text-gray-700 mb-6">
            General Availability
          </h2>
          {generalAvailability.map((day, dayIndex) => (
            <div key={dayIndex} className="mb-6">
              <div className="grid grid-cols-5 items-start gap-4">
                <h3 className="font-semibold col-span-4 lg:col-span-1 text-gray-600">
                  {day.day}
                </h3>
                <div className="col-span-3 hidden lg:block">
                  {day.slots.length === 0 ? (
                    <p className="text-gray-500">Unavailable</p>
                  ) : (
                    day.slots.map((slot, slotIndex) => (
                      <div
                        key={slotIndex}
                        className="flex items-center space-x-2 mb-2"
                      >
                        <Select
                          value={timeOptions.find(
                            (option) => option.value === slot.startTime
                          )}
                          onChange={(selected) =>
                            handleGeneralInputChange(
                              dayIndex,
                              slotIndex,
                              "startTime",
                              selected.value
                            )
                          }
                          options={timeOptions}
                          className="w-full"
                        />
                        <span>-</span>
                        <Select
                          value={timeOptions.find(
                            (option) => option.value === slot.endTime
                          )}
                          onChange={(selected) =>
                            handleGeneralInputChange(
                              dayIndex,
                              slotIndex,
                              "endTime",
                              selected.value
                            )
                          }
                          options={timeOptions}
                          className="w-full"
                        />
                        <button
                          onClick={() => removeGeneralSlot(dayIndex, slotIndex)}
                          className="text-red-500 flex justify-center items-center hover:text-red-600"
                          title="Remove Slot"
                        >
                          <span className="material-symbols-outlined text-xs">
                            block
                          </span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex space-x-2 justify-end">
                  <button
                    onClick={() => addGeneralSlot(dayIndex)}
                    className="text-blue-500 hover:text-blue-600"
                    title="Add Slot"
                  >
                    <span className="material-symbols-outlined">
                      add_circle
                    </span>
                  </button>
                  <button
                    onClick={() => copyToAllDays(dayIndex)}
                    className="text-gray-500 hover:text-gray-600"
                    title="Copy Slots"
                  >
                    <span className="material-symbols-outlined">
                      content_copy
                    </span>
                  </button>
                </div>
              </div>

              <div className="col-span-3 block lg:hidden">
                {day.slots.length === 0 ? (
                  <p className="text-gray-500">Unavailable</p>
                ) : (
                  day.slots.map((slot, slotIndex) => (
                    <div
                      key={slotIndex}
                      className="flex items-center space-x-2 mb-2"
                    >
                      <Select
                        value={timeOptions.find(
                          (option) => option.value === slot.startTime
                        )}
                        onChange={(selected) =>
                          handleGeneralInputChange(
                            dayIndex,
                            slotIndex,
                            "startTime",
                            selected.value
                          )
                        }
                        options={timeOptions}
                        className="w-full bg-gray-100"
                        styles={{
                          menu: (provided) => ({
                            ...provided,
                            maxHeight: "300px",
                          }),
                        }}
                      />

                      <span>-</span>
                      <Select
                        value={timeOptions.find(
                          (option) => option.value === slot.endTime
                        )}
                        onChange={(selected) =>
                          handleGeneralInputChange(
                            dayIndex,
                            slotIndex,
                            "endTime",
                            selected.value
                          )
                        }
                        options={timeOptions}
                        className="w-full bg-gray-100"
                        styles={{
                          menu: (provided) => ({
                            ...provided,
                            maxHeight: "300px",
                          }),
                        }}
                      />
                      <button
                        onClick={() => removeGeneralSlot(dayIndex, slotIndex)}
                        className="text-red-500 flex justify-center items-center hover:text-red-600"
                        title="Remove Slot"
                      >
                        <span className="material-symbols-outlined text-xs">
                          block
                        </span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
          <h2 className="text-2xl font-bold text-gray-700 mb-6">
            Adjusted Availability
          </h2>
          <div className="mb-6">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mb-4"
              onClick={() => setShowDatePicker(true)}
            >
              Change a Date's Availability
            </button>

            {showDatePicker && (
              <div className=" bg-white p-4 w-max rounded-md shadow-lg">
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    if (date) addAdjustedAvailabilityDate(date);
                    setShowDatePicker(false);
                  }}
                  className="border rounded p-2 bg-gray-100 text-sm"
                />
                <button
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  onClick={() => setShowDatePicker(false)}
                >
                  Close
                </button>
              </div>
            )}
          </div>
          {adjustedAvailability.map((item) => (
            <div key={item.date} className="mb-6">
              <div className="grid grid-cols-7 items-start gap-4">
                <h3 className="font-semibold col-span-6 lg:col-span-2 text-gray-600">
                  {item.date}
                </h3>
                <div className="col-span-4 hidden lg:block">
                  {item.slots.length === 0 ? (
                    <p className="text-gray-500">Unavailable</p>
                  ) : (
                    item.slots.map((slot, slotIndex) => (
                      <div
                        key={slotIndex}
                        className="flex items-center space-x-2 mb-2"
                      >
                        <Select
                          value={timeOptions.find(
                            (option) => option.value === slot.startTime
                          )}
                          onChange={(selected) =>
                            handleAdjustedInputChange(
                              item.date,
                              slotIndex,
                              "startTime",
                              selected.value
                            )
                          }
                          options={timeOptions}
                          className="w-full bg-gray-100"
                          styles={{
                            menu: (provided) => ({
                              ...provided,
                              maxHeight: "300px",
                            }),
                          }}
                        />

                        <span>-</span>
                        <Select
                          value={timeOptions.find(
                            (option) => option.value === slot.endTime
                          )}
                          onChange={(selected) =>
                            handleAdjustedInputChange(
                              item.date,
                              slotIndex,
                              "endTime",
                              selected.value
                            )
                          }
                          options={timeOptions}
                          className="w-full bg-gray-100"
                          styles={{
                            menu: (provided) => ({
                              ...provided,
                              maxHeight: "300px",
                            }),
                          }}
                        />
                        <button
                          onClick={() =>
                            removeAdjustedSlot(item.date, slotIndex)
                          }
                          className="text-red-500 flex items-center justify-center hover:text-red-600"
                          title="Remove Slot"
                        >
                          <span className="text-xs material-symbols-outlined  ">
                            block
                          </span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex space-x-2 justify-end">
                  <button
                    onClick={() => addAdjustedSlot(item.date)}
                    className="text-blue-500 hover:text-blue-600"
                    title="Add Slot"
                  >
                    <span className="material-symbols-outlined">
                      add_circle
                    </span>
                  </button>
                  <button
                    onClick={() => removeAdjustedDate(item.date)}
                    className="text-red-500 hover:text-red-600"
                    title="Remove Date"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              </div>

              <div className="block lg:hidden">
                {item.slots.length === 0 ? (
                  <p className="text-gray-500">Unavailable</p>
                ) : (
                  item.slots.map((slot, slotIndex) => (
                    <div
                      key={slotIndex}
                      className="flex items-center space-x-2 mb-2"
                    >
                      <Select
                        value={timeOptions.find(
                          (option) => option.value === slot.startTime
                        )}
                        onChange={(selected) =>
                          handleAdjustedInputChange(
                            item.date,
                            slotIndex,
                            "startTime",
                            selected.value
                          )
                        }
                        options={timeOptions}
                        className="w-full"
                        styles={{
                          menu: (provided) => ({
                            ...provided,
                            maxHeight: "300px",
                          }),
                        }}
                      />

                      <span>-</span>
                      <Select
                        value={timeOptions.find(
                          (option) => option.value === slot.endTime
                        )}
                        onChange={(selected) =>
                          handleAdjustedInputChange(
                            item.date,
                            slotIndex,
                            "endTime",
                            selected.value
                          )
                        }
                        options={timeOptions}
                        className="w-full"
                        styles={{
                          menu: (provided) => ({
                            ...provided,
                            maxHeight: "300px",
                          }),
                        }}
                      />
                      <button
                        onClick={() => removeAdjustedSlot(item.date, slotIndex)}
                        className="text-red-500 flex items-center justify-center hover:text-red-600"
                        title="Remove Slot"
                      >
                        <span className="text-xs material-symbols-outlined  ">
                          block
                        </span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}

          <button
            onClick={() =>
              saveSchedule(db, user, generalAvailability, adjustedAvailability)
            }
            disabled={scheduleLoading}
            className={` px-4 py-2 bg-logo-red text-white rounded-md hover:bg-red-600`}
          >
            {scheduleLoading ? "Saving..." : "Save Schedule"}
          </button>
        </div>
        <div className="flex-grow p-4">
          <BigCalendar
            timeslots={2}
            timeStep={30}
            defaultView={view}
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "calc(100vh - 150px)" }}
            formats={customFormats}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: event.color,
              },
            })}
            scrollToTime={new Date(1970, 1, 1, 8, 0, 0)}
          />
        </div>
      </div>
    </div>
  );
}
