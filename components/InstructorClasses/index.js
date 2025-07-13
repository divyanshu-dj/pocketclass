import React, { useEffect } from "react";
import { Tabs } from "antd";
import InfoCard from "../InfoCard";
import InstructorCard from "./InstructorCard";
import StudentCard from "../StudentClasses/StudentCard";
import moment from "moment";
import { useRouter } from "next/router";

const InstructorClasses = ({
  classes,
  bookings,
  bookingsByMe,
  reviews,
  userData,
}) => {
  const [selectedStatus, setSelectedStatus] = React.useState("Classes");
  const router = useRouter();
  const { bookingId, mode } = router.query;
  const now = new Date();
  // If any two bookings have same start time, then they are reduced to one group booking with array of booking id, student id, paymentIntentId
  const groupedAppointments = bookings.reduce((acc, appointment) => {
    const appointmentStart = new Date(appointment.startTime);
    if (appointmentStart <= now) return acc;
    const existing = acc.find(
      (group) => group.startTime == appointment.startTime
    );
    if (existing) {
      existing.bookingId.push(appointment.id);
      existing.studentId.push(appointment.student_id);
      existing.paymentIntentId.push(appointment.paymentIntentId);
      if (appointment.groupSize && appointment.groupSize > 1) {
        existing.student_name.push(
          appointment.student_name + " x" + appointment.groupSize
        );
      } else {
        existing.student_name.push(appointment.student_name);
      }
      existing.payment.push({
        bookingId: appointment.id,
        paymentIntentId: appointment.paymentIntentId,
        studentId: appointment.student_id,
      });
    } else {
      let student_name;
      if (appointment.groupSize && appointment.groupSize > 1) {
        student_name = appointment.student_name + " x" + appointment.groupSize;
      } else {
        student_name = appointment.student_name;
      }
      acc.push({
        ...appointment,
        bookingId: [appointment.id],
        studentId: [appointment.student_id],
        paymentIntentId: [appointment.paymentIntentId],
        student_name: [student_name],
        payment: [
          {
            bookingId: appointment.id,
            paymentIntentId: appointment.paymentIntentId,
            studentId: appointment.student_id,
          },
        ],
      });
    }
    return acc;
  }, []);

  const groupedAppointmentsAfter = bookings.reduce((acc, appointment) => {
    const appointmentStart = new Date(appointment.startTime);
    if (appointmentStart > now) return acc;
    const existing = acc.find(
      (group) => group.startTime == appointment.startTime
    );
    if (existing) {
      existing.bookingId.push(appointment.id);
      existing.studentId.push(appointment.student_id);
      existing.paymentIntentId.push(appointment.paymentIntentId);
      if (appointment.groupSize && appointment.groupSize > 1) {
        existing.student_name.push(
          appointment.student_name + " x" + appointment.groupSize
        );
      } else {
        existing.student_name.push(appointment.student_name);
      }
      existing.payment.push({
        bookingId: appointment.id,
        paymentIntentId: appointment.paymentIntentId,
        studentId: appointment.student_id,
      });
    } else {
      let student_name;
      if (appointment.groupSize && appointment.groupSize > 1) {
        student_name = appointment.student_name + " x" + appointment.groupSize;
      } else {
        student_name = appointment.student_name;
      }
      acc.push({
        ...appointment,
        bookingId: [appointment.id],
        studentId: [appointment.student_id],
        paymentIntentId: [appointment.paymentIntentId],
        student_name: [student_name],
        payment: [
          {
            bookingId: appointment.id,
            paymentIntentId: appointment.paymentIntentId,
            studentId: appointment.student_id,
          },
        ],
      });
    }
    return acc;
  }, []);

  const groupedBookingsByMe = bookingsByMe.reduce((acc, appointment) => {
    const existing = acc.find(
      (group) => group.startTime === appointment.startTime
    );
    if (existing) {
      existing.bookingId.push(appointment.id);
      existing.studentId.push(appointment.student_id);
      existing.paymentIntentId.push(appointment.paymentIntentId);
      if (appointment.groupSize && appointment.groupSize > 1) {
        existing.student_name.push(
          appointment.student_name + " x" + appointment.groupSize
        );
      } else {
        existing.student_name.push(appointment.student_name);
      }
      existing.payment.push({
        bookingId: appointment.id,
        paymentIntentId: appointment.paymentIntentId,
        studentId: appointment.student_id,
      });
    } else {
      let student_name;
      if (appointment.groupSize && appointment.groupSize > 1) {
        student_name = appointment.student_name + " x" + appointment.groupSize;
      } else {
        student_name = appointment.student_name;
      }
      acc.push({
        ...appointment,
        bookingId: [appointment.id],
        studentId: [appointment.student_id],
        paymentIntentId: [appointment.paymentIntentId],
        student_name: [student_name],
        payment: [
          {
            bookingId: appointment.id,
            paymentIntentId: appointment.paymentIntentId,
            studentId: appointment.student_id,
          },
        ],
      });
    }
    console.log(acc);
    return acc;
  }, []);

  const handleTabChange = (key) => {
    setSelectedStatus(key);
  };
  return (
    <div>
      <div className="max-w-[1450px] mx-auto mb-4">
        {selectedStatus === "Classes" && classes.length !== 0 ? (
          // Add a import classes button before the classes
          <div>
            {userData?.mindbody?.accessToken && (
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() => router.push("/mindbody-import")}
                  className="bg-logo-red text-white px-4 py-2 rounded-md hover:bg
                -logo-red-dark transition-colors"
                >
                  Import Classes from Mindbody
                </button>
              </div>
            )}
            {classes.map((classData) => {
              return (
                <InstructorCard
                  key={classData.id}
                  id={classData.id}
                  type={
                    classData.SubCategory
                      ? classData.SubCategory
                      : classData.Type
                  }
                  latitude={classData.latitude}
                  name={classData.Name}
                  images={classData.Images}
                  description={classData.Description}
                  longitude={classData.longitude}
                  reviews={reviews}
                  address={classData.Address}
                  price={classData.Price}
                  category={classData.category}
                  status={classData.status}
                  start={classData.startTime}
                  end={classData.endTime}
                  classCreator={classData.classCreator}
                  isBooking={false}
                  isMindbody={classData.mindbodyId ? true : false}
                />
              );
            })}
          </div>
        ) : (
          <p className="text-center text-xl w-full text-logo-red">
            {selectedStatus === "Classes" ? "No Classes Found" : ""}
          </p>
        )}
      </div>
    </div>
  );
};

export default InstructorClasses;
