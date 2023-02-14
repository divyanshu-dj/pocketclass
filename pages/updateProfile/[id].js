import Head from "next/head";
import * as React from 'react';
import { useRouter } from 'next/router';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../firebaseConfig';
import { toast, ToastContainer } from 'react-toastify';
import { useEffect, useState } from "react";
import Image from "next/image";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Header from "../../components/Header";


function UpdateProfile() {
    const [userData, setUserData] = useState()
    const [loading, setLoading] = useState(false)
    let images = []
    let imagesURL = []
    const router = useRouter()
    const { id } = router.query


    const getUserInfo = async (id) => {
        const docRef = doc(db, "Users", id);
        const data = await getDoc(docRef);
        setUserData(data.data())
    }

    useEffect(() => {
        if (id) {
            getUserInfo(id)
        }
    }, [id])



    if (!id || !userData) {
        return <section className="flex justify-center items-center min-h-[100vh]">
            <Image src="/Rolling-1s-200px.svg" width={'60px'} height={"60px"} />
        </section>
    }



    const onUpdateHandle = async (e) => {
        e.preventDefault()
        const firstName = e.target.firstName.value
        const lastName = e.target.lastName.value
        const gender = e.target.gender.value
        const phoneNumber = e.target.phoneNumber.value
        const dob = e.target.dob.value
        const profileDescription = e.target.profileDescription.value

        for (let i = 0; i < e.target.images.files.length; i++) {
            images.push(e.target.images.files[i])
        }

        setLoading(true)

        const data = {
            firstName,
            lastName,
            gender,
            phoneNumber,
            dob,
            images: e.target.images.files.length ? imagesURL : userData?.images,
            profileDescription
        }

        console.log(e.target.images.files.length)

        await updateDoc(doc(db, "Users", id), data);


        images.length !== 0 && images.map((img) => {

            const fileRef = ref(storage, `images/userImages/${Math.floor(Math.random() * (9999999 - 1000000 + 1) + 1000000) + "-" + img.name}`)

            uploadBytes(fileRef, img).then(async (res) => {
                getDownloadURL(ref(storage, res.metadata.fullPath)).then(async (url) => {

                    await updateDoc(doc(db, "Users", id), {
                        images: arrayUnion(url)
                    })

                    toast.success("Updated", {
                        toastId: "success6996"
                    })
                })

            }).finally(() => {
                setTimeout(() => {
                    setLoading(false)
                    router.push(`/profile/${id}`)
                }, 4000)
            })
        })


        toast.success("Updated", {
            toastId: "success9853"
        })

        setTimeout(() => {
            setLoading(false)
            router.push(`/profile/${id}`)
        }, 4000)

        setLoading(false)

    }

    return (
        <>
            <Head>
                <title>Edit Class</title>
                <meta name="pocketclass" content="Register for an account at pocketclass!" />
                <link rel="icon" href="/pc_favicon.ico" />
            </Head>

            <Header />

            <div className='px-10 rounded-3xl flex flex-col justify-center items-center h-[100vh]'>
                <div className="registrationContainer lg:w-[50%] sm:w-[100%] ">
                    <h1 className='text-5xl font-semibold text-center'>Update Profile</h1>

                    <div className='mt-8'>
                        <form onSubmit={(e) => onUpdateHandle(e)}>
                            <div className='grid lg:grid-cols-2 lg:gap-2 sm:grid-cols-1'>

                                <div className="firstName">
                                    <label className='text-medium font-medium'>First Name</label>
                                    <input
                                        defaultValue={userData?.firstName}
                                        name="firstName"
                                        className='w-full border-2 text-sm border-gray-100 rounded-xl p-3 mt-1 bg-transparent focus:outline-none focus:border-logo-red focus:ring-1 focus:ring-logo-red'
                                        placeholder="Enter your First name" />
                                </div>
                                <div className="lastName">
                                    <label className='text-medium font-medium'>Last Name</label>
                                    <input
                                        defaultValue={userData?.lastName}
                                        name="lastName"
                                        className='w-full border-2 text-sm border-gray-100 rounded-xl p-3 mt-1 bg-transparent focus:outline-none focus:border-logo-red focus:ring-1 focus:ring-logo-red'
                                        placeholder="Enter your Last Name" />
                                </div>
                            </div>

                            <div className='grid lg:grid-cols-2 lg:gap-x-2 sm:grid-cols-1'>

                                <div className="phoneNumber">
                                    <label className='text-medium font-medium'>Phone Number</label>
                                    <input
                                        defaultValue={userData?.phoneNumber}
                                        name="phoneNumber"
                                        className='w-full border-2 text-sm border-gray-100 rounded-xl p-3 mt-1 bg-transparent focus:outline-none focus:border-logo-red focus:ring-1 focus:ring-logo-red'
                                        placeholder="Enter your Phone Number" />
                                </div>
                                <div className="dob">
                                    <label className='text-medium font-medium'>Date of Birth</label>
                                    <input
                                        defaultValue={userData?.dob}
                                        name="dob"
                                        type={"date"}
                                        className='w-full border-2 text-sm border-gray-100 rounded-xl p-3 mt-1 bg-transparent focus:outline-none focus:border-logo-red focus:ring-1 focus:ring-logo-red'
                                        placeholder="Enter your Date of birth" />
                                </div>
                            </div>

                            <div className='grid lg:grid-cols-2 lg:gap-x-2 sm:grid-cols-1'>
                                <div className="gender">
                                    <label className='text-medium font-medium'>Gender</label>
                                    <select
                                        name="gender"
                                        className="w-full border-2 text-sm border-gray-100 rounded-xl p-3 bg-transparent focus:outline-none focus:border-logo-red focus:ring-1 focus:ring-logo-red">

                                        <option
                                            value={userData?.gender ? userData?.gender : ""} hidden>{userData?.gender ? userData?.gender : "Gender"}
                                        </option>
                                        <option value="woman">Women</option>
                                        <option value="man">Men</option>
                                        <option value="non-binary/genderquee">Non-binary / genderqueer</option>
                                        <option value="i-prefer-to-self-identify">I prefer to self-identify</option>
                                        <option value="i'd-rather-not-say">I'd rather not say</option>
                                    </select>
                                </div>
                                <div className="img">
                                    <label className='text-medium font-medium'>Images (png, jpg)</label>
                                    <input
                                        name='images'
                                        className='w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-transparent focus:outline-none focus:border-logo-red focus:ring-1 focus:ring-logo-red'
                                        multiple
                                        accept="image/png, image/jpeg, image/jpg"
                                        type={"file"}
                                    />
                                </div>
                            </div>

                            <div className='grid lg:grid-cols-1 lg:gap-x-2 sm:grid-cols-1'>
                                <div className="gender">
                                    <label className='text-medium font-medium'>Description</label>
                                    <input
                                            defaultValue={userData?.profileDescription}
                                            name="profileDescription"
                                            className='w-full border-2 text-sm border-gray-100 rounded-xl p-3 mt-1 bg-transparent focus:outline-none focus:border-logo-red focus:ring-1 focus:ring-logo-red'
                                            placeholder="Enter a profile description" />
                                </div>
                            </div>

                            <div className="col-span-12 mt-10">
                                {
                                    !loading ?
                                        <button
                                            type='submit'
                                            className='active:scale-[.98] w-full active:duration-75 transition-all hover:scale-[1.01]  ease-in-out transform py-4 bg-logo-red rounded-xl text-white font-bold text-lg'>Update</button>
                                        :
                                        <div class="flex items-center justify-center">
                                            <button type="button"
                                                class="inline-flex items-center justify-center py-4 text-sm font-semibold leading-6 text-white transition duration-150 w-full ease-in-out bg-logo-red rounded-xl shadow cursor-not-allowed hover:bg-logo-red"
                                                disabled="">
                                                <svg class="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none"
                                                    viewBox="0 0 24 24">
                                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                    <path class="opacity-75" fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                                    </path>
                                                </svg>
                                                Updating...
                                            </button>
                                        </div>
                                }
                            </div>
                        </form>

                    </div>
                </div>
                <ToastContainer
                    position="top-center"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </div>
        </>
    );
}

export default UpdateProfile;