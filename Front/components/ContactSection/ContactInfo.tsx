"use client"
import { ContactDetails } from "./constants"
import styles from "@/components/ContactSection/styles/Contact.module.css"

const ContactInfo = ({ theme }: { theme: string }) => (
  <div className="max-w-5xl mx-auto mb-12">
    <div className="flex flex-col items-center justify-center space-y-4 text-center">
    

      <div className="flex items-center space-x-2 text-xl">
        <span className={`text-white font-bold`}>Email:</span>
        <a
          href={`mailto:${ContactDetails.email}`}
          className={` ${styles.gradientText} hover:text-pink-500 transition-colors font-bold`}
        >
          {ContactDetails.email}
        </a>
      </div> 
      
       <div className="flex items-center space-x-2 text-xl">
        <span className={` text-white font-bold`}>Phone:</span>
        <a
          href={`tel:${ContactDetails.phone}`}
          className={`text-white  hover:text-pink-500 transition-colors font-bold`}
        >
          {ContactDetails.formattedPhone}
        </a>
      </div>

      <div className="flex items-center space-x-2 text-xl">
        <span className={`text-white font-bold`}>Address:</span>
        <span className={`text-white font-bold`}>
          {ContactDetails.address}
        </span>
      </div>
    </div>
  </div>
)

export default ContactInfo