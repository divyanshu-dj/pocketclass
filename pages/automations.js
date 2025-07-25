import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, updateDoc, serverTimestamp, collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import PremiumPurchaseModal from "../components/PremiumPurchaseModal";

// Helper function to convert Firestore Timestamp to Date
const timestampToDate = (timestamp) => {
  if (!timestamp) return null;

  // Handle Firestore Timestamp objects
  if (timestamp.seconds && typeof timestamp.seconds === "number") {
    return new Date(timestamp.seconds * 1000);
  }

  // Handle Date objects
  if (timestamp instanceof Date) {
    return timestamp;
  }

  // Handle ISO strings
  if (typeof timestamp === "string") {
    return new Date(timestamp);
  }

  // Handle timestamp objects with toDate method
  if (timestamp.toDate && typeof timestamp.toDate === "function") {
    return timestamp.toDate();
  }

  return null;
};
import {
  BellIcon,
  CalendarIcon,
  XIcon,
  CheckCircleIcon,
  HeartIcon,
  ThumbUpIcon,
  ClockIcon,
  UserGroupIcon,
  MailIcon,
  ChatAltIcon,
  StarIcon,
  GiftIcon,
  RefreshIcon,
  UserAddIcon,
  TrendingUpIcon,
  CashIcon,
  EyeIcon,
  CodeIcon,
  InformationCircleIcon,
} from "@heroicons/react/outline";
import {
  BellIcon as BellSolid,
  CalendarIcon as CalendarSolid,
  XIcon as XSolid,
  CheckCircleIcon as CheckSolid,
  HeartIcon as HeartSolid,
  ThumbUpIcon as ThumbUpSolid,
} from "@heroicons/react/solid";

// Voucher Creation Modal Component
const VoucherCreationModal = ({ isOpen, onClose, onVoucherCreated, createVoucher }) => {
  const [formData, setFormData] = useState({
    code: '',
    discountValue: '',
    discountType: 'percentage',
    expiryDate: '',
    remainingUses: '-1',
    unlimitedUses: false,
  });
  const [loading, setLoading] = useState(false);

  // Set default expiry date to 30 days from now
  useEffect(() => {
    if (isOpen && !formData.expiryDate) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      setFormData(prev => ({
        ...prev,
        expiryDate: futureDate.toISOString().split('T')[0]
      }));
    }
  }, [isOpen, formData.expiryDate]);

  const generateRandomCode = () => {
    const randomCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    setFormData(prev => ({ ...prev, code: randomCode }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const voucher = await createVoucher(formData);
      if (voucher) {
        onVoucherCreated(voucher);
        setFormData({
          code: '',
          discountValue: '',
          discountType: 'percentage',
          expiryDate: '',
          remainingUses: '10',
          unlimitedUses: false,
        });
      }
    } catch (error) {
      console.error('Error creating voucher:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Create New Voucher</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Voucher Code
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                name="code"
                required
                value={formData.code}
                onChange={handleChange}
                placeholder="e.g., WELCOME20"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E63F2B] focus:border-[#E63F2B]"
              />
              <button
                type="button"
                onClick={generateRandomCode}
                className="px-3 py-2 bg-[#E63F2B] text-white rounded-lg hover:bg-[#E63F2B]/90"
              >
                <RefreshIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Value
            </label>
            <input
              type="number"
              name="discountValue"
              required
              min="1"
              value={formData.discountValue}
              onChange={handleChange}
              placeholder="e.g., 20"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E63F2B] focus:border-[#E63F2B]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Type
            </label>
            <select
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E63F2B] focus:border-[#E63F2B]"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="amount">Fixed Amount ($)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date
            </label>
            <input
              type="date"
              name="expiryDate"
              required
              value={formData.expiryDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E63F2B] focus:border-[#E63F2B]"
            />
          </div>

          <div>
            {/* Toggle to unlimited uses per student(False by default) */}
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="unlimitedUses"
                checked={formData.unlimitedUses}
                onChange={handleChange}
                className="form-checkbox h-4 w-4 text-[#E63F2B] border-gray-300 rounded focus:ring-[#E63F2B]"
              />
              <span className="ml-2 text-sm text-gray-600">
                Allow students to use this voucher unlimited times
              </span>
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-[#E63F2B] text-white rounded-lg hover:bg-[#E63F2B]/90 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Voucher'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AutomationsPage = () => {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState("reminders");
  const [showModal, setShowModal] = useState(false);
  const [selectedAutomation, setSelectedAutomation] = useState(null);
  const [modalTab, setModalTab] = useState("description");
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(null); // For unified manage modal
  const [manageModalTab, setManageModalTab] = useState("description"); // Current tab in manage modal
  const [vouchers, setVouchers] = useState([]); // Available vouchers for coupon codes
  const [showVoucherModal, setShowVoucherModal] = useState(false); // Show voucher creation modal
  const [automations, setAutomations] = useState({
    reminders: {
      upcomingClass: { 
        enabled: true, 
        timeDelay: "24h", 
        customTime: "24h",
        couponCode: "",
        personalMessage: "",
        mailsSent: 0
      },
      classReminder: { 
        enabled: true, 
        timeDelay: "1h", 
        customTime: "1h",
        couponCode: "",
        personalMessage: "",
        mailsSent: 0
      },
    },
    classUpdates: {
      newBooking: {
        enabled: true,
        timeDelay: "immediate",
        customTime: "immediate",
        couponCode: "",
        personalMessage: "",
        mailsSent: 0
      },
      rescheduled: {
        enabled: true,
        timeDelay: "immediate",
        customTime: "immediate",
        couponCode: "",
        personalMessage: "",
        mailsSent: 0
      },
      cancelled: {
        enabled: true,
        timeDelay: "immediate",
        customTime: "immediate",
        couponCode: "",
        personalMessage: "",
        mailsSent: 0
      },
    },
    engagement: {
      thankYouVisit: {
        enabled: true,
        timeDelay: "immediate",
        customTime: "immediate",
        couponCode: "",
        personalMessage: "",
        mailsSent: 0
      },
    },
    bookingBoost: {
      reminderRebook: {
        enabled: true,
        timeDelay: "3weeks",
        customTime: "3weeks",
        couponCode: "",
        personalMessage: "",
        mailsSent: 0
      },
      winBackLapsed: {
        enabled: false,
        timeDelay: "8weeks",
        customTime: "8weeks",
        couponCode: "",
        personalMessage: "",
        mailsSent: 0
      },
    },
    milestones: {
      welcomeNew: {
        enabled: true,
        timeDelay: "immediate",
        customTime: "immediate",
        couponCode: "",
        personalMessage: "",
        mailsSent: 0
      },
      birthdayGreeting: {
        enabled: false,
        timeDelay: "immediate",
        customTime: "immediate",
        couponCode: "",
        personalMessage: "",
        mailsSent: 0
      },
    },
  });

  const automationDefinitions = {
    reminders: {
      upcomingClass: {
        title: "Upcoming Class Reminder",
        description:
          "Automatically sends to students 24 hours before their upcoming class.",
        fullDescription:
          "This automation sends a friendly reminder email to students 24 hours before their scheduled class. The email includes class details, instructor information, and options to reschedule or cancel if needed. This helps reduce no-shows and ensures students are prepared for their upcoming session.",
        templateFile: "upcomingClassReminder.html",
        triggers: ["24 hours before class start time"],
        benefits: [
          "Reduces no-shows by 40%",
          "Gives students time to reschedule if needed",
          "Improves class attendance rates",
          "Provides important class details",
        ],
      },
      classReminder: {
        title: "1 Hour Class Reminder",
        description:
          "Send students a final reminder 1 hour before their class starts.",
        fullDescription:
          "This automation sends a final reminder to students 1 hour before their class begins. It includes last-minute tips, class location details, and serves as a final prompt to ensure students don't miss their session. This is particularly effective for reducing last-minute cancellations.",
        templateFile: "oneHourReminder.html",
        triggers: ["1 hour before class start time"],
        benefits: [
          "Final chance to remind students",
          "Reduces last-minute no-shows",
          "Provides preparation tips",
          "Ensures students are ready",
        ],
      },
    },
    classUpdates: {
      newBooking: {
        title: "New Class Booking",
        description:
          "Reach out to students when their class is booked for them.",
        fullDescription:
          "Automatically welcome new students with a confirmation email when they book their first or any new class. This email sets expectations, provides important details, and helps build excitement for their upcoming learning experience.",
        templateFile: "newBooking.html",
        triggers: ["Immediately after class booking is confirmed"],
        benefits: [
          "Confirms booking details",
          "Sets clear expectations",
          "Builds student excitement",
          "Provides important information",
        ],
      },
      rescheduled: {
        title: "Rescheduled Class",
        description:
          "Automatically sends to students when their class start time is changed.",
        fullDescription:
          "When an instructor needs to reschedule a class, this automation immediately notifies affected students with the new date and time. It clearly shows both old and new times to avoid confusion and provides options for students if the new time doesn't work.",
        templateFile: "rescheduled.html",
        triggers: ["When instructor reschedules a class"],
        benefits: [
          "Immediate notification of changes",
          "Clear before/after comparison",
          "Reduces scheduling confusion",
          "Maintains good communication",
        ],
      },
      cancelled: {
        title: "Cancelled Class",
        description:
          "Automatically sends to students when their class is cancelled.",
        fullDescription:
          "If a class needs to be cancelled, this automation immediately notifies students and provides information about refunds and rebooking options. It helps maintain trust by being transparent and offering solutions.",
        templateFile: "cancelled.html",
        triggers: ["When a class is cancelled by instructor"],
        benefits: [
          "Immediate cancellation notification",
          "Clear refund information",
          "Rebooking assistance",
          "Maintains student trust",
        ],
      },
    },
    bookingBoost: {
      reminderRebook: {
        title: "Reminder to Rebook",
        description:
          "Remind your students to rebook a few weeks after their last class.",
        fullDescription:
          "This automation reaches out to students who haven't booked a follow-up class within a specified time period. It includes a special discount offer and highlights the benefits of continuing their learning journey to encourage rebooking.",
        templateFile: "reminderRebook.html",
        triggers: ["21 days after last completed class"],
        benefits: [
          "Increases student retention",
          "Encourages continued learning",
          "Includes special offers",
          "Builds long-term relationships",
        ],
      },
      winBackLapsed: {
        title: "Win Back Lapsed Students",
        description:
          "Reach students that you haven't seen for a while and encourage them to book their next class.",
        fullDescription:
          "Target students who haven't booked a class in several months with a compelling win-back campaign. This email includes their class history, what they've missed, and an attractive offer to return.",
        templateFile: "winBackLapsed.html",
        triggers: ["60 days after last completed class"],
        benefits: [
          "Reactivates inactive students",
          "Compelling comeback offers",
          "Shows what they've missed",
          "Second chance engagement",
        ],
      },
    },
    milestones: {
      welcomeNew: {
        title: "Welcome New Students",
        description:
          "Celebrate new students joining your classes by offering them a discount or special welcome.",
        fullDescription:
          "Welcome new students to your class community with a warm, informative email that sets expectations, provides helpful tips, and includes a special new student discount for their next booking.",
        templateFile: "welcomeNew.html",
        triggers: ["After completing first class"],
        benefits: [
          "Warm welcome experience",
          "Sets clear expectations",
          "New student discount",
          "Builds community feeling",
        ],
      },
      birthdayGreeting: {
        title: "Birthday Greetings",
        description:
          "Send personalized birthday wishes to students with a special discount offer.",
        fullDescription:
          "Automatically send warm birthday greetings to your students on their special day. This automation includes a personalized message and a special birthday discount to encourage them to book their next class as a birthday treat.",
        templateFile: "birthdaySpecial.html",
        triggers: ["On student's birthday"],
        benefits: [
          "Personal touch builds loyalty",
          "Birthday discount increases bookings",
          "Shows you care about students",
          "Creates memorable moments",
        ],
      },
    },
    engagement: {
      thankYouVisit: {
        title: "Thank You for Attending",
        description:
          "Reach out to students when their class is checked out, with a link to leave a review.",
        fullDescription:
          "After students complete a class, this automation sends a thank you message with a request for a review and suggestions for their next learning step. It helps gather valuable feedback and encourages continued engagement.",
        templateFile: "thankYouVisit.html",
        triggers: ["Immediately after class is marked complete"],
        benefits: [
          "Gathers valuable reviews",
          "Shows appreciation",
          "Encourages next bookings",
          "Builds positive relationships",
        ],
      },
    },
  };

  // Time delay options for automation scheduling
  const timeDelayOptions = {
    immediate: { label: "Immediately", value: "immediate" },
    "15min": { label: "15 minutes", value: "15min" },
    "30min": { label: "30 minutes", value: "30min" },
    "1h": { label: "1 hour", value: "1h" },
    "2h": { label: "2 hours", value: "2h" },
    "3h": { label: "3 hours", value: "3h" },
    "6h": { label: "6 hours", value: "6h" },
    "12h": { label: "12 hours", value: "12h" },
    "24h": { label: "24 hours", value: "24h" },
    "2d": { label: "2 days", value: "2d" },
    "3d": { label: "3 days", value: "3d" },
    "1week": { label: "1 week", value: "1week" },
    "2weeks": { label: "2 weeks", value: "2weeks" },
    "3weeks": { label: "3 weeks", value: "3weeks" },
    "4weeks": { label: "4 weeks", value: "4weeks" },
    "6weeks": { label: "6 weeks", value: "6weeks" },
    "8weeks": { label: "8 weeks", value: "8weeks" },
    "3months": { label: "3 months", value: "3months" },
    "6months": { label: "6 months", value: "6months" },
  };

  // Get available time options for specific automation types
  const getAvailableTimeOptions = (category, automationType) => {
    const baseOptions = [
      "immediate",
      "15min",
      "30min",
      "1h",
      "2h",
      "3h",
      "6h",
      "12h",
      "24h",
      "2d",
      "3d",
    ];

    switch (category) {
      case "reminders":
        // Reminders can use any time before class
        return baseOptions;
      case "classUpdates":
        // Class updates should be immediate or very quick
        return ["immediate", "15min", "30min", "1h", "2h"];
      case "engagement":
        // Engagement can be immediate or shortly after
        return [
          "immediate",
          "15min",
          "30min",
          "1h",
          "2h",
          "3h",
          "6h",
          "12h",
          "24h",
        ];
      case "bookingBoost":
        // Booking boost uses longer time periods
        return [
          "1week",
          "2weeks",
          "3weeks",
          "4weeks",
          "6weeks",
          "8weeks",
          "3months",
          "6months",
        ];
      case "milestones":
        // Milestones are usually immediate or shortly after
        return [
          "immediate",
          "15min",
          "30min",
          "1h",
          "2h",
          "3h",
          "6h",
          "12h",
          "24h",
        ];
      default:
        return baseOptions;
    }
  };

  // Format time delay for display
  const formatTimeDelay = (timeDelay) => {
    return timeDelayOptions[timeDelay]?.label || timeDelay;
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/Login");
      return;
    }

    const getUserData = async () => {
      if (user?.uid) {
        try {
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);

            // Load saved automations or use defaults with fallbacks for new automations
            if (data.automations) {
              const defaultAutomations = {
                reminders: {
                  upcomingClass: {
                    enabled: true,
                    timeDelay: "24h",
                    customTime: "24h",
                    couponCode: "",
                    personalMessage: "",
                    mailsSent: 0
                  },
                  classReminder: {
                    enabled: true,
                    timeDelay: "1h",
                    customTime: "1h",
                    couponCode: "",
                    personalMessage: "",
                    mailsSent: 0
                  },
                },
                classUpdates: {
                  newBooking: {
                    enabled: true,
                    timeDelay: "immediate",
                    customTime: "immediate",
                    couponCode: "",
                    personalMessage: "",
                    mailsSent: 0
                  },
                  rescheduled: {
                    enabled: true,
                    timeDelay: "immediate",
                    customTime: "immediate",
                    couponCode: "",
                    personalMessage: "",
                    mailsSent: 0
                  },
                  cancelled: {
                    enabled: true,
                    timeDelay: "immediate",
                    customTime: "immediate",
                    couponCode: "",
                    personalMessage: "",
                    mailsSent: 0
                  },
                },
                engagement: {
                  thankYouVisit: {
                    enabled: true,
                    timeDelay: "immediate",
                    customTime: "immediate",
                    couponCode: "",
                    personalMessage: "",
                    mailsSent: 0
                  },
                },
                bookingBoost: {
                  reminderRebook: {
                    enabled: true,
                    timeDelay: "3weeks",
                    customTime: "3weeks",
                    couponCode: "",
                    personalMessage: "",
                    mailsSent: 0
                  },
                  winBackLapsed: {
                    enabled: false,
                    timeDelay: "8weeks",
                    customTime: "8weeks",
                    couponCode: "",
                    personalMessage: "",
                    mailsSent: 0
                  },
                },
                milestones: {
                  welcomeNew: {
                    enabled: true,
                    timeDelay: "immediate",
                    customTime: "immediate",
                    couponCode: "",
                    personalMessage: "",
                    mailsSent: 0
                  },
                  birthdayGreeting: {
                    enabled: false,
                    timeDelay: "immediate",
                    customTime: "immediate",
                    couponCode: "",
                    personalMessage: "",
                    mailsSent: 0
                  },
                },
              };

              // Merge saved automations with defaults, ensuring all automations have time customization
              const mergedAutomations = {};
              Object.keys(defaultAutomations).forEach((category) => {
                mergedAutomations[category] = {};
                Object.keys(defaultAutomations[category]).forEach(
                  (automationType) => {
                    const saved =
                      data.automations[category]?.[automationType] || {};
                    const defaults =
                      defaultAutomations[category][automationType];

                    mergedAutomations[category][automationType] = {
                      ...defaults,
                      ...saved,
                      // Ensure all required fields exist with proper defaults
                      customTime: saved.customTime || saved.timeDelay || defaults.customTime,
                      couponCode: saved.couponCode || defaults.couponCode,
                      personalMessage: saved.personalMessage || defaults.personalMessage,
                      mailsSent: saved.mailsSent || defaults.mailsSent,
                    };
                  }
                );
              });

              setAutomations(mergedAutomations);
            }
            console.log("User data loaded:", data);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    if (user) {
      getUserData();
      fetchVouchers();
    }
  }, [user, loading, router]);

  const saveAutomations = async (newAutomations) => {
    try {
      if (user?.uid) {
        await updateDoc(doc(db, "Users", user.uid), {
          automations: newAutomations,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Error saving automations:", error);
      toast.error("Failed to save settings");
    }
  };

  // Define which automations are free vs premium
  const isFreeAutomation = (category, automationKey) => {
    // Only these two automations are free
    return (
      (category === "reminders" && automationKey === "upcomingClass") || // 24 hours reminder
      (category === "classUpdates" && automationKey === "newBooking") // New Booking notification
    );
  };

  // Update automation time delay
  const updateAutomationTime = (category, automation, newTimeDelay) => {
    const newAutomations = {
      ...automations,
      [category]: {
        ...automations[category],
        [automation]: {
          ...automations[category][automation],
          customTime: newTimeDelay,
          timeDelay: newTimeDelay, // Keep both for compatibility
        },
      },
    };
    setAutomations(newAutomations);
    saveAutomations(newAutomations);
    toast.success("Automation timing updated!");
  };

  // Update automation coupon code
  const updateAutomationCoupon = (category, automation, couponCode) => {
    const newAutomations = {
      ...automations,
      [category]: {
        ...automations[category],
        [automation]: {
          ...automations[category][automation],
          couponCode: couponCode,
        },
      },
    };
    setAutomations(newAutomations);
    saveAutomations(newAutomations);
    toast.success("Coupon code updated!");
  };

  // Update automation personal message
  const updateAutomationMessage = (category, automation, personalMessage) => {
    const newAutomations = {
      ...automations,
      [category]: {
        ...automations[category],
        [automation]: {
          ...automations[category][automation],
          personalMessage: personalMessage,
        },
      },
    };
    setAutomations(newAutomations);
    saveAutomations(newAutomations);
  };

  // Open unified manage modal
  const openManageModal = (category, automation) => {
    setShowManageModal({ category, automation });
    setManageModalTab("description");
  };

  // Close manage modal
  const closeManageModal = () => {
    setShowManageModal(null);
    setManageModalTab("description");
  };

  // Fetch vouchers for coupon code selection
  const fetchVouchers = async () => {
    try {
      if (user?.uid) {
        const querySnapshot = await getDocs(
          query(
            collection(db, "vouchers"),
            where("userId", "==", user.uid),
          )
        );

        const fetchedVouchers = querySnapshot?.docs?.map?.((doc) => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        
        // Filter active vouchers (not expired and has remaining uses)
        const activeVouchers = fetchedVouchers.filter(voucher => {
          const now = new Date();
          const expiryDate = voucher.expiryDate?.toDate ? voucher.expiryDate.toDate() : new Date(voucher.expiryDate);
          return expiryDate > now && (voucher.remainingUses > 0 || voucher.remainingUses === -1);
        });

        // Sort by expiry date
        activeVouchers.sort((a, b) => {
          const dateA = a.expiryDate?.toDate ? a.expiryDate.toDate() : new Date(a.expiryDate);
          const dateB = b.expiryDate?.toDate ? b.expiryDate.toDate() : new Date(b.expiryDate);
          return dateA - dateB;
        });

        setVouchers(activeVouchers || []);
      }
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      toast.error("Failed to load vouchers");
    }
  };

  // Create a new voucher for automation
  const createVoucher = async (voucherData) => {
    try {
      if (!user?.uid) return null;

      const newVoucher = {
        ...voucherData,
        userId: user.uid,
        instructorId: user.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
        discountValue: Number(voucherData.discountValue),
        remainingUses: Number(voucherData.remainingUses),
        expiryDate: new Date(voucherData.expiryDate),
      };

      // Check if voucher code already exists
      const allVouchersSnapshot = await getDocs(
        query(
          collection(db, 'vouchers'),
          where('userId', '==', user.uid),
          where('code', '==', newVoucher.code)
        )
      );
      const existingVoucher = allVouchersSnapshot.docs.find(doc => doc.data().code === newVoucher.code);
      if (existingVoucher) {
        toast.error("Voucher code already exists. Please choose a different code.");
        return null;
      }

      const docRef = await addDoc(collection(db, 'vouchers'), newVoucher);
      const createdVoucher = { id: docRef.id, ...newVoucher };
      
      setVouchers([...vouchers, createdVoucher]);
      toast.success('Voucher created successfully!');
      
      return createdVoucher;
    } catch (error) {
      console.error("Error creating voucher:", error);
      toast.error("Failed to create voucher");
      return null;
    }
  };

  const toggleAutomation = (category, automation) => {
    // Check if this is a premium automation and user doesn't have premium access
    if (!isFreeAutomation(category, automation)) {
      const today = new Date();
      const premiumExpire = timestampToDate(userData?.premiumExpire);
      if (!premiumExpire || premiumExpire < today) {
        toast.error(
          "Premium subscription required for this automation feature!"
        );
        setShowPremiumModal(true);
        return;
      }
    }

    const newAutomations = {
      ...automations,
      [category]: {
        ...automations[category],
        [automation]: {
          ...automations[category][automation],
          enabled: !automations[category][automation].enabled,
        },
      },
    };
    setAutomations(newAutomations);
    saveAutomations(newAutomations);
  };

  const tabs = [
    { id: "reminders", label: "Reminders", icon: BellIcon },
    { id: "classUpdates", label: "Class Updates", icon: CalendarIcon },
    { id: "bookingBoost", label: "Booking Boost", icon: TrendingUpIcon },
    { id: "milestones", label: "Milestones", icon: StarIcon },
    { id: "engagement", label: "Engagement", icon: HeartIcon },
  ];

  const AutomationCard = ({
    icon: Icon,
    title,
    description,
    enabled,
    onToggle,
    hasSettings = false,
    isPremium = false,
    onManage,
    category,
    automationType,
    currentTimeDelay,
    mailsSent = 0,
    couponCode = "",
    personalMessage = "",
  }) => {
    const today = new Date();
    const premiumExpire = timestampToDate(userData?.premiumExpire);
    const hasValidPremium = premiumExpire && premiumExpire >= today;
    const isLocked = isPremium && !hasValidPremium;
    const canCustomize = hasValidPremium || !isPremium;

    return (
      <div
        className={`bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow ${
          isLocked ? "opacity-75" : ""
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div
              className={`p-3 rounded-lg ${
                enabled && !isLocked ? "bg-[#E63F2B]/10" : "bg-gray-100"
              }`}
            >
              <Icon
                className={`w-6 h-6 ${
                  enabled && !isLocked ? "text-[#E63F2B]" : "text-gray-500"
                }`}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                {isPremium ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-400 to-yellow-500 text-white">
                    Premium
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-400 to-green-500 text-white">
                    Free
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                {description}
              </p>

              {/* Premium Features Preview */}
              {hasValidPremium && (couponCode || personalMessage) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                  <div className="space-y-2">
                    {couponCode && (
                      <div className="flex items-center space-x-2">
                        <CashIcon className="w-4 h-4 text-yellow-600" />
                        <span className="text-xs text-yellow-700">
                          Coupon: <code className="bg-yellow-200 px-1 rounded">{couponCode}</code>
                        </span>
                      </div>
                    )}
                    {personalMessage && (
                      <div className="flex items-center space-x-2">
                        <ChatAltIcon className="w-4 h-4 text-yellow-600" />
                        <span className="text-xs text-yellow-700">
                          Personal message added
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    enabled && !isLocked
                      ? "bg-green-100 text-green-800"
                      : isLocked
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {enabled && !isLocked
                    ? "Enabled"
                    : isLocked
                    ? "Premium Required"
                    : "Disabled"}
                </span>
                <button
                  onClick={onManage}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                >
                  <EyeIcon className="w-3 h-3 mr-1" />
                  Manage
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {isLocked && (
              <button
                onClick={() => setShowPremiumModal(true)}
                className="px-3 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full hover:bg-yellow-200 transition-colors"
              >
                Upgrade
              </button>
            )}
            <button
              onClick={onToggle}
              disabled={isLocked}
              className={`relative inline-flex h-6 w-11 items-centers rounded-full items-center  transition-colors ${
                enabled && !isLocked ? "bg-[#E63F2B]" : "bg-gray-300"
              } ${isLocked ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  enabled && !isLocked ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    );
  };
  const renderTabContent = () => {
    switch (activeTab) {
      case "reminders":
        return (
          <div className="space-y-6">
            <AutomationCard
              icon={ClockIcon}
              title="Upcoming Class Reminder"
              description="Automatically sends to students 24 hours before their upcoming class."
              enabled={automations.reminders.upcomingClass.enabled}
              onToggle={() => toggleAutomation("reminders", "upcomingClass")}
              onManage={() => openManageModal("reminders", "upcomingClass")}
              hasSettings={true}
              isPremium={false} // This is free
              category="reminders"
              automationType="upcomingClass"
              currentTimeDelay={
                automations.reminders.upcomingClass.customTime ||
                automations.reminders.upcomingClass.timeDelay
              }
              mailsSent={automations.reminders.upcomingClass.mailsSent || 0}
              couponCode={automations.reminders.upcomingClass.couponCode || ""}
              personalMessage={automations.reminders.upcomingClass.personalMessage || ""}
            />
            <AutomationCard
              icon={BellIcon}
              title="1 Hour Class Reminder"
              description="Send students a final reminder 1 hour before their class starts."
              enabled={automations.reminders.classReminder.enabled}
              onToggle={() => toggleAutomation("reminders", "classReminder")}
              onManage={() => openManageModal("reminders", "classReminder")}
              hasSettings={true}
              isPremium={true} // This is premium
              category="reminders"
              automationType="classReminder"
              currentTimeDelay={
                automations.reminders.classReminder.customTime ||
                automations.reminders.classReminder.timeDelay
              }
              mailsSent={automations.reminders.classReminder.mailsSent || 0}
              couponCode={automations.reminders.classReminder.couponCode || ""}
              personalMessage={automations.reminders.classReminder.personalMessage || ""}
            />
          </div>
        );

      case "classUpdates":
        return (
          <div className="space-y-6">
            <AutomationCard
              icon={CalendarIcon}
              title="New Class Booking"
              description="Reach out to students when their class is booked for them."
              enabled={automations.classUpdates.newBooking.enabled}
              onToggle={() => toggleAutomation("classUpdates", "newBooking")}
              onManage={() => openManageModal("classUpdates", "newBooking")}
              hasSettings={true}
              isPremium={false} // This is free
              category="classUpdates"
              automationType="newBooking"
              currentTimeDelay={
                automations.classUpdates.newBooking.customTime ||
                automations.classUpdates.newBooking.timeDelay
              }
              mailsSent={automations.classUpdates.newBooking.mailsSent || 0}
              couponCode={automations.classUpdates.newBooking.couponCode || ""}
              personalMessage={automations.classUpdates.newBooking.personalMessage || ""}
            />
            <AutomationCard
              icon={RefreshIcon}
              title="Rescheduled Class"
              description="Automatically sends to students when their class start time is changed."
              enabled={automations.classUpdates.rescheduled.enabled}
              onToggle={() => toggleAutomation("classUpdates", "rescheduled")}
              onManage={() => openManageModal("classUpdates", "rescheduled")}
              hasSettings={true}
              isPremium={true}
              category="classUpdates"
              automationType="rescheduled"
              currentTimeDelay={
                automations.classUpdates.rescheduled.customTime ||
                automations.classUpdates.rescheduled.timeDelay
              }
              mailsSent={automations.classUpdates.rescheduled.mailsSent || 0}
              couponCode={automations.classUpdates.rescheduled.couponCode || ""}
              personalMessage={automations.classUpdates.rescheduled.personalMessage || ""}
            />
            <AutomationCard
              icon={XIcon}
              title="Cancelled Class"
              description="Automatically sends to students when their class is cancelled."
              enabled={automations.classUpdates.cancelled.enabled}
              onToggle={() => toggleAutomation("classUpdates", "cancelled")}
              onManage={() => openManageModal("classUpdates", "cancelled")}
              hasSettings={true}
              isPremium={true}
              category="classUpdates"
              automationType="cancelled"
              currentTimeDelay={
                automations.classUpdates.cancelled.customTime ||
                automations.classUpdates.cancelled.timeDelay
              }
              mailsSent={automations.classUpdates.cancelled.mailsSent || 0}
              couponCode={automations.classUpdates.cancelled.couponCode || ""}
              personalMessage={automations.classUpdates.cancelled.personalMessage || ""}
            />
          </div>
        );

      case "bookingBoost":
        return (
          <div className="space-y-6">
            <AutomationCard
              icon={RefreshIcon}
              title="Reminder to Rebook"
              description="Remind your students to rebook a few weeks after their last class."
              enabled={automations.bookingBoost.reminderRebook.enabled}
              onToggle={() =>
                toggleAutomation("bookingBoost", "reminderRebook")
              }
              onManage={() =>
                openManageModal("bookingBoost", "reminderRebook")
              }
              hasSettings={true}
              isPremium={true}
              category="bookingBoost"
              automationType="reminderRebook"
              currentTimeDelay={
                automations.bookingBoost.reminderRebook.customTime ||
                automations.bookingBoost.reminderRebook.timeDelay
              }
              mailsSent={automations.bookingBoost.reminderRebook.mailsSent || 0}
              couponCode={automations.bookingBoost.reminderRebook.couponCode || ""}
              personalMessage={automations.bookingBoost.reminderRebook.personalMessage || ""}
            />
            <AutomationCard
              icon={TrendingUpIcon}
              title="Win Back Lapsed Students"
              description="Reach students that you haven't seen for a while and encourage them to book their next class."
              enabled={automations.bookingBoost.winBackLapsed.enabled}
              onToggle={() => toggleAutomation("bookingBoost", "winBackLapsed")}
              onManage={() =>
                openManageModal("bookingBoost", "winBackLapsed")
              }
              hasSettings={true}
              isPremium={true}
              category="bookingBoost"
              automationType="winBackLapsed"
              currentTimeDelay={
                automations.bookingBoost.winBackLapsed.customTime ||
                automations.bookingBoost.winBackLapsed.timeDelay
              }
              mailsSent={automations.bookingBoost.winBackLapsed.mailsSent || 0}
              couponCode={automations.bookingBoost.winBackLapsed.couponCode || ""}
              personalMessage={automations.bookingBoost.winBackLapsed.personalMessage || ""}
            />
          </div>
        );

      case "milestones":
        return (
          <div className="space-y-6">
            <AutomationCard
              icon={UserAddIcon}
              title="Welcome New Students"
              description="Celebrate new students joining your classes by offering them a discount or special welcome."
              enabled={automations.milestones?.welcomeNew?.enabled || false}
              onToggle={() => toggleAutomation("milestones", "welcomeNew")}
              onManage={() => openManageModal("milestones", "welcomeNew")}
              hasSettings={true}
              isPremium={true}
              category="milestones"
              automationType="welcomeNew"
              currentTimeDelay={
                automations.milestones?.welcomeNew?.customTime ||
                automations.milestones?.welcomeNew?.timeDelay ||
                "immediate"
              }
              mailsSent={automations.milestones?.welcomeNew?.mailsSent || 0}
              couponCode={automations.milestones?.welcomeNew?.couponCode || ""}
              personalMessage={automations.milestones?.welcomeNew?.personalMessage || ""}
            />
            <AutomationCard
              icon={GiftIcon}
              title="Birthday Greetings"
              description="Send personalized birthday wishes to students with a special discount offer."
              enabled={
                automations.milestones?.birthdayGreeting?.enabled || false
              }
              onToggle={() =>
                toggleAutomation("milestones", "birthdayGreeting")
              }
              onManage={() =>
                openManageModal("milestones", "birthdayGreeting")
              }
              hasSettings={true}
              isPremium={true}
              category="milestones"
              automationType="birthdayGreeting"
              currentTimeDelay={
                automations.milestones?.birthdayGreeting?.customTime ||
                automations.milestones?.birthdayGreeting?.timeDelay ||
                "immediate"
              }
              mailsSent={automations.milestones?.birthdayGreeting?.mailsSent || 0}
              couponCode={automations.milestones?.birthdayGreeting?.couponCode || ""}
              personalMessage={automations.milestones?.birthdayGreeting?.personalMessage || ""}
            />
          </div>
        );

      case "engagement":
        return (
          <div className="space-y-6">
            <AutomationCard
              icon={ThumbUpIcon}
              title="Thank You for Attending"
              description="Reach out to students when their class is checked out, with a link to leave a review."
              enabled={automations.engagement.thankYouVisit.enabled}
              onToggle={() => toggleAutomation("engagement", "thankYouVisit")}
              onManage={() => openManageModal("engagement", "thankYouVisit")}
              hasSettings={true}
              isPremium={true}
              category="engagement"
              automationType="thankYouVisit"
              currentTimeDelay={
                automations.engagement.thankYouVisit.customTime ||
                automations.engagement.thankYouVisit.timeDelay
              }
              mailsSent={automations.engagement.thankYouVisit.mailsSent || 0}
              couponCode={automations.engagement.thankYouVisit.couponCode || ""}
              personalMessage={automations.engagement.thankYouVisit.personalMessage || ""}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const getAutomationData = (category, automationKey) => {
    return automationDefinitions[category]?.[automationKey] || null;
  };

  const openAutomationModal = (category, automationKey) => {
    const automationData = getAutomationData(category, automationKey);
    if (automationData) {
      setSelectedAutomation({
        category,
        key: automationKey,
        ...automationData,
      });
      setModalTab("description");
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAutomation(null);
    setModalTab("description");
  };

  const handlePremiumPurchaseSuccess = () => {
    // Refresh user data to get updated premium status
    const refreshUserData = async () => {
      if (user?.uid) {
        try {
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
            toast.success("Premium features are now available!");
          }
        } catch (error) {
          console.error("Error refreshing user data:", error);
        }
      }
    };
    refreshUserData();
  };

  const handleRenewPremium = () => {
    // Calculate the new expiry date
    const today = new Date();
    const currentPremiumExpire = timestampToDate(userData?.premiumExpire);

    let newExpiryDate;
    if (!currentPremiumExpire || currentPremiumExpire < today) {
      // If expired or no expiry date, add 30 days from today
      newExpiryDate = new Date(today);
      newExpiryDate.setDate(today.getDate() + 30);
    } else {
      // If still active, add 30 days from current expiry
      newExpiryDate = new Date(currentPremiumExpire);
      newExpiryDate.setDate(currentPremiumExpire.getDate() + 30);
    }

    // Open premium modal for renewal
    setShowPremiumModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-var(--navbar-height,80px))] bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#E63F2B]"></div>
      </div>
    );
  }

  if (!userData?.isInstructor) {
    return (
      <div className="min-h-[calc(100vh-var(--navbar-height,80px))] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            This page is only available to instructors.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-var(--navbar-height,80px))] bg-gray-50">
      <Head>
        <title>Automations - PocketClass</title>
        <meta
          name="description"
          content="Manage your automated messages and notifications"
        />
        <link rel="icon" href="/pc_favicon.ico" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Email Automations
          </h1>
          <p className="text-gray-600">
            Engage students with automated messages. Start free with basic
            reminders or upgrade for advanced features.
          </p>
        </div>

        {/* Premium Status Banner */}
        {(() => {
          const today = new Date();
          const premiumExpire = timestampToDate(userData?.premiumExpire);
          const hasValidPremium = premiumExpire && premiumExpire >= today;

          if (!hasValidPremium) {
            // No active subscription - show "Buy Premium" CTA
            return (
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 mb-4 border-l-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/20 rounded-lg">
                      <StarIcon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-white">
                      <h3 className="text-lg font-semibold mb-1">
                        Unlock Premium Automations
                      </h3>
                      <p className="text-white/90 text-sm">
                        Get access to advanced automation features like class
                        updates, booking boost, milestones, and engagement
                        tools.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setShowPremiumModal(true)}
                      className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                      Buy Premium
                    </button>
                  </div>
                </div>
              </div>
            );
          } else {
            // Active subscription - show expiry date and renew button
            const daysUntilExpiry = Math.ceil(
              (premiumExpire - today) / (1000 * 60 * 60 * 24)
            );
            const isExpiringSoon = daysUntilExpiry <= 7;

            return (
              <div
                className={`rounded-xl p-6 mb-4 border-l-4 ${
                  isExpiringSoon
                    ? "bg-gradient-to-r from-orange-50 to-red-50 border-orange-400"
                    : "bg-gradient-to-r from-green-50 to-emerald-50 border-green-400"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-3 rounded-lg ${
                        isExpiringSoon ? "bg-orange-100" : "bg-green-100"
                      }`}
                    >
                      <CheckCircleIcon
                        className={`w-8 h-8 ${
                          isExpiringSoon ? "text-orange-600" : "text-green-600"
                        }`}
                      />
                    </div>
                    <div>
                      <h3
                        className={`text-lg font-semibold mb-1 ${
                          isExpiringSoon ? "text-orange-900" : "text-green-900"
                        }`}
                      >
                        {isExpiringSoon
                          ? "Premium Expiring Soon"
                          : "Premium Active"}
                      </h3>
                      <p
                        className={`text-sm ${
                          isExpiringSoon ? "text-orange-700" : "text-green-700"
                        }`}
                      >
                        {isExpiringSoon
                          ? `Your premium subscription expires in ${daysUntilExpiry} day${
                              daysUntilExpiry === 1 ? "" : "s"
                            } (${premiumExpire.toLocaleDateString()})`
                          : `Premium subscription active until ${premiumExpire.toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <a
                    href={`/profile/${user?.uid}`}
                      className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                        isExpiringSoon
                          ? "bg-orange-600 text-white hover:bg-orange-700"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      Manage Premium
                    </a>
                  </div>
                </div>
              </div>
            );
          }
        })()}

        {/* Top Banner */}
        <div className="bg-gradient-to-r from-[#E63F2B] to-[#FF6B5A] rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between text-white">
            <div>
              <h2 className="text-lg font-semibold mb-2">
                Boost Your Student Engagement
              </h2>
              <p className="text-white/90">
                Automatically send personalized messages to keep your students
                engaged and coming back for more classes.
              </p>
            </div>
            <div className="hidden md:block">
              <ChatAltIcon className="w-16 h-16 text-white/30" />
            </div>
          </div>
        </div>

        {/* Automation Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-900">
                  Free Automations
                </h3>
                <p className="text-sm text-green-700">Always available</p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span>24-hour Class Reminders</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span>New Booking Notifications</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <StarIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-yellow-900">
                  Premium Automations
                </h3>
                <p className="text-sm text-yellow-700">
                  {(() => {
                    const today = new Date();
                    const premiumExpire = timestampToDate(
                      userData?.premiumExpire
                    );
                    const hasValidPremium =
                      premiumExpire && premiumExpire >= today;
                    return hasValidPremium ? "Active" : "Premium required";
                  })()}
                </p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-yellow-800">
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                <span>1-hour Reminders & All Other Automations</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                <span>
                  <strong>Customizable Send Times</strong> - Choose exactly when
                  to send
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                <span>
                  <strong>Coupon Codes & Personal Messages</strong> - Add special offers and personal touches
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                <span>Email Statistics & Analytics</span>
              </li>
            </ul>
            {(() => {
              const today = new Date();
              const premiumExpire = timestampToDate(userData?.premiumExpire);
              const hasValidPremium = premiumExpire && premiumExpire >= today;
              if (!hasValidPremium) {
                return (
                  <button
                    onClick={() => setShowPremiumModal(true)}
                    className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-medium rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all"
                  >
                    Upgrade to Premium
                  </button>
                );
              }
            })()}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 overflow-y-hidden overflow-x-auto">
            <nav className="flex space-x-8 min-w-max">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? "border-[#E63F2B] text-[#E63F2B]"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-8">{renderTabContent()}</div>
      </div>

      {/* Unified Manage Modal */}
      {showManageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-[#E63F2B]/10 rounded-lg">
                  <MailIcon className="w-6 h-6 text-[#E63F2B]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {automationDefinitions[showManageModal.category]?.[showManageModal.automation]?.title || 'Manage Automation'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Configure settings, preview email, and view stats
                  </p>
                </div>
              </div>
              <button
                onClick={closeManageModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: "description", label: "Description", icon: InformationCircleIcon },
                  ...(() => {
                    const today = new Date();
                    const premiumExpire = timestampToDate(userData?.premiumExpire);
                    const hasValidPremium = premiumExpire && premiumExpire >= today;
                    const isPremiumAutomation = !isFreeAutomation(showManageModal.category, showManageModal.automation);
                    const isReminderOrClassUpdate = showManageModal.category === "reminders" || showManageModal.category === "classUpdates";
                    
                    // Specific automations that should not have settings (timing) configuration
                    const noSettingsAutomations = [
                      { category: "milestones", automation: "welcomeNew" },
                      { category: "milestones", automation: "birthdayGreeting" },
                      { category: "engagement", automation: "thankYouVisit" },
                      { category: "classUpdates", automation: "newBooking" },
                      { category: "classUpdates", automation: "rescheduled" },
                      { category: "classUpdates", automation: "cancelled" }
                    ];
                    
                    const shouldHideSettings = noSettingsAutomations.some(
                      item => item.category === showManageModal.category && item.automation === showManageModal.automation
                    );
                    
                    const tabs = [];
                    
                    // Only show settings and customization tabs for premium automations when user has premium
                    // BUT never show customization for reminders or class updates
                    // AND never show settings for specific automations (welcomeNew, birthdayGreeting, thankYouVisit)
                    if (isPremiumAutomation) {
                      // Only show settings if it's not in the excluded list
                      if (!shouldHideSettings) {
                        tabs.push({ id: "settings", label: "Settings", icon: ClockIcon });
                      }
                      
                      // Never show customization for reminders or class updates
                      if (!isReminderOrClassUpdate) {
                        tabs.push({ id: "customization", label: "Customization", icon: ChatAltIcon });
                      }
                    }
                    
                    return tabs;
                  })(),
                  { id: "email", label: "Email Preview", icon: EyeIcon },
                  { id: "stats", label: "Stats", icon: TrendingUpIcon }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setManageModalTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                      manageModalTab === tab.id
                        ? "border-[#E63F2B] text-[#E63F2B]"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {manageModalTab === "description" && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      How it Works
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {automationDefinitions[showManageModal.category]?.[showManageModal.automation]?.fullDescription}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      When it Triggers
                    </h4>
                    <ul className="space-y-2">
                      {automationDefinitions[showManageModal.category]?.[showManageModal.automation]?.triggers.map((trigger, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-[#E63F2B] rounded-full"></div>
                          <span className="text-gray-700">{trigger}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      Key Benefits
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {automationDefinitions[showManageModal.category]?.[showManageModal.automation]?.benefits.map((benefit, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 bg-green-50 p-3 rounded-lg"
                        >
                          <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span className="text-green-800 text-sm">
                            {benefit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {manageModalTab === "settings" && (
                <div className="space-y-6">
                  {(() => {
                    // Check if this automation should not have settings
                    const noSettingsAutomations = [
                      { category: "milestones", automation: "welcomeNew" },
                      { category: "milestones", automation: "birthdayGreeting" },
                      { category: "engagement", automation: "thankYouVisit" }
                    ];
                    
                    const shouldHideSettings = noSettingsAutomations.some(
                      item => item.category === showManageModal.category && item.automation === showManageModal.automation
                    );

                    if (shouldHideSettings) {
                      return (
                        <div className="text-center py-8">
                          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                            <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">
                              No Timing Settings Available
                            </h4>
                            <p className="text-sm text-gray-600">
                              This automation uses fixed timing and cannot be customized.
                            </p>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">
                          Timing Settings
                        </h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Choose when this automation should be sent
                        </p>
                        <div className="space-y-3">
                          {getAvailableTimeOptions(
                            showManageModal.category,
                            showManageModal.automation
                          ).map((timeOption) => (
                            <button
                              key={timeOption}
                              onClick={() =>
                                updateAutomationTime(
                                  showManageModal.category,
                                  showManageModal.automation,
                                  timeOption
                                )
                              }
                              className={`w-full text-left px-4 py-3 rounded-lg border hover:bg-gray-50 transition-colors ${
                                (automations[showManageModal.category]?.[
                                  showManageModal.automation
                                ]?.customTime ||
                                  automations[showManageModal.category]?.[
                                    showManageModal.automation
                                  ]?.timeDelay) === timeOption
                                  ? "border-[#E63F2B] bg-[#E63F2B]/5 text-[#E63F2B]"
                                  : "border-gray-200 text-gray-900"
                              }`}
                            >
                              <div className="font-medium">
                                {timeDelayOptions[timeOption]?.label || timeOption}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                {timeOption === "immediate"
                                  ? "Sent right away"
                                  : timeOption.includes("week") ||
                                    timeOption.includes("month")
                                  ? `${timeDelayOptions[timeOption]?.label} after last class`
                                  : `${timeDelayOptions[timeOption]?.label} before class starts`}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {manageModalTab === "customization" && (
                <div className="space-y-6">
                  {(() => {
                    const today = new Date();
                    const premiumExpire = timestampToDate(userData?.premiumExpire);
                    const hasValidPremium = premiumExpire && premiumExpire >= today;
                    const isPremiumAutomation = !isFreeAutomation(showManageModal.category, showManageModal.automation);
                    const isReminderOrClassUpdate = showManageModal.category === "reminders" || showManageModal.category === "classUpdates";

                    // Never show customization for reminders or class updates
                    if (isReminderOrClassUpdate) {
                      return (
                        <div className="text-center py-8">
                          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                            <InformationCircleIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">
                              No Customization Available
                            </h4>
                            <p className="text-sm text-gray-600">
                              Customization is not available for {showManageModal.category === "reminders" ? "reminder" : "class update"} automations.
                            </p>
                          </div>
                        </div>
                      );
                    }

                    if (isPremiumAutomation && !hasValidPremium) {
  return (
    <div className="text-center py-8">
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
        <StarIcon className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
        <h4 className="text-lg font-semibold text-yellow-900 mb-2">
          Premium Feature
        </h4>
        <p className="text-sm text-yellow-700">
          Coupon codes and personal messages are available with a premium subscription.
        </p>
      </div>

      {/* Coupon Code UI (Disabled) */}
      <div className="text-left mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">
          Coupon Code
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          Select an existing voucher or create a new one for this automation
        </p>

        <select
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
          disabled
        >
          <option>Upgrade to select a voucher</option>
        </select>

        <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
          <button
            disabled
            className="w-full px-4 py-3 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <GiftIcon className="w-5 h-5" />
            <span>Create New Voucher</span>
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-2 italic">
          Leave empty if you don't want to include a coupon code
        </p>
      </div>

      {/* Personal Message UI (Disabled) */}
      <div className="text-left mb-8">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">
          Personal Message
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          Add a personal touch to your automated emails
        </p>

        <textarea
          rows={4}
          disabled
          placeholder="Premium feature. Upgrade to add a personal message."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 resize-none cursor-not-allowed"
        />

        <p className="text-xs text-gray-400 mt-2 italic">
          This will be added to the email template.
        </p>
      </div>

      {/* Upgrade Button */}
      <button
        onClick={() => {
          closeManageModal();
          setShowPremiumModal(true);
        }}
        className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all"
      >
        Upgrade to Premium
      </button>
    </div>
  );
}


                    return (
                      <>
                        {/* Only show coupon codes for non-reminder and non-class-update automations */}
                        {showManageModal.category !== "reminders" && showManageModal.category !== "classUpdates" && (
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">
                              Coupon Code
                            </h4>
                            <p className="text-sm text-gray-600 mb-4">
                              Select an existing voucher or create a new one for this automation
                            </p>
                            
                            {/* Current Coupon Code Display */}
                            {automations[showManageModal.category]?.[showManageModal.automation]?.couponCode && (
                              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <GiftIcon className="w-5 h-5 text-green-600" />
                                    <span className="font-medium text-green-800">
                                      Current: {automations[showManageModal.category]?.[showManageModal.automation]?.couponCode}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() =>
                                      updateAutomationCoupon(
                                        showManageModal.category,
                                        showManageModal.automation,
                                        ""
                                      )
                                    }
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <XIcon className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Select Existing Voucher */}
                            <div className="space-y-3 mb-4">
                              <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-700">
                                  Select Existing Voucher
                                </label>
                                <button
                                  onClick={fetchVouchers}
                                  className="text-[#E63F2B] hover:text-[#E63F2B]/80 text-sm flex items-center space-x-1"
                                >
                                  <RefreshIcon className="w-4 h-4" />
                                  <span>Refresh</span>
                                </button>
                              </div>
                              {vouchers.length > 0 ? (
                                <select
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E63F2B] focus:border-[#E63F2B]"
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      updateAutomationCoupon(
                                        showManageModal.category,
                                        showManageModal.automation,
                                        e.target.value
                                      );
                                    }
                                  }}
                                  value=""
                                >
                                  <option value="">Choose a voucher...</option>
                                  {vouchers.map((voucher) => (
                                    <option key={voucher.id} value={voucher.code}>
                                      {voucher.code} - {voucher.discountValue}
                                      {voucher.discountType === "percentage" ? "%" : "$"} off
                                      (Expires: {voucher.expiryDate?.toDate ? 
                                        voucher.expiryDate.toDate().toLocaleDateString() : 
                                        new Date(voucher.expiryDate).toLocaleDateString()})
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <p className="text-sm text-gray-500 italic">No active vouchers found</p>
                              )}
                            </div>

                            {/* Quick Voucher Creation */}
                            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                              <button
                                onClick={() => setShowVoucherModal(true)}
                                className="w-full px-4 py-3 bg-[#E63F2B] text-white rounded-lg hover:bg-[#E63F2B]/90 transition-colors flex items-center justify-center space-x-2"
                              >
                                <GiftIcon className="w-5 h-5" />
                                <span>Create New Voucher</span>
                              </button>
                            </div>
                            
                            <p className="text-xs text-gray-500 mt-2">
                              Leave empty if you don't want to include a coupon code
                            </p>
                          </div>
                        )}

                        {/* Only show personal message for non-reminder and non-class-update automations */}
                        {showManageModal.category !== "reminders" && showManageModal.category !== "classUpdates" && (
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">
                              Personal Message
                            </h4>
                            <p className="text-sm text-gray-600 mb-4">
                              Add a personal touch to your automated emails
                            </p>
                            <div className="space-y-3">
                              <textarea
                                rows={4}
                                placeholder="e.g., I hope you enjoyed our session! Looking forward to seeing you again soon. - Sarah"
                                value={automations[showManageModal.category]?.[showManageModal.automation]?.personalMessage || ""}
                                onChange={(e) =>
                                  updateAutomationMessage(
                                    showManageModal.category,
                                    showManageModal.automation,
                                    e.target.value
                                  )
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E63F2B] focus:border-[#E63F2B] resize-none"
                              />
                              <p className="text-xs text-gray-500">
                                Keep it short and personal. This will be added to the email template.
                              </p>
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}

              {manageModalTab === "email" && (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Email Preview
                    </h4>
                    <p className="text-sm text-gray-600">
                      This is how the email will appear to your students:
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <iframe
                      src={`/api/email-template?template=${automationDefinitions[showManageModal.category]?.[showManageModal.automation]?.templateFile}&couponCode=${automations[showManageModal.category]?.[showManageModal.automation]?.couponCode || ""}&personalMessage=${encodeURIComponent(automations[showManageModal.category]?.[showManageModal.automation]?.personalMessage || "")}`}
                      className="w-full h-96 border-none"
                      title="Email Preview"
                    />
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>Note:</strong> Template variables (like{" "}
                      {`{{studentFirstName}}`}) will be automatically replaced
                      with actual student data when the email is sent.
                    </p>
                  </div>
                </div>
              )}

              {manageModalTab === "stats" && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      Email Statistics
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-blue-50 rounded-lg p-6">
                        <div className="flex items-center space-x-3 mb-2">
                          <MailIcon className="w-8 h-8 text-blue-600" />
                          <div>
                            <h5 className="font-semibold text-blue-900">Emails Sent</h5>
                            <p className="text-sm text-blue-700">Total sent</p>
                          </div>
                        </div>
                        <p className="text-3xl font-bold text-blue-800">
                          {(automations[showManageModal.category]?.[showManageModal.automation]?.mailsSent || 0).toLocaleString()}
                        </p>
                      </div>

                      <div className="bg-green-50 rounded-lg p-6">
                        <div className="flex items-center space-x-3 mb-2">
                          <CheckCircleIcon className="w-8 h-8 text-green-600" />
                          <div>
                            <h5 className="font-semibold text-green-900">Status</h5>
                            <p className="text-sm text-green-700">Current state</p>
                          </div>
                        </div>
                        <p className="text-lg font-bold text-green-800">
                          {automations[showManageModal.category]?.[showManageModal.automation]?.enabled ? "Enabled" : "Disabled"}
                        </p>
                      </div>

                      <div className="bg-yellow-50 rounded-lg p-6">
                        <div className="flex items-center space-x-3 mb-2">
                          <ClockIcon className="w-8 h-8 text-yellow-600" />
                          <div>
                            <h5 className="font-semibold text-yellow-900">Timing</h5>
                            <p className="text-sm text-yellow-700">Send timing</p>
                          </div>
                        </div>
                        <p className="text-lg font-bold text-yellow-800">
                          {formatTimeDelay(automations[showManageModal.category]?.[showManageModal.automation]?.customTime || "immediate")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Note:</strong> Email statistics are updated in real-time as automations are triggered.
                      Stats may take a few minutes to reflect recent activity.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-500">
                Template: {automationDefinitions[showManageModal.category]?.[showManageModal.automation]?.templateFile}
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={closeManageModal}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Voucher Creation Modal */}
      {showVoucherModal && (
        <VoucherCreationModal
          isOpen={showVoucherModal}
          onClose={() => setShowVoucherModal(false)}
          onVoucherCreated={(voucher) => {
            if (showManageModal) {
              updateAutomationCoupon(
                showManageModal.category,
                showManageModal.automation,
                voucher.code
              );
            }
            setShowVoucherModal(false);
          }}
          createVoucher={createVoucher}
        />
      )}

      {/* Premium Purchase Modal */}
      <PremiumPurchaseModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        user={user}
        userData={userData}
        onPurchaseSuccess={handlePremiumPurchaseSuccess}
      />
    </div>
  );
};

export default AutomationsPage;
