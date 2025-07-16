import React from "react";
import Footer from "/components/Footer";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import NewHeader from "../../components/NewHeader";

export default function AboutUs() {
  return (
    <div>
      <Head>
        <title>Pocketclass: About Us</title>
        <meta
          name="Pocketclass: About"
          content="PocketClass is transforming the extracurriculars industry by
          bringing community sports, arts, and music lessons into one
          accessible platform. Pocketclass offers "
        />
        <link rel="icon" href="/pc_favicon.ico" />
      </Head>
      {/* header */}

      {/*body*/}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section - Image at Top on Small Screens */}
        <div className="flex flex-col-reverse md:flex-row items-center gap-8">
          <div className="md:w-[60%] text-left">
            <h1 className="text-[25px] md:text-[40px] font-bold">
              We’re changing the way you connect with{" "}
              <span className="text-[#E63F2B]">Sport, Music, & Art instructors</span>
            </h1>
            <p className="text-gray-500 font-bold text-[15px] mt-4">
              Founded by a team who personally experienced the challenges of 
              finding qualified instructors—from countless online searches to 
              messy payment processes—we set out to build a better way.
            </p>
            <p className="text-gray-500 font-bold text-[15px] mt-4">
              PocketClass connects students to freelance instructors in sports, 
              music, and the arts, streamlining scheduling, secure payments, and 
              administrative tasks into one seamless experience.
            </p>
          </div>
          <img
            priority={true}
            src="/AboutUsGraphic.png"
            className="w-full md:w-[40%] max-w-[400px] object-cover"
          />
        </div>

        {/* Our Mission Section */}
        <div className="mt-16">
          <h1 className="text-[25px] md:text-[40px] font-bold text-left">Our Mission</h1>
          <p className="text-gray-500 font-bold text-[15px] text-left mt-4">
            By making life easier for both instructors and students, we aim to inspire people 
            everywhere to explore new passions, master new skills, and thrive in a vibrant 
            community dedicated to personal growth.
          </p>
        </div>

        {/* Three-Image Section - Column Layout on Small Screens */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mt-16">
          <div className="flex flex-col items-center text-center">
            <img priority={true} src="/About21.jpg" className="w-full max-w-[400px] object-cover border border-[#E63F2B] rounded-md shadow-md" />
            <p className="text-red-500 text-[15px] flex items-center mt-4">
              <img priority={true} src="/Check.png" className="w-[30px] mr-2" />
              Find Classes Near You
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <img priority={true} src="/About22.jpg" className="w-full max-w-[400px] object-cover border border-[#E63F2B] rounded-md shadow-md" />
            <p className="text-red-500 text-[15px] flex items-center mt-4">
              <img priority={true} src="/Check.png" className="w-[30px] mr-2" />
              Easy Scheduling
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <img priority={true} src="/About23.jpg" className="w-full max-w-[400px] object-cover border border-[#E63F2B] rounded-md shadow-md" />
            <p className="text-red-500 text-[15px] flex items-center mt-4">
              <img priority={true} src="/Check.png" className="w-[30px] mr-2" />
              Secure Payments
            </p>
          </div>
        </div>

        {/* Our Values Section */}
        <div className="mt-16">
          <h1 className="text-[25px] md:text-[40px] font-bold text-left">Our Values</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 text-[20px] mt-8">
            <div>
              <h1 className="text-[20px] text-red-500 font-bold">Accessibility</h1>
              <p className="text-[15px]">Everyone should have the chance to learn. We remove barriers like complex 
                booking and uncertain payments so more people can pursue their passions.</p>
            </div>
            <div>
              <h1 className="text-[20px] text-red-500 font-bold">Community</h1>
              <p className="text-[15px]">We bring together instructors and students in a supportive environment, 
                encouraging collaboration and shared success.</p>
            </div>
            <div>
              <h1 className="text-[20px] text-red-500 font-bold">Trust & Transparency</h1>
              <p className="text-[15px]">Secure payments, honest communication, and clear policies protect our 
                users and build confidence on both sides.</p>
            </div>
            <div>
              <h1 className="text-[20px] text-red-500 font-bold">Quality & Growth</h1>
              <p className="text-[15px]">We aim for high standards and continuous improvement, ensuring instructors 
                and students alike can reach their full potential.</p>
            </div>
            <div>
              <h1 className="text-[20px] text-red-500 font-bold">Innovation & Adaptability</h1>
              <p className="text-[15px]">We embrace fresh ideas and evolving technology, keeping PocketClass flexible 
                and ready to meet changing learning needs.</p>
            </div>
            <div>
              <h1 className="text-[20px] text-red-500 font-bold">Empowerment</h1>
              <p className="text-[15px]">We help instructors grow their businesses and students gain new skills, 
                empowering everyone to reach their goals.</p>
            </div>
          </div>
        </div>
        {/* <section>
          <h1 className="text-4xl font-semibold py-5">Our Story</h1>
          <div className="relative h-96 min-w-[300px]">
            <Image
            priority={true}
              src="/hero-tester-ai.png"
              layout="fill"
              objectFit="cover"
              className="rounded-2xl"
            />
          </div>
          <div className="mt-10 mb-10">
            <p className="text-md text-gray-700">
              Growing up, PocketClass founders Lisa and Andrew shared similar
              experiences. Lisa’s father managed a hockey school, and Andrew’s
              mother managed a music school. Like many small businesses, the
              COVID-19 pandemic took a big hit on their parents' businesses.
              While a small proportion of businesses were able to swiftly
              transition to remote work, many others did not have that option.
              <br></br>
              <br></br>
              Seeing that some industries were better positioned to leverage the
              benefits of technology, Andrew and Lisa decided that this needed
              to change. As pandemic restrictions lifted, the founders were
              determined to help businesses bounce back stronger, and empower
              individuals to explore new passions that they were unable to
              access.
              <br></br>
              <br></br>
              PocketClass’ user-friendly platform is dedicated for sports, arts,
              and music, making it easier than ever to discover your passion. To
              make it short and sweet– PocketClass is designed to serve two
              groups: individuals looking to gain new skills (or improve
              existing ones); and qualified instructors looking to gain new
              students.
              <br></br>
              <br></br>
              Our mission at PocketClass is to connect curious individuals with
              passionate and qualified instructors in their community.
            </p>

            <h1 className="text-4xl font-semibold py-5 mt-5">Our Mission</h1>
            <p className="text-md text-gray-700">
              PocketClass is transforming the extracurriculars industry by
              bringing community sports, arts, and music lessons into one
              accessible platform.
              <br></br>
              <br></br>
              Research shows that kids’ participation in extracurricular
              activities is linked to improved health and wellbeing. Benefits
              include improved mental health, stronger sense of peer belonging,
              higer resilience and self-confidence, and higher levels of
              academic achievement over time.
              <br></br>
              <br></br>
              Our mission is to help children and youth discover their passions
              by connecting parents and guardians to a world of
              extracurriculars. There’s not enough time in a day for busy
              parents– so we make it easy and efficient to explore the options
              that align with your life.
              <br></br>
              <br></br>
            </p>
            <div className="italic text-lg">
              Signed{" "}
              <span className="text-logo-red font-bold cursor-pointer hover:scale-105 transition transform duration-200 ease-out">
                <Link href="https://www.linkedin.com/in/andrew-liu545454/">
                  Andrew
                </Link>
              </span>{" "}
              &{" "}
              <span className="text-logo-red font-bold cursor-pointer hover:scale-105 transition transform duration-200 ease-out">
                <Link href="https://www.linkedin.com/in/lisahuh/">Lisa</Link>
              </span>
            </div>
          </div>
        </section> */}
        {/* <section class="bg-white dark:bg-gray-900">
          <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 ">
            <div class="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
              <h2 class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                Our Team
              </h2>
              <p class="font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
                Explore the whole collection of open-source web components and
                elements built with the utility classes from Tailwind
              </p>
            </div>
            <div class="grid gap-8 mb-6 lg:mb-16 md:grid-cols-2">
              <div class="items-center bg-gray-50 rounded-lg shadow sm:flex dark:bg-gray-800 dark:border-gray-700">
                <a href="#">
                  <Image
                  priority={true}
                    class="w-full rounded-lg sm:rounded-none sm:rounded-l-lg"
                    src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/bonnie-green.png"
                    alt="Bonnie Avatar"
                  />
                </a>
                <div class="p-5">
                  <h3 class="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    <a href="#">Bonnie Green</a>
                  </h3>
                  <span class="text-gray-500 dark:text-gray-400">
                    CEO & Web Developer
                  </span>
                  <p class="mt-3 mb-4 font-light text-gray-500 dark:text-gray-400">
                    Bonnie drives the technical strategy of the flowbite
                    platform and brand.
                  </p>
                  <ul class="flex space-x-4 sm:mt-0">
                    <li>
                      <a
                        href="#"
                        class="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                      >
                        <svg
                          class="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        class="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                      >
                        <svg
                          class="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        class="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                      >
                        <svg
                          class="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        class="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                      >
                        <svg
                          class="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="items-center bg-gray-50 rounded-lg shadow sm:flex dark:bg-gray-800 dark:border-gray-700">
                <a href="#">
                  <Image
                  priority={true}
                    class="w-full rounded-lg sm:rounded-none sm:rounded-l-lg"
                    src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png"
                    alt="Jese Avatar"
                  />
                </a>
                <div class="p-5">
                  <h3 class="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    <a href="#">Jese Leos</a>
                  </h3>
                  <span class="text-gray-500 dark:text-gray-400">CTO</span>
                  <p class="mt-3 mb-4 font-light text-gray-500 dark:text-gray-400">
                    Jese drives the technical strategy of the flowbite platform
                    and brand.
                  </p>
                  <ul class="flex space-x-4 sm:mt-0">
                    <li>
                      <a
                        href="#"
                        class="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                      >
                        <svg
                          class="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        class="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                      >
                        <svg
                          class="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        class="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                      >
                        <svg
                          class="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        class="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                      >
                        <svg
                          class="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="items-center bg-gray-50 rounded-lg shadow sm:flex dark:bg-gray-800 dark:border-gray-700">
                <a href="#">
                  <Image
                  priority={true}
                    class="w-full rounded-lg sm:rounded-none sm:rounded-l-lg"
                    src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/michael-gouch.png"
                    alt="Michael Avatar"
                  />
                </a>
                <div class="p-5">
                  <h3 class="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    <a href="#">Michael Gough</a>
                  </h3>
                  <span class="text-gray-500 dark:text-gray-400">
                    Senior Front-end Developer
                  </span>
                  <p class="mt-3 mb-4 font-light text-gray-500 dark:text-gray-400">
                    Michael drives the technical strategy of the flowbite
                    platform and brand.
                  </p>
                  <ul class="flex space-x-4 sm:mt-0">
                    <li>
                      <a
                        href="#"
                        class="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                      >
                        <svg
                          class="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        class="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                      >
                        <svg
                          class="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        class="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                      >
                        <svg
                          class="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        class="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                      >
                        <svg
                          class="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="items-center bg-gray-50 rounded-lg shadow sm:flex dark:bg-gray-800 dark:border-gray-700">
                <a href="#">
                  <Image
                  priority={true}
                    class="w-full rounded-lg sm:rounded-none sm:rounded-l-lg"
                    src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/sofia-mcguire.png"
                    alt="Sofia Avatar"
                  />
                </a>
                <div class="p-5">
                  <h3 class="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    <a href="#">Lana Byrd</a>
                  </h3>
                  <span class="text-gray-500 dark:text-gray-400">
                    Marketing & Sale
                  </span>
                  <p class="mt-3 mb-4 font-light text-gray-500 dark:text-gray-400">
                    Lana drives the technical strategy of the flowbite platform
                    and brand.
                  </p>
                  <ul class="flex space-x-4 sm:mt-0">
                    <li>
                      <a
                        href="#"
                        class="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                      >
                        <svg
                          class="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        class="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                      >
                        <svg
                          class="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        class="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                      >
                        <svg
                          class="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        class="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                      >
                        <svg
                          class="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section> */}
      </main>
      <Footer />
    </div>
  );
}
