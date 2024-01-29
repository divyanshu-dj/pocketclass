import React from "react";
import Footer from "/components/Footer";
import Header from "/components/Header";
import Head from "next/head";
import Image from "next/image";

export default function PrivacyPolicy() {
  return (
    <div>
      <Head>
        <title>pocketclass</title>
        <meta
          name="privacypolicy"
          content="privacy policy"
        />
        <link rel="icon" href="/pc_favicon.ico" />
      </Head>
      {/* header */}
      <Header />

      {/* body */}
      <main className="max-w-7xl mx-auto px-1 py-8 sm:px-5">
        <section>
          <h1 className="text-4xl font-semibold py-5">Privacy Policy</h1>
          {/* <h2 className="text-2xl font-semibold py-7">OVERVIEW</h2> */}
          {/* <p>
          Welcome to PocketClass! These Terms of Use (“Terms”) are a contract between you and PocketClass Inc (“PocketClass” or “we”) and govern your access to and use of any PocketClass website, mobile application (such as for iPhone or Android) or content (the “Site”) or any fitness, recreational, wellness, or other classes, experiences, activities, events, services, recordings, and/or products made available through PocketClass (collectively, “Classes”). Please read these Terms carefully before accessing and using the Site or Classes.
          </p> */}

          <h2 className="text-2xl font-semibold py-7">
            SECTION 1 - General
          </h2>
          <p>
          PocketClass (whose registered office is in Toronto, ON Canada) (“PocketClass”, “we”, “our” or “us”), acting as data controller, is committed to protecting and respecting your privacy. This notice (“Privacy Notice”) is designed to tell you about our practices regarding the collection, use and disclosure of information that you may provide via this website or the (“Platform“).
          <br></br>
            <br></br>This Privacy Notice (together with our Terms and Conditions) establishes the basis on which any personal data we collect from you, or that you provide us, will be processed. Please read the following carefully to understand our policy and practices regarding your personal data and how it will be administered and stored.

          </p>

          <h2 className="text-2xl font-semibold py-7">
            SECTION 2 - What information do we collect and how long do we keep it?
          </h2>
          <p>
          We may collect and process the following personal data:
          <br></br>
            <br></br>
            2.1. The information you provide us with
            <br></br>
            <br></br>You may provide us with information, including information that can be used to identify you (“Personal Data“) by using our Platform, filling out forms on the Platform (i.e. the sign-up procedure), when you participate in any of our competitions, promotions or surveys, when you correspond with us by phone, e-mail or otherwise, and when you report a problem with the Platform.
            <br></br>
            <br></br>The information you give us may include:
            <br></br>
            <br></br>2.1.1. Mandatory information required to register for the service we provide on our Platform, including your name, email address, date of birth, gender, cell phone number, IP address, Skype / Hangouts ID and password are required. All these fields are mandatory. PocketClass will not be able to provide you with the services offered on our Platforms if the required information is not provided. Consequently, you will not be able to register for a user account on our Platforms
            <br></br>
            <br></br>2.1.2. A photograph;
            <br></br>
            <br></br>2.1.3. A postal address;
            <br></br>
            <br></br>2.1.4. Details of your qualifications;
            <br></br>
            <br></br>2.1.5.Your mini-portfolio;
            <br></br>
            <br></br>2.1.6. A record of any correspondence between you and us;
            <br></br>
            <br></br>2.1.7. A record of any requests you have made or related ads you have placed with or through our Platform;
            <br></br>
            <br></br>2.1.8. Accounting details or financial transactions including transactions carried out through our Platform or otherwise. This may include information such as your payment card or bank account details, details of lessons that you have offered through our Platforms;
            <br></br>
            <br></br>2.1.9. Details of your visits to our Platforms and the resources that you access;
            <br></br>
            <br></br>2.1.10. Your replies to any surveys or questionnaires, such as your reviews on the lessons you have shared with other members of our community. Such information may be used for analytic & user understanding purposes;
            <br></br>
            <br></br>2.1.11. Information we may require from you when you report a problem with our Platform or our service, such as the subject of your request for support;
            <br></br>
            <br></br>2.1.12. Location information when you have given consent to the collection and processing of this data;
            <br></br>
            <br></br>2.1.13. Certificates and other documents that you have agreed to provide to us.
            <br></br>
            <br></br>2.2. Information we collect automatically
            <br></br>
            <br></br>2.2.1. If you sign up via the social media authentication method, PocketClass will access certain Personal Data (e.g. first name, last name, picture, email, number of Facebook friends, etc.) on your social media account pursuant to the applicable terms and conditions of these social media platforms. We may also collect some of your Personal Data when you interact with third-party social media features, such as the “Like” functions.
            <br></br>
            <br></br>2.2.2. With regard to each of your visits to our Platforms we may collect, in accordance with the applicable laws, and your consent where required, information related to the devices you use and the networks you are connected to when using our services. This may include the following information: your IP address, log-in information, browser type and version, browser plug-in types and versions, operating system and platform, advertising identifier, information about your visit including the URL clickstream to, through, and from our Platform, products you viewed or searched for, download errors, length of visits to certain pages, page interaction and any phone number used to call our customer service department. We collect this information through the use of various technologies including cookies.
            <br></br>
            <br></br>2.2.3. We also collect aggregated information regarding your activity on our Platform (such as the number of lessons offered, your message response rate, etc.). Such information may be published on your public profile on our Platform.
            <br></br>
            <br></br>2.3. Data retention
            <br></br>
            <br></br>Your data will be retained and secured indefinitely unless you explicitly request the complete deletion of all your data. To do so, please send an email to contact.pocketclass@gmail.com entitled Data Deletion.

          </p>
          <h2 className="text-2xl font-semibold py-7">
            SECTION 3 - How do we use the information we collect from you?
          </h2>
          <p>
            <div className="overflow-hidden bg-white drop-shadow-2xl sm:rounded-lg mt-5 mb-10">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
              We will use the information we collect:
              </h3>
              {/* <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Before we help you outreach to passionate and curious students
                in your area, we'd love to know more about you!
              </p> */}
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 xl:grid xl:grid-cols-4 lg:grid lg:grid-cols-4 sm:grid sm:grid-cols-1 sm:gap-2 sm:px-5">
                  <dt className="text-sm font-medium text-gray-500">3.1. To carry out our obligations arising from any contracts entered into between you and PocketClass and to provide you with the information and services that you requested from us; 	</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  This processing is necessary for the performance of our mutual contractual obligations. 
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 xl:grid xl:grid-cols-4 lg:grid lg:grid-cols-4 sm:grid sm:grid-cols-1 sm:gap-2 sm:px-5">
                  <dt className="text-sm font-medium text-gray-500">
                  3.2. To send you service-related information by email and/or text message and/or any other communication means (e.g. your request confirmation)
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  This processing is necessary for the performance of our mutual obligations and/or carried out with your consent.
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 xl:grid xl:grid-cols-4 lg:grid lg:grid-cols-4 sm:grid sm:grid-cols-1 sm:gap-2 sm:px-5">
                  <dt className="text-sm font-medium text-gray-500">
                  3.3.To collect payments from you or to transfer to you the payments we collect on your behalf 
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  This processing is necessary for the performance of our mutual contractual obligations. 	
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 xl:grid xl:grid-cols-4 lg:grid lg:grid-cols-4 sm:grid sm:grid-cols-1 sm:gap-2 sm:px-5">
                  <dt className="text-sm font-medium text-gray-500">3.3.To collect payments from you or to transfer to you the payments we collect on your behalf 	</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  This processing is necessary for the performance of our mutual contractual obligations. 
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 xl:grid xl:grid-cols-4 lg:grid lg:grid-cols-4 sm:grid sm:grid-cols-1 sm:gap-2 sm:px-5">
                  <dt className="text-sm font-medium text-gray-500">
                  3.4. To enable you to personalize your user profile on our Platform
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  This processing is carried out with your consent.
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 xl:grid xl:grid-cols-4 lg:grid lg:grid-cols-4 sm:grid sm:grid-cols-1 sm:gap-2 sm:px-5">
                  <dt className="text-sm font-medium text-gray-500">3.5. To enable you to communicate and interact with other members about our services or about the trips(s) you have/will share with other members and/or to organize such trips</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  This processing is necessary for the performance of our mutual contractual obligations and/or carried out with your consent.
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 xl:grid xl:grid-cols-4 lg:grid lg:grid-cols-4 sm:grid sm:grid-cols-1 sm:gap-2 sm:px-5">
                  <dt className="text-sm font-medium text-gray-500">
                  3.6. To give you access to our support services and to enable you to communicate with our member relations team 
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  This processing is (i) necessary for the performance of our mutual contractual obligations, (ii) carried out with your consent and/or (iii) necessary for the establishment, exercise or defense of legal claims.
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 xl:grid xl:grid-cols-4 lg:grid lg:grid-cols-4 sm:grid sm:grid-cols-1 sm:gap-2 sm:px-5">
                  <dt className="text-sm font-medium text-gray-500">3.7.To ensure compliance with (i) applicable laws, (ii) our Terms and Conditions, and (iii) our Privacy Notice. Certain breaches that we regard as inappropriate may lead to the suspension of your account</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  This processing is necessary (i) for the performance of our mutual contractual obligations, (ii) for compliance with our legal obligations and/or (iii) for the establishment, exercise or defense of legal claims.
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 xl:grid xl:grid-cols-4 lg:grid lg:grid-cols-4 sm:grid sm:grid-cols-1 sm:gap-2 sm:px-5">
                  <dt className="text-sm font-medium text-gray-500">
                  3.8.To send you, in accordance with applicable laws and where required, with your consent, marketing materials and information necessary to facilitate the service or the lesson request process and to make your suggestions and recommendations about goods or services related to our services that may interest you. We also use your data to target you in order to serve our ads on social media platforms. You can learn more about how these features work, and the data that we obtain about you, by visiting the relevant sections of the third party social media platforms. 
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  This processing is based on your consent and/or our legitimate interest (i.e. providing you with meaningful advertising). 
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 xl:grid xl:grid-cols-4 lg:grid lg:grid-cols-4 sm:grid sm:grid-cols-1 sm:gap-2 sm:px-5">
                  <dt className="text-sm font-medium text-gray-500">3.9. To notify you about changes to our services</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  This processing is necessary (i) for the performance of our mutual contractual obligations, (ii) for compliance with our legal obligations and/or (iii) the establishment, exercise or defense of legal claims.
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 xl:grid xl:grid-cols-4 lg:grid lg:grid-cols-4 sm:grid sm:grid-cols-1 sm:gap-2 sm:px-5">
                  <dt className="text-sm font-medium text-gray-500">
                  3.10. To verify the information contained on your certificates and other documents that may be collected from you at the time of registration or at any other time during your use of our Platforms
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  This processing is based on (i) your consent, (ii) carried out for the establishment, exercise or defense of legal claims and/or (iii) for compliance with our legal obligations. 
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 xl:grid xl:grid-cols-4 lg:grid lg:grid-cols-4 sm:grid sm:grid-cols-1 sm:gap-2 sm:px-5">
                  <dt className="text-sm font-medium text-gray-500">3.11. To administer our Platform and for internal operations, including troubleshooting, data analysis, testing, research, analytic and survey purposes</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  This processing is based on our legitimate interest (i.e. ensuring the security of our Platform and improving its features)
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 xl:grid xl:grid-cols-4 lg:grid lg:grid-cols-4 sm:grid sm:grid-cols-1 sm:gap-2 sm:px-5">
                  <dt className="text-sm font-medium text-gray-500">
                  3.12. To improve our Platforms to ensure that content is presented in the most effective manner for you and for your device
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  This processing is based on our legitimate interest (i.e. providing you with meaningful content). 
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 xl:grid xl:grid-cols-4 lg:grid lg:grid-cols-4 sm:grid sm:grid-cols-1 sm:gap-2 sm:px-5">
                  <dt className="text-sm font-medium text-gray-500">3.13. To allow you to participate in interactive features of our service, when you choose to do so</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  This processing is necessary (i) for the performance of our mutual contractual obligations and/or (ii) based on your consent.
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 xl:grid xl:grid-cols-4 lg:grid lg:grid-cols-4 sm:grid sm:grid-cols-1 sm:gap-2 sm:px-5">
                  <dt className="text-sm font-medium text-gray-500">
                  3.14. As part of our efforts to keep our Platforms safe and secure
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  This processing is based on (i) our legitimate interest (ensuring the security of our Platforms), (ii) carried out for the establishment, exercise or defense of legal claims and/or (iii) for compliance with our legal obligations. 
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 xl:grid xl:grid-cols-4 lg:grid lg:grid-cols-4 sm:grid sm:grid-cols-1 sm:gap-2 sm:px-5">
                  <dt className="text-sm font-medium text-gray-500">3.15 To measure or understand the effectiveness of advertising we serve to you and others, and to deliver relevant advertising to you.</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  This processing is based on (i) our legitimate interest (i.e. measuring and optimizing the efficiency of our advertising campaigns) and/or (ii) your consent.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          </p>
          <h2 className="text-2xl font-semibold py-7">
            SECTION 4 - Who are the recipients of the Information we collect from you and for which purposes?
          </h2>
          <p>
          4.1. When you use our services, some information about you is shared with the members of our communities, either on your public profile or during the request process (e.g. we give your telephone number to the members with whom you will have a lesson with).
          <br></br>
            <br></br>4.2. We may receive and send information about you, including your Personal Data, if you use any of the platforms we operate or from other PocketClass entities and affiliates, for the purposes outlined in this Privacy Notice.
            <br></br>
            <br></br>4.3. We are also working closely with third parties which may be the recipients of your Personal Data such as:
            <br></br>
            <br></br>Our business partners who are social media platforms and which may provide you with connecting services, such as the connection of the information of your profile, from their social media platforms to our Platforms;
            <br></br>
            <br></br>Our business partners who may advertise their services on our Platforms and to which you may decide to sign up for: these services may be any service related to our services such as network services, banking services, etc;
            <br></br>
            <br></br>Our business partners who may advertise our services on their websites;
            <br></br>
            <br></br>Our sub-contractors in technical, payment services, or analytics providers.
            <br></br>
            <br></br>4.4. We only share your Personal Data with any of these third parties in the following cases:
            <br></br>
            <br></br>4.4.1. Where it is necessary to involve a third party service provider, for the performance of any contract we enter into with you in order to facilitate or extend our services (e.g. if we charge you any fees or collect any money from you in relation to any services on the Platforms);
            <br></br>
            <br></br>4.4.2. As part of the request process and in order to provide the services, information such as your name, photography, mobile phone number and/or email address, may be displayed on the Platforms and/or passed on to instructors (if you are a student) or a students (if you are an instructor);
            <br></br>
            <br></br>In signing up to use PocketClass, you also consent to the use of re-matching. That is, in the event that a student lesson request is not responded to within 48 hours, this lesson request will automatically be sent to other instructors that;
            
            <br></br>- Have a price equal to or lower than the initial lesson request.
            
            <br></br>- Are within a radius of 20km of the initial lesson request

            <br></br>- Offer the first lesson for free
            
            <br></br>- Teach the same subject
            <br></br>
            <br></br>This same process will take place 72 hours after failing to get a response from an instructor. Students will be notified by email if/when this happens. Instructors will be notified by SMS and email if/when they receive a lesson request that was not intended for them initially. Please note that if an instructor accepts this lesson request, contact details of both parties will automatically be exchanged.
            <br></br>
            <br></br>As a student, if you are not comfortable with your lesson request being sent to new instructors automatically, or as an instructor, if you do not wish to receive applications that were not originally intended for you, you can disable this re-matching service by emailing us at contact.pocketclass@gmail.com and asking to stop the PocketClass re-matching.
            <br></br>
            <br></br>4.4.3. As part of our rating system, the reviews you write will be published on the Platforms. The reviews including your abbreviated name and photography are visible to all visitors of the Platforms;
            <br></br>
            <br></br>4.4.4. We use analytics and search engine providers to assist us in the improvement and optimization of our Platform;
            <br></br>
            <br></br>4.4.5. It is explicitly requested by you (e.g. with when using social media authentication methods);
            <br></br>
            <br></br>4.4.6. We may distribute parts of our Platforms (including the lessons you have posted) for display on our business partners’ websites through API or widgets. In these cases, some information from your public profile may be displayed on these websites;
            <br></br>
            <br></br>4.4.7. PocketClass may also disclose your information if required to do so by law or in a good faith belief that such access, preservation or disclosure is reasonably necessary to (i) respond to claims asserted against PocketClass, (ii) to comply with legal proceedings, (iii) to enforce any agreement with our users such as our Terms and Conditions and our Privacy Policy, (iv) in the event of an emergency involving the danger of public health, death or physical injury to a person (v) in the framework of investigation or (vi) to protect the rights, property or personal safety of PocketClass, its members or others ;
            <br></br>
            <br></br>4.4.8. In the event that we sell or buy any business or assets, in which case we may disclose your Personal Data to the prospective seller or buyer of such business or assets; and
            <br></br>
            <br></br>4.4.9. If PocketClass or all or part of its assets are acquired by a third party, in which case Personal Data held by it about its members will be one of the transferred assets.
            <br></br>
            <br></br>4.4.10. You authorize us to use your name, your profile picture, your content as part of commercial, sponsored, or related content that we distribute or improve. We do not transmit your content or information for resale to any third party. 
            <br></br>
            <br></br>4.5. In accordance with applicable laws and where required with your consent, we may combine information about you, including your Personal Data and cookie information, we send to and receive from our business partners. We may use this information and the combined information for the purposes set out above.
            <br></br>
            <br></br>4.6. We draw your attention to the fact that if you decide to share your information, including Personal Data, with us through our business partners’ connecting services, any of our business partners’ privacy policies and/or notices may also be applicable to you, in addition to this Privacy Policy. We do not control the collection and/or the processing of your information eventually made by our business partners on their own platforms.    
          </p>
          <h2 className="text-2xl font-semibold py-7">
            SECTION 5 - How do we use and moderate your messages?
          </h2>
          <p>
          5.1. We may review, scan, or analyze the messages you exchange with other members of our community through our Platforms for fraud prevention, service improvement, customer support purposes, enforcement of the contracts entered into with our members (such as our Terms and Conditions). For example, in order to prevent the circumventing of our online search engine, we may scan and analyze messages sent through our Platforms to check that they do not include any contact details or references to other websites.
          <br></br>
            <br></br>5.2. We will never scan or analyze your messages with other members of our community for commercial and advertising purposes. We may use automated methods to carry out the moderation of these messages, but no automated individual decision-making is performed in this regard.
          </p>
          <h2 className="text-2xl font-semibold py-7">
            SECTION 6 - Targeted ads on social media platforms and our communications sent by e-mail and/or text messages
          </h2>
          <p>
          In accordance with applicable laws and where required with your consent, we may use the information you give us on our Platforms for electronic direct marketing purposes (e.g. (i) receiving our newsletters, invitations to our events or other communications that we think may interest you or (ii) serving you with targeted advertising on social media platforms or third parties websites).
          <br></br>
            <br></br>For electronic marketing communications: 
            
            <br></br>You can withdraw your consent at any time by (i) unticking the relevant box in your member account, (ii) clicking on the unsubscribe link we provide in each PocketClass communication sent to your attention or (iii) contacting us using the contact details provided in section 12 below.
            <br></br>
            <br></br>For targeted ads and content:
            
            <br></br>On social media (e.g. Facebook and Twitter): you can object at any time by configuring your settings regarding advertisement via your social media account;
          </p>
          <h2 className="text-2xl font-semibold py-7">
            SECTION 7 - Is your Information being transferred? How and where?
          </h2>
          <p>
          In principle, we store the Personal Data that we hold about you in Canada. However, since for example some of our service providers are based in countries outside of Canada (“third countries”), we also transfer some of your data to third countries. This may include third countries where the Canadian Government has not taken the decision that such a third country ensures an adequate level of protection (for example the United States). In that case, we ensure that the transfer is performed in accordance with the applicable legislation and that appropriate safeguards have been put in place (especially standard contractual clauses as issued by the Canadian Government) in order to guarantee a sufficient level of protection of individuals’ private life and fundamental rights.
          <br></br>
            <br></br>By sending a request to the Group Data Protection Officer ( contact.pocketclass@gmail.com ), we can provide you with the details regarding such appropriate safeguards (for example, the standard contractual clauses issued by the Canadian Government).
          </p>
          <h2 className="text-2xl font-semibold py-7">
            SECTION 8 - What are your rights in respect of your personal data?
          </h2>
          <p>
          8.1. You are entitled to receive a copy of your personal data that is in our possession (your right of data access).
          <br></br>
            <br></br>8.2 You may request the deletion of personal data or the correction of inaccurate personal data (your right to erasure and rectification). Please note that we may keep certain information concerning you, as required by law, or when we have a legal basis to do so (e.g., our legitimate interest to keep the platform safe and secure for other users).
            <br></br>
            <br></br>8.3 You have the right to object at any time (i) to the processing of your personal data for the purpose of direct marketing, or (ii) to the processing of your personal data for other purposes on grounds relating to your particular situation (your right to object to processing). Please note that in the latter case, this right only applies if the processing of your personal data is based on our legitimate interest.
            <br></br>
            <br></br>8.4 You have the right to restrict the processing of your personal data (your right to restriction of processing). Please note that this only applies if (i) you contested the accuracy of your personal data and we are verifying the accuracy of the personal data, (ii) you exercised your right to object and we are still considering, as foreseen by the applicable law, whether our legitimate grounds to process your personal data in that case override your interests, rights and freedoms; or (iii) your personal data has been processed by us in an unlawful way but you either oppose the erasure of the personal data or want us to keep your personal data in order to establish, exercise or defend a legal claim.
            <br></br>
            <br></br>8.5 You have the right to receive and/or have us transfer to another data controller a subset of personal data, that concern you and that you provided us with, and which we process for the performance of our contract or because you previously consented to it, in a structured, commonly used and machine-readable format (your right to data portability).
            <br></br>
            <br></br>8.6 To exercise your rights, please contact the Group Data Protection Officer (see under Article 12).
            <br></br>
            <br></br>8.7.You also have the right to make a complaint to the relevant data protection supervisory authority or to seek a remedy through the courts if you believe that your rights have been breached.

          </p>
          <h2 className="text-2xl font-semibold py-7">
            SECTION 9 - Confidentiality of your password
          </h2>
          <p>
          Where you have chosen a password which enables you to access certain parts of our Platforms, you are responsible for keeping this password confidential. We ask you not to share a password with anyone.
          </p>
          <h2 className="text-2xl font-semibold py-7">
            SECTION 10 - Links to other websites and social media
          </h2>
          <p>
          Our Platforms may, from time to time, contain links to and from the websites of our partner networks, advertisers and affiliates. If you follow a link to any of these websites, please note that these websites have their own privacy practices and that we do not accept any responsibility or liability for these policies. Please check these policies before you submit any Personal Data to these websites.
          </p>
          <h2 className="text-2xl font-semibold py-7">
            SECTION 11 - Changes to our Privacy Policy
          </h2>
          <p>
          Any changes we may make to our Privacy Notice in the future will be posted on this page. Where appropriate, we will notify you or seek your consent. Please check back frequently to see any updates or changes to our Privacy Policy.
          </p>
          <h2 className="text-2xl font-semibold py-7">
            SECTION 12 - Waiver and Release
          </h2>
          <p>
          If at any time you would like to contact us with your views about our privacy practices, or with any enquiry relating to your Personal Data, please use one of the following means: 
          <ul className="list-disc text-md ml-5 text-gray-700">
            <li>via our contact page; or</li>
            <li>
            via email to our Data Protection Officer under contact@pocketclass.ca
            </li>
          </ul>
          </p>
          
          {/* <h2 className="text-2xl font-semibold py-7">
            SECTION 18 - GOVERNING LAW
          </h2>
          <p>
            These Terms of Service and any separate agreements whereby we
            provide you Services shall be governed by and construed in
            accordance with the laws of Canada.
          </p> */}
        </section>
      </main>
      <Footer />
    </div>
  );

  // export default Class;
}
