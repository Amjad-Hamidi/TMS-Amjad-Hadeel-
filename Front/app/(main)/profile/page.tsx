"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "@/firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  HiOutlineExclamationCircle,
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineAcademicCap,
  HiOutlineBookOpen,
  HiOutlineUserGroup,
  HiOutlineBriefcase, 
  HiOutlineDocumentText, 
  HiOutlineLocationMarker as HiLocation, 
  HiX, HiOutlineCalendar,
  HiOutlineCurrencyDollar,
  HiOutlineInformationCircle,
  HiOutlineSparkles,
  HiOutlineClipboardList, 
  HiOutlineBriefcase as HiExperience ,
  HiOutlineUserAdd 
} from "react-icons/hi";
import { Loader2 } from "lucide-react";

interface NewJobData {
  title: string;
  description: string;
  extendedDescription: string; 
  requirements: string; 
  responsibilities: string;  
  benefits: string;  
  location: string;
  featured: boolean; 
  type: string; 
  experience: string; 
  salary: string; 
  deadline: string;  
  startDate: string; 
}

interface NewTraineeData {
  username: string;
  email: string;
  password: string;
}

export default function DashProfile() {
  const { state, dispatch } = useAuth();
  const { user: currentUser } = state;
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileUrl, setImageFileUrl] = useState<string | null>(currentUser?.googlePhotoUrl || null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState<number | null>(null);
  const [imageFileUploadError, setImageFileUploadError] = useState<string | null>(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState<string | null>(null);
  const [updateUserError, setUpdateUserError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false); 
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState("personal");
  const filePickerRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const [showAddTraineeModal, setShowAddTraineeModal] = useState(false);
  const [newTraineeData, setNewTraineeData] = useState<NewTraineeData>({
      username: '',
      email: '',
      password: '',
  });
  const [addTraineeLoading, setAddTraineeLoading] = useState(false);
  const [addTraineeSuccess, setAddTraineeSuccess] = useState<string | null>(null);
  const [addTraineeError, setAddTraineeError] = useState<string | null>(null);

  // --- State for Add Job Modal ---
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [newJobData, setNewJobData] = useState<NewJobData>({
    title: "",
    description: "",
    extendedDescription: "", 
    requirements: "",
    responsibilities: "", 
    benefits: "", 
    location: "",
    featured: false,  
    type: "Internship",  
    experience: "", 
    salary: "", 
    deadline: "", 
    startDate: "", 
  });
  const [addJobLoading, setAddJobLoading] = useState(false);
  const [addJobSuccess, setAddJobSuccess] = useState<string | null>(null);
  const [addJobError, setAddJobError] = useState<string | null>(null);

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return

    setImageFileUploading(true)
    setImageFileUploadError(null)

    const storage = getStorage(app)
    const fileName = new Date().getTime() + imageFile.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, imageFile)

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setImageFileUploadProgress(progress)
      },
      (error) => {
        setImageFileUploadError("Could not upload image (File must be less than 2MB)")
        setImageFileUploadProgress(null)
        setImageFile(null)
        setImageFileUrl(null)
        setImageFileUploading(false)
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
        setImageFileUrl(downloadURL)
        setFormData((prev) => ({ ...prev, profilePicture: downloadURL }))
        setImageFileUploading(false)
      },
    )
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => { 
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdateUserError(null)
    setUpdateUserSuccess(null)

    if (imageFileUploading) {
      setUpdateUserError("Please wait for image to upload")
      return
    }

    const updatedData = { ...formData }
    if (updatedData.password === '') {
        delete updatedData.password;
    }

    if (imageFileUrl && imageFileUrl !== currentUser?.googlePhotoUrl) {
      updatedData.profilePicture = imageFileUrl
    } else if (!imageFileUrl && currentUser?.googlePhotoUrl) {
      updatedData.profilePicture = currentUser.googlePhotoUrl 
    }


    if (Object.keys(updatedData).length === 0) {
      setUpdateUserError("No changes were made.")
      return
    }

    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Not authenticated.")

      const res = await fetch("/api/auth/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to update profile') 

      const updatedUser = { ...currentUser, ...data.user }; 
      localStorage.setItem("user", JSON.stringify(updatedUser));

      dispatch({ type: "LOGIN", payload: updatedUser })
      setUpdateUserSuccess("Profile updated successfully!")
      setFormData({}); 

      setTimeout(() => {
        setUpdateUserSuccess(null)
      }, 3000)
    } catch (error: any) {
      setUpdateUserError(error.message || "Failed to update profile")
    }
  };

  const handleDeleteUser = async () => {
    // ... (handleDeleteUser function remains the same)
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Not authenticated.")

      const res = await fetch("/api/auth/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      setUpdateUserSuccess("Account deleted successfully!") // Maybe a different state for delete success?

      localStorage.removeItem("token")
      localStorage.removeItem("user")
      dispatch({ type: "LOGOUT" })
      router.push("/user/signin")
    } catch (error: any) {
      setUpdateUserError(error.message || "Failed to delete account")
      setShowModal(false)
    }
  };

  const handleSignOut = async () => {
     try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      dispatch({ type: "LOGOUT" })
      router.push("/user/signin")
    } catch (error) {
      console.error("Error signing out: ", error)
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      dispatch({ type: "LOGOUT" })
      router.push("/user/signin")
    }
  };

  const handleAddJobChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;

    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setNewJobData(prev => ({ ...prev, [id]: checked }));
    } else {
        setNewJobData(prev => ({ ...prev, [id]: value }));
    }
};


  // --- Handler for Add Job form submission ---

  const handleAddJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddJobLoading(true);
    setAddJobError(null);
    setAddJobSuccess(null);

    if (!newJobData.title || !newJobData.description) {
      setAddJobError("Job title and description are required.");
      setAddJobLoading(false);
      return;
    }

    const requirementsArray = newJobData.requirements
      .split('\n')
      .map(req => req.trim())
      .filter(req => req !== '');
    const responsibilitiesArray = newJobData.responsibilities
      .split('\n')
      .map(resp => resp.trim())
      .filter(resp => resp !== '');
    const benefitsArray = newJobData.benefits
      .split('\n')
      .map(ben => ben.trim())
      .filter(ben => ben !== '');

    const payload = {
        ...newJobData, 
        requirements: requirementsArray,
        responsibilities: responsibilitiesArray,
        benefits: benefitsArray,
    };


    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated.");

        const res = await fetch('/api/jobs', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
        
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || 'Failed to create job');
        }
 
        setAddJobSuccess('Job created successfully!');
        setNewJobData({
            title: "", description: "", extendedDescription: "", requirements: "",
            responsibilities: "", benefits: "", location: "", featured: false,
            type: "Internship", experience: "", salary: "", deadline: "", startDate: ""
        });
        setTimeout(() => {
            setShowAddJobModal(false);
            setAddJobSuccess(null);
        }, 2000);


    } catch (error: any) {
        setAddJobError(error.message || 'An error occurred while creating the job.');
    } finally {
        setAddJobLoading(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto p-4 w-full">
      {/* --- Profile Update Form --- */}
      <div className="bg-white dark:bg-[rgb(22,33,62)] rounded-lg shadow-lg overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 dark:from-purple-600 dark:to-blue-700 p-6">
          <h1 className="text-3xl font-bold text-center text-white">Profile</h1>
          <p className="text-center text-white/80">Manage your account information and preferences</p>
        </div>

        <form onSubmit={handleSubmit} className="relative">
           {/* Profile Picture */}
           <div className="flex justify-center -mt-12 relative z-10">
             <div
               className="relative w-32 h-32 cursor-pointer overflow-hidden rounded-full border-4 border-white dark:border-[rgb(22,33,62)] bg-gray-100 dark:bg-gray-700"
               onClick={() => filePickerRef.current?.click()}
             >
               <input type="file" accept="image/*" onChange={handleImageChange} ref={filePickerRef} hidden />

               {imageFileUploadProgress !== null && ( 
                 <CircularProgressbar
                   value={imageFileUploadProgress || 0}
                   text={`${Math.round(imageFileUploadProgress)}%`}
                   strokeWidth={5}
                   styles={{
                     root: {
                       width: "100%",
                       height: "100%",
                       position: "absolute",
                       top: 0,
                       left: 0,
                     },
                     path: {
                       stroke: `rgba(99, 102, 241, ${(imageFileUploadProgress || 0) / 100})`, // Handle potential null progress
                     },
                     text: {
                       fill: "#6366f1",
                       fontSize: "1.5rem",
                       fontWeight: "bold",
                     },
                     trail: {
                       stroke: "#d1d5db",
                     },
                   }}
                 />
               )}

               <img
                  key={imageFileUrl} 
                  src={
                   imageFileUrl || 
                   currentUser?.googlePhotoUrl ||
                   "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" 
                  }
                  alt="user"
                  className={`rounded-full w-full h-full object-cover ${
                    imageFileUploading ? "opacity-60" : "" 
                  }`}
                />
             </div>
           </div>

          {imageFileUploadError && (
            <div className="px-6 mt-4">
              <div className="p-4 mb-4 text-sm text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 rounded-lg">
                {imageFileUploadError}
              </div>
            </div>
          )}

          <div className="p-6">
             {/* Custom Tabs */}
             <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
               <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
                 {/* Personal Tab Button */}
                 <li className="mr-2">
                   <button
                     type="button"
                     onClick={() => setActiveTab("personal")}
                     className={`inline-flex items-center p-4 rounded-t-lg border-b-2 ${
                       activeTab === "personal"
                         ? "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400"
                         : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-600 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                     }`}
                   >
                     <HiOutlineUser className="mr-2 w-5 h-5" />
                     Personal
                   </button>
                 </li>
                 {/* Contact Tab Button */}
                 <li className="mr-2">
                   <button
                     type="button"
                     onClick={() => setActiveTab("contact")}
                     className={`inline-flex items-center p-4 rounded-t-lg border-b-2 ${
                       activeTab === "contact"
                       ? "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400"
                       : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-600 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                     }`}
                   >
                     <HiOutlineMail className="mr-2 w-5 h-5" />
                     Contact
                   </button>
                 </li>
                 {/* Education Tab Button */}
                 <li>
                   <button
                     type="button"
                     onClick={() => setActiveTab("education")}
                     className={`inline-flex items-center p-4 rounded-t-lg border-b-2 ${
                       activeTab === "education"
                         ? "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400"
                         : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-600 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                     }`}
                   >
                     <HiOutlineAcademicCap className="mr-2 w-5 h-5" />
                     Education
                   </button>
                 </li>
               </ul>
             </div>

            {/* Personal Tab Content */}
            {activeTab === "personal" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Username Input */}
                    <div className="mb-4">
                    <label htmlFor="username" className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                        <HiOutlineUser className="mr-2 w-5 h-5" />
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Username"
                        defaultValue={currentUser?.username}
                        onChange={handleChange}
                    />
                    </div>

                    {/* Gender Select */}
                    <div className="mb-4">
                    <label htmlFor="gender" className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                        <HiOutlineUserGroup className="inline-block mr-2 w-5 h-5" />
                        Gender
                    </label>
                    <select
                        id="gender"
                        className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        defaultValue={currentUser?.gender || ""}
                        onChange={handleChange} // Use general handler
                    >
                        <option value="" disabled>
                        Select gender
                        </option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        {/* Add other options if needed */}
                    </select>
                    </div>

                    {/* Location Input */}
                    <div className="mb-4">
                    <label htmlFor="location" className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                        <HiOutlineLocationMarker className="inline-block mr-2 w-5 h-5" />
                        Location
                    </label>
                    <input
                        type="text"
                        id="location"
                        className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="City, Country"
                        defaultValue={currentUser?.location}
                        onChange={handleChange}
                    />
                    </div>
                </div>
            )}

            {/* Contact Tab Content */}
            {activeTab === "contact" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email Input */}
                 <div className="mb-4">
                  <label htmlFor="email" className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                    <HiOutlineMail className="inline-block mr-2 w-5 h-5" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="your.email@example.com"
                    defaultValue={currentUser?.email}
                    onChange={handleChange}
                  />
                </div>

                 {/* Phone Input */}
                 <div className="mb-4">
                  <label htmlFor="phone" className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                    <HiOutlinePhone className="inline-block mr-2 w-5 h-5" />
                    Phone Number
                  </label>
                  <input
                    type="text" // Use text for flexible phone formats
                    id="phone"
                    className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="+1 (555) 123-4567"
                    defaultValue={currentUser?.phone}
                    onChange={handleChange}
                  />
                </div>

                 {/* Password Input */}
                 <div className="mb-4 md:col-span-2">
                  <label htmlFor="password" className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                    <HiOutlineLockClosed className="inline-block mr-2 w-5 h-5" />
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="••••••••"
                    onChange={handleChange} // Add onChange handler
                    // No defaultValue for password
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Leave blank if you don't want to change your password.
                  </p>
                </div>
              </div>
            )}

             {/* Education Tab Content */}
            {activeTab === "education" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {/* University Input */}
                <div className="mb-4">
                  <label
                    htmlFor="university"
                    className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-gray-200"
                  >
                    <HiOutlineAcademicCap className="inline-block mr-2 w-5 h-5" />
                    University
                  </label>
                  <input
                    type="text"
                    id="university"
                    className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="University name"
                    defaultValue={currentUser?.university}
                    onChange={handleChange}
                  />
                </div>

                 {/* Specialization Input */}
                 <div className="mb-4">
                  <label
                    htmlFor="specialization"
                    className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-gray-200"
                  >
                    <HiOutlineBookOpen className="inline-block mr-2 w-5 h-5" />
                    Specialization
                  </label>
                  <input
                    type="text"
                    id="specialization"
                    className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Your field of study"
                    defaultValue={currentUser?.specialization}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            {/* Success/Error Messages for Profile Update */}
            {(updateUserSuccess || updateUserError) && (
              <div className="mt-4">
                {updateUserSuccess && (
                  <div className="p-4 mb-4 text-sm text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    {updateUserSuccess}
                  </div>
                )}
                {updateUserError && (
                  <div className="p-4 mb-4 text-sm text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    {updateUserError}
                  </div>
                )}
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 focus:outline-none"
                >
                  Delete Account
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 focus:outline-none"
                >
                  Sign Out
                </button>
              </div>
              <button
                type="submit"
                disabled={imageFileUploading}
                className="text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 dark:from-purple-600 dark:to-blue-700 dark:hover:from-purple-700 dark:hover:to-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {imageFileUploading ? "Uploading..." : "Update Profile"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* --- Role-specific Actions --- */}
      <div className="bg-white dark:bg-[rgb(22,33,62)] rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Role-specific Actions</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Actions available based on your role</p>
        </div>

        <div className="p-6">
          {/* Company Actions */}
          {currentUser?.role === "company" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200">Registrar Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"> {/* Adjusted grid */}
                {/* --- Modified Add Job Button --- */}
                <button
                  type="button"
                  onClick={() => {
                      setShowAddJobModal(true);
                      setAddJobError(null); 
                      setAddJobSuccess(null); 
                      setNewJobData({ title: "", description: "", requirements: "", location: "" }); 
                  }}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                >
                  <HiOutlineBriefcase className="mr-2 -ml-1 h-5 w-5" /> {/* Changed Icon */}
                  Add Job
                </button>
                {/* --- End Modified Add Job Button --- */}
                <button
                  type="button"
                  // Add onClick handler for Add Supervisor if needed
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-800"
                >
                  <HiOutlineUser className="mr-2 -ml-1 h-5 w-5" />
                  Add Supervisor
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                >
                  <HiOutlineUserGroup className="mr-2 -ml-1 h-5 w-5" />
                  Add Trainee
                </button>
              </div>
            </div>
          )}

          {/* Supervisor Actions */}
          {/* {currentUser?.role === "supervisor" && (
            // ... Supervisor actions remain the same
             <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200">Supervisor Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                 type="button"
                 onClick={() => {
                     setShowAddTraineeModal(true);
                     setAddTraineeError(null);
                     setAddTraineeSuccess(null);
                     setNewTraineeData({ username: '', email: '', password: '' }); 
                 }}
                 className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-gray-800"
                 >
                 <HiOutlineUserAdd className="mr-2 -ml-1 h-5 w-5" />
                  Add Trainee
                </button>
              </div>
            </div>
          )} */}

          {/* Admin Actions */}
          {currentUser?.role === "admin" && (
            // ... Admin actions remain the same
             <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200">Admin Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => router.push('')} // Example navigation
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800"
                >
                  <HiOutlineUserGroup className="mr-2 -ml-1 h-5 w-5" /> 
                  Manage Users
                </button>
                <button
                  type="button"
                   onClick={() => router.push('')} // Example navigation
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 dark:focus:ring-offset-gray-800"
                >
                   {/* Consider a settings icon */}
                  <HiOutlineBookOpen className="mr-2 -ml-1 h-5 w-5" /> 
                  System Settings
                </button>
              </div>
            </div>
          )}

          {/* If no role-specific actions or role not company/supervisor/admin */}
          {!(currentUser?.role === "company" || currentUser?.role === "supervisor" || currentUser?.role === "admin") && (
            <div className="text-center py-4">
              <p className="text-gray-500 dark:text-gray-400">No role-specific actions available for your role ({currentUser?.role || 'N/A'}).</p>
            </div>
          )}
        </div>
      </div>

      {/* --- Delete Account Modal --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[rgb(22,33,62)] p-6 rounded-lg max-w-md w-full">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <HiOutlineExclamationCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900 dark:text-gray-100">Delete Account</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Are you sure you want to delete your account? This action cannot be undone.
              </p>
              <div className="mt-4 flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteUser}
                  className="inline-flex justify-center rounded-md border border-transparent bg-red-600 dark:bg-red-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-600 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  Yes, delete my account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* --- Add Job Modal --- */}
      {showAddJobModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white dark:bg-[rgb(22,33,62)] p-6 rounded-lg shadow-xl max-w-3xl w-full relative my-8">
                 {/* Close Button */}
                 <button
                    type="button"
                    onClick={() => setShowAddJobModal(false)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none z-10"
                    aria-label="Close modal"
                >
                    <HiX className="w-6 h-6" />
                </button>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 text-center">Add New Job</h3>

                <form onSubmit={handleAddJobSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">

                    {/* Job Title */}
                    <div>
                        <label htmlFor="title" className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-gray-200"> {/* .label-style */}
                             <HiOutlineBriefcase className="w-5 h-5 mr-2" /> Job Title <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={newJobData.title}
                            onChange={handleAddJobChange}
                            className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" // .input-style
                            placeholder="e.g., Software Engineer Intern"
                            required
                        />
                    </div>

                     {/* Job Description */}
                     <div>
                        <label htmlFor="description" className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-gray-200"> {/* .label-style */}
                             <HiOutlineDocumentText className="w-5 h-5 mr-2" /> Description <span className="text-red-500 ml-1">*</span>
                        </label>
                        <textarea
                            id="description"
                            rows={3}
                            value={newJobData.description}
                            onChange={handleAddJobChange}
                            className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" // .input-style
                            placeholder="Short description of the role"
                            required
                        />
                    </div>

                    {/* Extended Description */}
                    <div>
                        <label htmlFor="extendedDescription" className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-gray-200"> {/* .label-style */}
                             <HiOutlineInformationCircle className="w-5 h-5 mr-2" /> Detailed Description (Optional)
                        </label>
                        <textarea
                            id="extendedDescription"
                            rows={5}
                            value={newJobData.extendedDescription}
                            onChange={handleAddJobChange}
                            className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" // .input-style
                            placeholder="More details about the job, company culture, etc."
                        />
                    </div>


                    {/* Requirements */}
                    <div>
                        <label htmlFor="requirements" className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-gray-200"> {/* .label-style */}
                             <HiOutlineClipboardList className="w-5 h-5 mr-2" /> Requirements
                        </label>
                        <textarea
                            id="requirements"
                            rows={4}
                            value={newJobData.requirements}
                            onChange={handleAddJobChange}
                            className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" // .input-style
                            placeholder="List required skills, qualifications (one per line)"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Enter each requirement on a new line.</p> {/* .helper-text */}
                    </div>

                     {/* Responsibilities */}
                     <div>
                        <label htmlFor="responsibilities" className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-gray-200"> {/* .label-style */}
                             <HiOutlineClipboardList className="w-5 h-5 mr-2" /> Responsibilities (Optional)
                        </label>
                        <textarea
                            id="responsibilities"
                            rows={4}
                            value={newJobData.responsibilities}
                            onChange={handleAddJobChange}
                            className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" // .input-style
                            placeholder="List key responsibilities (one per line)"
                        />
                         <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Enter each responsibility on a new line.</p> {/* .helper-text */}
                    </div>

                     {/* Benefits */}
                     <div>
                        <label htmlFor="benefits" className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-gray-200"> {/* .label-style */}
                             <HiOutlineSparkles className="w-5 h-5 mr-2" /> Benefits (Optional)
                        </label>
                        <textarea
                            id="benefits"
                            rows={3}
                            value={newJobData.benefits}
                            onChange={handleAddJobChange}
                            className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" // .input-style
                            placeholder="List benefits like health insurance, paid time off (one per line)"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Enter each benefit on a new line.</p> {/* .helper-text */}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                        {/* Location */}
                        <div>
                            <label htmlFor="location" className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-gray-200"> {/* .label-style */}
                                <HiLocation className="w-5 h-5 mr-2" /> Location
                            </label>
                            <input
                                type="text"
                                id="location"
                                value={newJobData.location}
                                onChange={handleAddJobChange}
                                className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" // .input-style
                                placeholder="e.g., City, Remote"
                            />
                        </div>

                        {/* Job Type */}
                        <div>
                           <label htmlFor="type" className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-gray-200"> {/* .label-style */}
                               <HiOutlineBriefcase className="w-5 h-5 mr-2" /> Job Type
                           </label>
                           <select
                               id="type"
                               value={newJobData.type}
                               onChange={handleAddJobChange}
                               className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" // .input-style
                           >
                               <option value="Internship">Internship</option>
                               <option value="Full-time">Full-time</option>
                               <option value="Part-time">Part-time</option>
                               <option value="Contract">Contract</option>
                               <option value="Remote">Remote</option>
                               <option value="Other">Other</option>
                           </select>
                        </div>

                         {/* Experience Level */}
                         <div>
                            <label htmlFor="experience" className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-gray-200"> {/* .label-style */}
                                <HiExperience className="w-5 h-5 mr-2" /> Experience Level
                            </label>
                            <input
                                type="text"
                                id="experience"
                                value={newJobData.experience}
                                onChange={handleAddJobChange}
                                className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" // .input-style
                                placeholder="e.g., Entry Level, 2+ years"
                            />
                        </div>

                         {/* Salary */}
                         <div>
                            <label htmlFor="salary" className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-gray-200"> {/* .label-style */}
                                <HiOutlineCurrencyDollar className="w-5 h-5 mr-2" /> Salary/Stipend
                            </label>
                            <input
                                type="text"
                                id="salary"
                                value={newJobData.salary}
                                onChange={handleAddJobChange}
                                className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" // .input-style
                                placeholder="e.g., $50k/year, Competitive"
                            />
                        </div>

                        {/* Deadline */}
                        <div>
                            <label htmlFor="deadline" className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-gray-200"> {/* .label-style */}
                                <HiOutlineCalendar className="w-5 h-5 mr-2" /> Application Deadline
                            </label>
                            <input
                                type="date"
                                id="deadline"
                                value={newJobData.deadline}
                                onChange={handleAddJobChange}
                                className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" // .input-style
                            />
                        </div>

                        {/* Start Date */}
                        <div>
                            <label htmlFor="startDate" className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-gray-200"> {/* .label-style */}
                                <HiOutlineCalendar className="w-5 h-5 mr-2" /> Start Date
                            </label>
                            <input
                                type="text"
                                id="startDate"
                                value={newJobData.startDate}
                                onChange={handleAddJobChange}
                                className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" // .input-style
                                placeholder="e.g., ASAP, Q3 2024"
                            />
                        </div>
                    </div>


                    {/* Featured Job */}
                    <div className="flex items-center pt-2">
                        <input
                            type="checkbox"
                            id="featured"
                            checked={newJobData.featured}
                            onChange={handleAddJobChange}
                            className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                            Mark as Featured Job
                        </label>
                    </div>


                     {/* Add Job Success/Error Messages */}
                    {(addJobSuccess || addJobError) && (
                      <div className="mt-4">
                        {addJobSuccess && (
                          <div className="p-3 text-sm text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 rounded-lg text-center"> {/* .success-message */}
                            {addJobSuccess}
                          </div>
                        )}
                        {addJobError && (
                          <div className="p-3 text-sm text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 rounded-lg text-center"> {/* .error-message */}
                            {addJobError}
                          </div>
                        )}
                      </div>
                    )}
                    {/* Modal Actions */}
                    <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
                        <button
                            type="button"
                            onClick={() => setShowAddJobModal(false)}
                            disabled={addJobLoading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50" // .button-secondary
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={addJobLoading}
                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed" // .button-primary
                        >
                            {addJobLoading ? 'Creating...' : 'Create Job'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
      {/* --- Add Trainee Modal --- */}
      {showAddTraineeModal && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-[rgb(22,33,62)] p-6 rounded-lg shadow-xl max-w-md w-full relative">
                        {/* Close Button */}
                        <button type="button" onClick={() => setShowAddTraineeModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none z-10" aria-label="Close modal">
                            <HiX className="w-6 h-6" />
                        </button>

                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 text-center">Add New Trainee</h3>

                        <form className="space-y-4">
                            <div>
                                <label htmlFor="username" className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                                    <HiOutlineUser className="w-5 h-5 mr-2" /> Trainee Username <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input type="text" id="username" value={newTraineeData.username}  className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter username" required />
                            </div>

                             <div>
                                <label htmlFor="email" className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                                    <HiOutlineMail className="w-5 h-5 mr-2" /> Trainee Email <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input type="email" id="email" value={newTraineeData.email}  className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter email" required />
                            </div>

                             <div>
                                <label htmlFor="password" className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                                    <HiOutlineLockClosed className="w-5 h-5 mr-2" /> Initial Password <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input type="password" id="password" value={newTraineeData.password}  className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter initial password" required />
                                 <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">The trainee can change this later.</p>
                            </div>

                            {(addTraineeSuccess || addTraineeError) && (
                            <div className="mt-4">
                                {addTraineeSuccess && <div className="p-3 text-sm text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 rounded-lg text-center">{addTraineeSuccess}</div>}
                                {addTraineeError && <div className="p-3 text-sm text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 rounded-lg text-center">{addTraineeError}</div>}
                            </div>
                            )}

                            <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
                                <button type="button" onClick={() => setShowAddTraineeModal(false)} disabled={addTraineeLoading} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50">
                                    Cancel
                                </button>
                                <button type="submit" disabled={addTraineeLoading} className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md shadow-sm hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
                                    {addTraineeLoading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin"/> Adding...</>) : 'Add Trainee'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
      )}
    </div>
  );
}