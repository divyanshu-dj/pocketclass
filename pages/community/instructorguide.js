import React from "react";
import Footer from "/components/Footer";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import LargeCard from "/components/LargeCard";
import NewHeader from "../../components/NewHeader";
import { useState, useRef, useEffect } from "react";
import VideoPlayer from "../../components/VideoPlayer";

export default function InstructorGuide() {
  // Video player states
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const [videoThumbnails, setVideoThumbnails] = useState({});
  const videoRefs = useRef({});
  
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
  return (
    <div>
      <Head>
        <title>Pocketclass: Instructor Guide</title>
        <meta
          name="description" content="Our platform contains respected, verified, and trust-worthy instructors to provide the safest, most valuable, greatest experience for our students."
        />
        <link rel="icon" href="/pc_favicon.ico" />
      </Head>
      {/* header */}
      <NewHeader />

      {/*body*/}
      <main className="max-w-7xl mx-auto px-1 py-8 sm:px-5">
        <section>
          {/* <h1 className="text-4xl font-semibold py-5">Join Our Team</h1>
          <h1 className="text-xl font-semibold mt-5">
            Partner with PocketClass
          </h1>
          <p className="text-md text-gray-700">
            Are you a sport/music/art instructor or studio owner looking to grow
            your business?
            <br></br>
            List your service on PocketClass, and reach your target audience.
            <br></br>
            Join the growing number of sports, music, and art instructors that
            are expanding their reach with PocketClass– get started for free
            today.
          </p> */}

          <h1 className="text-4xl font-semibold py-5">Join Our Team</h1>
          
          <ul className="list-disc text-md ml-5 text-gray-700">
            <li>Market to your target audience</li>
            <li>Student Reviews bring you credibility amongst your community!</li>
            <li>Secure Payments</li>
            <li>
              Our cancellation policy protects instructors from late cancellations 
              and missed classes
            </li>
          </ul>

          <section className="mt-10">
          <h1 className="text-4xl font-semibold mb-4">Instructor Onboarding Guides</h1>
          <p className="text-md text-gray-700 mb-6">
            Watch these quick walkthroughs to learn how to set up your PocketClass profile, 
            schedule classes, and stand out to more students.
          </p>

          {/* Responsive grid for video tutorials */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="space-y-2">
                <h3 className="text-lg font-semibold text-[#E63F2B]">
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
                        className="relative pb-[62.5%] h-0 cursor-pointer group"
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
        </section> 

          <h1 className="text-4xl font-semibold mt-10 mb-5">
            Instructor Verification Process
          </h1>
          <p className="text-md text-gray-700">
            We want to make sure our platform contains respected, verified, and
            trust-worthy instructors to provide the safest, most valuable,
            greatest experience for our students.
          </p>

          <div className="overflow-hidden bg-white drop-shadow-2xl sm:rounded-lg mt-5 mb-10">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Verification Methodology & Process
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Before we help you outreach to passionate and curious students
                in your area, we'd love to know more about you!
              </p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 xl:grid xl:grid-cols-4 lg:grid lg:grid-cols-4 sm:grid sm:grid-cols-1 sm:gap-2 sm:px-5">
                  <dt className="text-sm font-medium text-gray-500">Skill</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    Pocketclass will verify that you have adept skill or the
                    knowledge to teach your chosen subject. Certifications or
                    licenses will accelerate this process.
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 xl:grid xl:grid-cols-4 lg:grid lg:grid-cols-4 sm:grid sm:grid-cols-1 sm:gap-2 sm:px-5">
                  <dt className="text-sm font-medium text-gray-500">
                    Experience
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    Pocketclass will verify that you have proficient experience
                    in teaching your chosen subject. This will be through a
                    video call, images, videos, as well as one required
                    reference from a previous student or colleague.
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 xl:grid xl:grid-cols-4 lg:grid lg:grid-cols-4 sm:grid sm:grid-cols-1 sm:gap-2 sm:px-5">
                  <dt className="text-sm font-medium text-gray-500">
                    Infrastructure
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    You must provide PocketClass with information on planned
                    equipment used as well as proposed locations for your chosen
                    subject of teaching.
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 xl:grid xl:grid-cols-4 lg:grid lg:grid-cols-4 sm:grid sm:grid-cols-1 sm:gap-2 sm:px-5">
                  <dt className="text-sm font-medium text-gray-500">Safety</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    PocketClass will conduct a standard background check and
                    valid government issued idenficiation will be required.
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <section className="mt-16">
  <h1 className="text-4xl font-semibold mb-4">Built to Protect Instructors</h1>
  <p className="text-md text-gray-700 mb-6">
    We’ve designed every part of PocketClass with instructors in mind — from handling no-shows 
    to ensuring you actually get paid, here’s how we’ve got your back.
  </p>

  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
    {/* Card 1 */}
    <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition">
      <h3 className="text-lg font-semibold text-[#E63F2B]">Cancellation Protection</h3>
      <p className="text-sm text-gray-700 mt-2">
        If a student cancels late or doesn’t show up, you’ll still get paid.
      </p>
    </div>

    {/* Card 2 */}
    <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition">
      <h3 className="text-lg font-semibold text-[#E63F2B]">Secure Payments</h3>
      <p className="text-sm text-gray-700 mt-2">
        Every booking is handled through Stripe, so no more chasing down e-transfers or getting ghosted.
      </p>
    </div>

    {/* Card 3 */}
    <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition">
      <h3 className="text-lg font-semibold text-[#E63F2B]">Verified Reviews</h3>
      <p className="text-sm text-gray-700 mt-2">
        Every review is tied to a real booking — helping you build trust and rank higher.
      </p>
    </div>

    {/* Card 4 */}
    <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition">
      <h3 className="text-lg font-semibold text-[#E63F2B]">Set Your Own Policies</h3>
      <p className="text-sm text-gray-700 mt-2">
        Choose how you want to get booked — with your own rules around schedules, group classes, and location.
      </p>
    </div>
  </div>
</section>

          <h1 className="text-4xl font-semibold mt-10 mb-5">
            Make money from your passion with PocketClass!
          </h1>
          <h1 className="text-xl font-semibold mt-5">
            Sign up online (in less than 10 minutes)
          </h1>
          <p className="text-md text-gray-700">
            Tell us about your background and experience in your field of
            expertise.
          </p>
          <h1 className="text-xl font-semibold mt-5">
            Add your contact information and availability
          </h1>
          <p className="text-md text-gray-700">
            Tap into new audiences and reach thousands of individuals looking
            for your services in your area.
          </p>
          <h1 className="text-xl font-semibold mt-5">
            Get connected, get paid
          </h1>
          <p className="text-md text-gray-700">
            Get connected with customers in your area looking for service.
          </p>
          <h1 className="text-xl font-semibold mt-5">Who can join?</h1>
          <ul className="list-disc text-md ml-5 text-gray-700">
            <li>
              Are you a full-time or part-time sport, music, or art instructor?
            </li>
            <li>Are you a sport, music, or art club/studio owner?</li>
          </ul>
          <p className="text-md text-gray-700">
            If you answered yes to either of those questions, welcome!
          </p>
          <h1 className="text-xl font-semibold mt-5">
            Benefits of partnering with PocketClass
          </h1>
          {/* <p className="text-md text-gray-700">
            
          </p> */}
          <ul className="list-disc text-md ml-5 text-gray-700">
            <li>Market to your target audience</li>
            <li>
              Student Reviews bring you credibility amonst your community!
            </li>
            <li>Secure Payments</li>
            <li>
              Our cancellation policy protects instructors from late
              cancellations and missed classes
            </li>
          </ul>
        </section>
        <section>
          <h1 className="text-xl font-semibold mt-5">Ready to Get Started?</h1>
          <LargeCard
            img="https://links.papareact.com/4cj"
            title="Become an Instructor"
            description="Teach your Passion"
            buttonText="I'm Interested"
          />
        </section>
      </main>
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
