import React from "react";
import Footer from "/components/Footer";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import LargeCard from "/components/LargeCard";
import NewHeader from "../../components/NewHeader";
import { useState } from "react";
import { Skeleton } from "@mui/material";

export default function InstructorGuide() {
  // Separate loading states for each video
  const [isVideo1Loading, setIsVideo1Loading] = useState(true);
  const [isVideo2Loading, setIsVideo2Loading] = useState(true);
  const [isVideo3Loading, setIsVideo3Loading] = useState(true);
  const [isVideo4Loading, setIsVideo4Loading] = useState(true);
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

          {/* Responsive grid for Loom videos */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* 1) Setting Up Your Instructor Profile on Pocket Class */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-[#E63F2B]">
            Set Up Your Instructor Profile
          </h3>
          <div className="relative pb-[62.5%] h-0">
            {/* MUI Skeleton shown while loading */}
            {isVideo1Loading && (
              <Skeleton
                variant="rectangular"
                className="absolute top-0 left-0 w-full h-full rounded-md shadow-md"
              />
            )}
            <iframe
              src="https://www.loom.com/embed/c3fabbfc10da474cb620895c3989efe8?sid=6812caa9-45fb-46fe-8ec8-ff33a1ee799c"
              frameBorder="0"
              allowFullScreen
              mozallowfullscreen="true"
              webkitallowfullscreen="true"
              onLoad={() => setIsVideo1Loading(false)}
              className="absolute top-0 left-0 w-full h-full rounded-md shadow-md"
            />
          </div>
        </div>

        {/* 2) Creating Your Class on Pocket Class */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-[#E63F2B]">Create Your Class</h3>
          <div className="relative pb-[62.5%] h-0">
            {isVideo2Loading && (
              <Skeleton
                variant="rectangular"
                className="absolute top-0 left-0 w-full h-full rounded-md shadow-md"
              />
            )}
            <iframe
              src="https://www.loom.com/embed/37d1dde5262648c99673f1573bee5b74?sid=b7865bc0-7f61-4390-b638-9c8e4f907797"
              frameBorder="0"
              allowFullScreen
              mozallowfullscreen="true"
              webkitallowfullscreen="true"
              onLoad={() => setIsVideo2Loading(false)}
              className="absolute top-0 left-0 w-full h-full rounded-md shadow-md"
            />
          </div>
        </div>

        {/* 3) Setting Up Your Instructor Profile (second video) */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-[#E63F2B]">Manage Your Schedule</h3>
          <div className="relative pb-[62.5%] h-0">
            {isVideo3Loading && (
              <Skeleton
                variant="rectangular"
                className="absolute top-0 left-0 w-full h-full rounded-md shadow-md"
              />
            )}
            <iframe
              src="https://www.loom.com/embed/5b871e3e177c4671a5831f520c1e5af2?sid=649644d8-e89f-4fe8-9a2c-8c151a89f630"
              frameBorder="0"
              allowFullScreen
              mozallowfullscreen="true"
              webkitallowfullscreen="true"
              onLoad={() => setIsVideo4Loading(false)}
              className="absolute top-0 left-0 w-full h-full rounded-md shadow-md"
            />
          </div>
        </div>

        {/* 4) Receive Payments through Stripe */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-[#E63F2B]">Receive Payments through Stripe</h3>
          <div className="relative pb-[62.5%] h-0">
            {isVideo4Loading && (
              <Skeleton
                variant="rectangular"
                className="absolute top-0 left-0 w-full h-full rounded-md shadow-md"
              />
            )}
            <iframe
              src="https://www.loom.com/embed/1a47fb3707a748faad78a01548149615?sid=1f396490-118c-48f3-a8a6-0b28b3d355ee"
              frameBorder="0"
              allowFullScreen
              mozallowfullscreen="true"
              webkitallowfullscreen="true"
              onLoad={() => setIsVideo4Loading(false)}
              className="absolute top-0 left-0 w-full h-full rounded-md shadow-md"
            />
          </div>
        </div>
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
    </div>
  );
}
