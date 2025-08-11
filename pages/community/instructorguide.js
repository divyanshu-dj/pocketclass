
import Footer from "/components/Footer";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../../styles/Instructorguide.module.css";
import React, { useState, useRef, useEffect } from "react";
import VideoPlayer from "../../components/VideoPlayer";
import { motion, AnimatePresence } from "framer-motion";

export default function InstructorGuide() {
  const [hoveredIndex, setHoveredIndex] = useState(0);
  // Video player states
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const [videoThumbnails, setVideoThumbnails] = useState({});
  const videoRefs = useRef({});

  const features = [
    {
      title: "Message Automations",
      description: "Keep students engaged and informed automatically. Send pre-class reminders, cancellation notices, birthday vouchers, and follow-up prompts. Fully customizable templates save you hours.",
      image: "/features/pc-upcoming-class-reminder-muted-bg.svg",
      mockup: "automation-interface"
    },
    {
      title: "Notes & Progress Tracking",
      description: "Track each student's journey with detailed notes. Leverage AI to refine your notes, generate titles, and make progress tracking effortless.",
      image: "/features/pocketclass_notes_hero_full.svg",
      mockup: "notes-interface"
    },
    {
      title: "Smart Calendar & Integrations",
      description: "Set your availability once and let PocketClass handle the rest. Accept real-time bookings across platforms with integrated scheduling.",
      image: "/features/pc-manage-schedule-flat-calendar.svg",
      mockup: "calendar-interface"
    },
    {
      title: "Custom Class Pages with Payments",
      description: "Showcase your classes with beautifully designed pages. Accept secure payments directly from students, complete with built-in protections.",
      image: "/features/pc-client-dashboard-hero.svg",
      mockup: "custom-class-pages-interface"
    },
    {
      title: "Retention & Sales Tools",
      description: "Tiered reputation, loyalty programs, and analytics to keep students coming back.",
      image: "/features/calendar.svg",
      mockup: "retention-sales-tools-interface"
    }
  ];

  const testimonials = [
    {
      id: 1,
      quote: "PocketClass lets me track every client’s progress and keep notes organized. It’s saved me hours each week and made my sessions feel more personalized.",
      name: "Ethan Williams",
      title: "Fitness Instructor",
      avatar: "/EthanTestimonial.jpg",
    },
    {
      id: 2,
      quote: "Students can book me instantly based on my real-time availability. Automated messages on PocketClass also helps me reduce cancellations and retain students.",
      name: "DJ Sean Gunn",
      title: "DJ Instructor",
      avatar: "/SeanTestimonial.jpg",
    },
    {
      id: 3,
      quote: "Easy payments and extra visibility brought me more students than I expected. PocketClass makes running my business effortless.",
      name: "Coach Wit",
      title: "Golf Instructor",
      avatar: "/WitTestimonial.jpg",
    }
  ];

  const videos = [
    {
      id: 'step1',
      title: 'Set Up Your Instructor Profile',
      src: '/tutorials/Step1.mp4',
      description: 'Learn how to create and optimize your instructor profile on PocketClass'
    },
    {
      id: 'step2',
      title: 'Create Your Class',
      src: '/tutorials/Step2.mp4',
      description: 'Step-by-step guide to creating and publishing your first class'
    },
    {
      id: 'step3',
      title: 'Manage Your Schedule',
      src: '/tutorials/Step3.mp4',
      description: 'How to set your availability and manage your class schedule'
    },
    {
      id: 'step4',
      title: 'Receive Payments through Stripe',
      src: '/tutorials/Step4.mp4',
      description: 'Learn how to set up secure payments and get paid through Stripe'
    }
  ];

  // Generate video thumbnail from video element
  const generateThumbnail = (videoElement, videoId) => {
    if (!videoElement) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);
    setVideoThumbnails(prev => ({
      ...prev,
      [videoId]: thumbnailUrl
    }));
  };

  // Handle video metadata load
  const handleVideoLoad = (videoId) => {
    const videoElement = videoRefs.current[videoId];
    if (videoElement) {
      // Seek to 2 seconds to get a more representative frame
      videoElement.currentTime = 2;
      videoElement.addEventListener('seeked', () => {
        generateThumbnail(videoElement, videoId);
      }, { once: true });
    }
  };

  useEffect(() => {
    // Load thumbnails for all videos
    videos.forEach(video => {
      if (video.src) {
        const videoElement = videoRefs.current[video.id];
        if (videoElement) {
          videoElement.addEventListener('loadedmetadata', () => handleVideoLoad(video.id));
        }
      }
    });
  }, []);

  const openVideo = (video) => {
    if (video.src) {
      setSelectedVideo(video);
      setIsVideoPlayerOpen(true);
    }
  };

  const closeVideo = () => {
    setIsVideoPlayerOpen(false);
    setSelectedVideo(null);
  };

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const FeatureImage = ({ src, alt }) => {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 h-64 flex items-center justify-center overflow-hidden">
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-full object-contain"
          style={{
            imageRendering: 'crisp-edges', // or 'pixelated' for pixel art
          }}
        />
      </div>
    );
  };

  return (
    <div className="bg-white">
      <Head>
        <title>Grow Your Coaching Business with PocketClass</title>
        <meta
          name="description"
          content="All-in-one scheduling, payments, marketing, and student retention tools — built for sport, music, and art instructors."
        />
        <link rel="icon" href="/pc_favicon.ico" />
      </Head>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.05)_50%,transparent_75%,transparent_100%)]"></div>
  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-11 sm:pt-20 sm:pb-16">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Grow Your{' '}
                <span className="text-logo-red">Coaching Business</span>{' '}
                with PocketClass
              </h1>
              <p className="mt-6 text-xl text-gray-600 leading-relaxed">
                All-in-one scheduling, payments, marketing, and student retention tools —
                built for sport, music, and art instructors.
              </p>
              <div className="mt-8 flex lg:flex-row sm:flex-col gap-4">
                <Link href="/instructor-onboarding">
                  <button className="bg-logo-red text-white px-4 py-2 sm:py-4 rounded-xl text-lg font-semibold hover:bg-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                    Create Your Instructor Profile
                  </button>
                </Link>
                <button
                  onClick={scrollToFeatures}
                  className="bg-white text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                >
                  See How It Works
                </button>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-8 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Free to start</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Setup in 10 minutes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>No monthly fees</span>
                </div>
              </div>
            </div>

            {/* Hero Illustration */}
            <div className="relative h-96 sm:h-[400px] lg:h-[600px] flex items-center justify-center lg:mt-0 sm:mx-4">
              <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg">
                {/* Central instructor figure */}
                <div className="relative z-10 bg-white rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-100 mx-4 sm:mx-8 my-4 sm:my-8">
                  <div className="text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-logo-red rounded-full mx-auto mb-3 flex items-center justify-center text-white text-lg sm:text-xl font-bold">
                      👨‍🏫
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Your Teaching Hub</h3>
                    <p className="text-gray-600 mt-1 text-xs sm:text-sm">Everything you need in one place</p>
                  </div>
                </div>

                {/* Floating icons around the instructor */}
                <div className={`absolute -top-2 sm:-top-4 -left-2 sm:-left-4 w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-xl flex items-center justify-center shadow-lg ${styles['animate-float']}`}>
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>

                <div className={`absolute -top-2 sm:-top-4 -right-2 sm:-right-4 w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-xl flex items-center justify-center shadow-lg ${styles['animate-float-delayed']}`}>
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                  </svg>
                </div>

                <div className={`absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-xl flex items-center justify-center shadow-lg ${styles['animate-float']}`}>
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                </div>

                <div className={`absolute -bottom-2 sm:-bottom-4 -right-2 sm:-right-4 w-12 h-12 sm:w-16 sm:h-16 bg-yellow-100 rounded-xl flex items-center justify-center shadow-lg ${styles['animate-float-delayed']}`}>
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section id="features-section" className="py-7 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-lg m-6 overflow-hidden">
              <Image
                src="/Teacher.png"
                alt="Illustration of a Teacher"
                width={70} // smaller & consistent size
                height={70}
                className="object-contain"
              />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Native AI-powered teaching
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Work with a co-pilot you can trust to manage your classes and interact with your students.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-20">
            {features.slice(0, 2).map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                  <FeatureImage src={feature.image} alt={feature.title} />
                  <div className="mt-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Features */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {features.slice(2, 4).map((feature, index) => (
              <div key={index + 2} className="group">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                  <FeatureImage src={feature.image} alt={feature.title} />
                  <div className="mt-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verification Process Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Instructor Verification Process
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              We want to make sure our platform contains respected, verified, and
              trust-worthy instructors to provide the safest, most valuable,
              greatest experience for our students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Skill */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Skill Verification</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                We verify that you have adept skill and knowledge to teach your chosen subject.
                Certifications or licenses will accelerate this process.
              </p>
            </div>

            {/* Experience */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Experience Review</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                We verify your proficient experience in teaching through video calls,
                portfolio review, and one required reference from a previous student or colleague.
              </p>
            </div>

            {/* Infrastructure */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Infrastructure Check</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                You must provide information on planned equipment and proposed locations
                for your teaching to ensure quality learning experiences.
              </p>
            </div>

            {/* Safety */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Safety & Background</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                We conduct a standard background check and require valid government
                issued identification to ensure student safety and platform integrity.
              </p>
            </div>
          </div>

          {/* Process Flow */}
          <div className="mt-20 bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">
              Verification Methodology & Process
            </h3>
            <p className="text-center text-gray-600 mb-12 text-lg">
              Before we help you connect with passionate and curious students in your area, we'd love to know more about you!
            </p>

            <div className="flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0 lg:space-x-8">
              {/* Step 1 */}
              <div className="flex-1 text-center">
                <div className="w-12 h-12 bg-logo-red text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  1
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Submit Application</h4>
                <p className="text-gray-600 text-sm">Complete your instructor profile with credentials and experience</p>
              </div>

              {/* Arrow */}
              <div className="hidden lg:block">
                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Step 2 */}
              <div className="flex-1 text-center">
                <div className="w-12 h-12 bg-logo-red text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  2
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Review Process</h4>
                <p className="text-gray-600 text-sm">We verify your skills, experience, and conduct background checks</p>
              </div>

              {/* Arrow */}
              <div className="hidden lg:block">
                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Step 3 */}
              <div className="flex-1 text-center">
                <div className="w-12 h-12 bg-logo-red text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  3
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Start Teaching</h4>
                <p className="text-gray-600 text-sm">Get approved and begin connecting with students in your area</p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link href="/instructor-onboarding">
                <button className="bg-logo-red text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors duration-200">
                  Begin Verification Process
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Responsive grid for video tutorials */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-3 sm:mb-4">Instructor Onboarding Guides</h1>
          <p className="text-sm sm:text-base text-gray-700 mb-6">
            Watch these quick walkthroughs to learn how to set up your PocketClass profile,
            schedule classes, and stand out to more students.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
            {videos.map((video) => (
              <div key={video.id} className="space-y-2">
                <h3 className="text-base sm:text-lg font-semibold text-[#E63F2B]">
                  {video.title}
                </h3>
                <div className="relative">
                  {video.src ? (
                    <>
                      {/* Hidden video element for thumbnail generation */}
                      <video
                        ref={el => videoRefs.current[video.id] = el}
                        src={video.src}
                        preload="metadata"
                        className="hidden"
                        muted
                      />

                      <div
                        className={`relative pb-[62.5%] h-0 ${styles['cursor-pointer']} group`}
                        onClick={() => openVideo(video)}
                      >
                        <div className="absolute top-0 left-0 w-full h-full rounded-md shadow-md overflow-hidden">
                          {videoThumbnails[video.id] ? (
                            // Show generated thumbnail
                            <div className="relative w-full h-full">
                              <img
                                src={videoThumbnails[video.id]}
                                alt={video.title}
                                className="w-full h-full object-cover"
                              />
                              {/* Dark overlay for better text visibility */}
                              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300" />
                            </div>
                          ) : (
                            // Loading state with gradient
                            <div className="w-full h-full bg-gradient-to-br from-[#E63F2B] to-[#FF6B5A] group-hover:from-[#D63426] group-hover:to-[#FF5A47] transition-all duration-300" />
                          )}

                          {/* Play button overlay */}
                          <div className="absolute inset-0 flex items-center justify-center text-white">
                            <div className="text-center">
                              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-3 mx-auto group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <p className="text-sm font-medium drop-shadow-md">Click to watch</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="relative pb-[62.5%] h-0">
                      <div className="absolute top-0 left-0 w-full h-full bg-gray-100 rounded-md shadow-md flex items-center justify-center">
                        <div className="text-gray-500 text-center">
                          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-3 mx-auto">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <p className="text-sm">Video coming soon</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <p className="text-sm text-gray-600 mt-2">{video.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className={`py-16 lg:py-24 bg-white`}>
        <div className=" w-full max-w-7xl mx-auto">

          {/* Header */}
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Hear what our customers have to say about us
            </h2>
          </div>


          {/* Desktop Layout*/}
          <div
            className="hidden md:flex items-stretch gap-6 bg-white rounded-2xl shadow-lg overflow-hidden p-6 h-[480px]"
            role="region"
            aria-label="Customer testimonials"
          >
    {testimonials.map((t, idx) => {
              const isActive = idx === hoveredIndex;
              const IMAGE_W = 224; // w-56
              const PANEL_W = 520; // desired panel width
              const INNER_GAP = 24; // spacing between image and panel inside the item
              const targetWidth = isActive ? IMAGE_W + PANEL_W + INNER_GAP : IMAGE_W;

              return (
                <motion.div
                  key={t.id}
                  onMouseOver={() => setHoveredIndex(idx)}
                  onClick={() => setHoveredIndex(idx)}
                  onFocus={() => setHoveredIndex(idx)}
                  className={`relative flex-none h-full rounded-lg overflow-hidden cursor-pointer ${isActive ? "shadow-2xl" : "shadow"}`}
                  aria-label={`Show testimonial for ${t.name}`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setHoveredIndex(idx);
                  }}
                  style={{
                    width: isActive ? targetWidth : IMAGE_W,
                    transition: 'width 0.9s cubic-bezier(0.22, 0.8, 0.2, 1)'
                  }}
                >
                  <div className="h-full w-full flex">
                    {/* Image */}
                    <div className="w-56 h-full flex-none overflow-hidden">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-full h-full object-cover block"
                      />
                    </div>

                    {/* Panel */}
                    <div
                      className="h-full flex-none bg-white border-l border-gray-100"
                      style={{ width: PANEL_W, marginLeft: INNER_GAP / 2, paddingLeft: INNER_GAP / 2 }}
                    >
          <div className="h-full p-6 flex flex-col transition-opacity duration-300"
            style={{ opacity: isActive ? 1 : 0 }}>
                        <blockquote className="text-2xl lg:text-3xl leading-tight font-semibold text-gray-900 mb-4">
                          “{t.quote}”
                        </blockquote>
                        <div className="mt-auto pt-4 border-t border-gray-100">
                          <div className="font-semibold text-gray-900">{t.name}</div>
                          <div className="text-gray-500 text-sm">{t.title}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden">
            <div className="flex overflow-x-auto snap-x snap-mandatory mx-4 space-x-4 pb-4">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="snap-start shrink-0 w-[85%] max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative w-full aspect-[5/6]">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-full h-full object-cover object-center"
                    />
                    {testimonial.company && (
                      <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-full shadow text-sm font-semibold">
                        {testimonial.company}
                      </div>
                    )}
                  </div>

                  {/* Testimonial Text */}
                  <div className="p-6">
                    <blockquote className="text-lg font-semibold text-gray-900 leading-relaxed mb-4">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="space-y-1 border-t border-gray-200 pt-4">
                      <div className="font-bold text-gray-900">{testimonial.name}</div>
                      <div className="text-gray-600 text-sm font-medium">{testimonial.title}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Final CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-logo-red to-red-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_50%,transparent_75%,transparent_100%)]"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
            Your students are waiting — start teaching on PocketClass today
          </h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-red-100 max-w-2xl mx-auto">
            Join thousands of instructors who've already transformed their teaching business
          </p>
          <Link href="/instructor-onboarding">
            <button className="bg-white text-logo-red px-8 sm:px-10 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl touch-manipulation">
              Sign Up Free
            </button>
          </Link>
          <p className="mt-3 sm:mt-4 text-red-100 text-xs sm:text-sm">
            No setup fees • Cancel anytime • Start earning immediately
          </p>
        </div>
      </section>

      <Footer />

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayer
          isOpen={isVideoPlayerOpen}
          onClose={closeVideo}
          videoSrc={selectedVideo.src}
          title={selectedVideo.title}
        />
      )}
    </div>
  );
}
