import { useEffect, useRef, useState } from "react";
import { FiChevronLeft } from "react-icons/fi";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  collection,
} from "firebase/firestore";
import { toast } from "react-toastify";

export default function LoginModal({ onClose, setShowBooking }) {
  const modalRef = useRef();
  const [step, setStep] = useState("login");
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pendingGoogleCredential, setPendingGoogleCredential] = useState(null);
  const [googleUserData, setGoogleUserData] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleGoogleSignIn = async () => {
    setErrorMessage("");
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;

      const userSnap = await getDoc(doc(db, "Users", user.uid));
      if (userSnap.exists()) {
        setShowBooking(true);
        onClose();
        return;
      }

      await firebaseSignOut(auth);
      setGoogleUserData(user);
      setPendingGoogleCredential(credential);
      setStep("role");
    } catch (err) {
      setErrorMessage("Google sign-in failed.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const q = query(collection(db, "Users"), where("email", "==", email));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        toast.error("No user exists with this email");
        return;
      }

      await signInWithEmailAndPassword(auth, email, password);

      setIsLoggedIn(true);
      setShowBooking(true);
      // toast.success("Login successful");
      onClose();
    } catch (err) {
      console.error("Login Error:", err);
      if (err.code === "auth/wrong-password") {
        toast.error("Invalid password");
      } else {
        toast.error("Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSubmit = async () => {
    if (!role || !googleUserData || !pendingGoogleCredential) {
      setErrorMessage("Please select a role.");
      return;
    }

    setIsLoading(true);
    try {
      const { uid, email, displayName, photoURL } = googleUserData;
      const [firstName, ...lastParts] = displayName?.split(" ") || [];
      const lastName = lastParts.join(" ");

      await setDoc(doc(db, "Users", uid), {
        email,
        category: role,
        firstName: firstName || "",
        lastName: lastName || "",
        photoURL: photoURL || "",
        createdAt: serverTimestamp(),
      });

      await signInWithCredential(auth, pendingGoogleCredential);
      setShowBooking(true);
      onClose();
    } catch (err) {
      console.error("Failed to save user:", err);
      setErrorMessage("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={modalRef}
        className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg relative overflow-hidden"
        style={{ height: "460px" }}
      >
        {/* Header */}
        <div className="relative flex items-center justify-center mb-4">
          <button onClick={onClose} className="absolute left-0 text-red-600 hover:text-red-700">
            <FiChevronLeft className="text-xl" />
          </button>
          <h2 className="text-sm text-gray-500 text-center">Log in or sign up</h2>
        </div>

        <div className="relative w-full h-full overflow-hidden">
          <div
            className={`flex w-[200%] transition-transform duration-500 ${step === "login" ? "translate-x-0" : "-translate-x-1/2"
              }`}
          >
            {/* Login Screen */}
            <div className="w-1/2 pr-4">
              <h1 className="text-2xl font-semibold text-center mb-6">Welcome to Pocketclass</h1>
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent focus:outline-none focus:border-logo-red focus:ring-1 focus:ring-logo-red ml-[2px]"
                />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  minLength="6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent focus:outline-none focus:border-logo-red focus:ring-1 focus:ring-logo-red ml-[2px]"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Continue"}
                </button>
              </form>

              <div className="my-4 flex items-center justify-center text-gray-400">
                <span className="text-sm">OR</span>
              </div>

              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-2 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-5 h-5 mr-2"
                />
                {isLoading ? "Signing in..." : "Continue with Google"}
              </button>

              {errorMessage && (
                <p className="text-sm text-red-600 text-center mt-4">{errorMessage}</p>
              )}
            </div>

            {/* Role Selection */}
            <div className="w-1/2 pl-4">
              <h1 className="text-2xl font-semibold text-center mb-6">I am a...</h1>
              <div className="space-y-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={role === "student"}
                    onChange={(e) => setRole(e.target.value)}
                    className="accent-red-600 focus:ring-0 focus:outline-none focus:border-logo-red focus:ring-1 focus:ring-logo-red"
                  />
                  <span>Student</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="role"
                    value="teacher"
                    checked={role === "teacher"}
                    onChange={(e) => setRole(e.target.value)}
                    className="accent-red-600 focus:ring-0 focus:outline-none focus:border-logo-red focus:ring-1 focus:ring-logo-red"
                  />
                  <span>Teacher</span>
                </label>
                <button
                  onClick={handleRoleSubmit}
                  disabled={isLoading}
                  className="w-full mt-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  {isLoading ? "Saving..." : "Continue"}
                </button>
                {errorMessage && (
                  <p className="text-sm text-red-600 text-center">{errorMessage}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="!z-[20050]"
        bodyClassName="text-sm"
      />
    </div>
  );
}
