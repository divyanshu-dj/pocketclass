import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import StudentClasses from "../components/StudentClasses/studentClasses";

const MyClass = () => {
  const router = useRouter();
  const { id } = router.query;

  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [classDetails, setClassDetails] = useState({});
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // ✅ Main loading flag

  const getUserInfo = async (uid) => {
    try {
      const docSnap = await getDoc(doc(db, "Users", uid));
      if (docSnap.exists()) setUserData(docSnap.data());
    } catch (err) {
      console.error("Error fetching user info:", err);
    }
  };

  const fetchInstructorNames = async (appointments) => {
    const uniqueInstructorIds = [
      ...new Set(appointments.map((a) => a.instructor_id)),
    ];

    const instructorMap = {};
    await Promise.all(
      uniqueInstructorIds.map(async (instructorId) => {
        try {
          const docSnap = await getDoc(doc(db, "Users", instructorId));
          if (docSnap.exists()) {
            const data = docSnap.data();
            instructorMap[instructorId] =
              data.firstName && data.lastName
                ? `${data.firstName} ${data.lastName}`
                : data.firstName || "Instructor";
          }
        } catch (err) {
          console.error("Failed to fetch instructor", instructorId);
        }
      })
    );

    return instructorMap;
  };

  const groupAppointments = (appointments) => {
    const grouped = {};
    appointments.forEach((appt) => {
      const key = `${appt.class_id}_${appt.startTime}`;
      if (!grouped[key]) {
        grouped[key] = {
          ...appt,
          student_names: [appt.student_name],
          groupEmails: [...(appt.groupEmails || [])],
        };
      } else {
        grouped[key].student_names.push(appt.student_name);
        grouped[key].groupEmails.push(...(appt.groupEmails || []));
      }
    });
    return Object.values(grouped);
  };

  const fetchClassDetails = async (appointments) => {
    const newClassDetails = { ...classDetails };
    const alreadyFetched = new Set(Object.keys(classDetails));

    await Promise.all(
      appointments.map(async (appt) => {
        const cid = appt.class_id;
        if (!alreadyFetched.has(cid)) {
          const classSnap = await getDoc(doc(db, "classes", cid));
          if (classSnap.exists()) {
            newClassDetails[cid] = { ...classSnap.data(), id: cid };
            alreadyFetched.add(cid);
          }
        }
      })
    );

    setClassDetails(newClassDetails);
  };

  const getAppointments = async (userId) => {
    try {
      setIsLoading(true); // ✅ Start loading
      const q = query(
        collection(db, "Bookings"),
        where("student_id", "==", userId)
      );
      const snapshot = await getDocs(q);

      let appts = snapshot.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }))
        .filter((a) => a.status !== "Pending");

      const filtered = [];
      await Promise.all(
        appts.map(async (a) => {
          const classSnap = await getDoc(doc(db, "classes", a.class_id));
          if (classSnap.exists()) filtered.push(a);
        })
      );

      const instructorMap = await fetchInstructorNames(filtered);

      const appointmentsWithNames = filtered.map((a) => ({
        ...a,
        student_name: instructorMap[a.instructor_id] || "Instructor",
      }));

      const grouped = groupAppointments(appointmentsWithNames);
      setAppointments(grouped);
      await fetchClassDetails(grouped);
    } catch (error) {
      console.error("Error getting appointments:", error);
    } finally {
      setIsLoading(false); // ✅ Done loading
    }
  };

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "Reviews"), (snapshot) => {
      setReviews(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (id) getUserInfo(id);
  }, [id]);

  useEffect(() => {
    if (id && userData) getAppointments(id);
  }, [id, userData]);

  useEffect(() => {
    if (!user && !loading) {
      router.push("/");
    }
    if(user && user.uid !== id) {
      router.push(`/mybooking?id=${user.uid}`);
    }
  }, [user, loading]);

  return (
    <div className="myClassesContainer overflow-hidden mx-auto">
      <Head>
        <title>My Bookings</title>
        <meta name="description" content="My Class Dashboard" />
        <link rel="icon" href="/pc_favicon.ico" />
      </Head>

      <StudentClasses
        appointments={appointments}
        classDetails={classDetails}
        reviews={reviews}
        isLoading={isLoading} // ✅ Pass loading prop
      />
    </div>
  );
};

export default MyClass;
