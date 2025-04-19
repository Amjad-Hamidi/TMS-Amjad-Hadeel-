"use client"
import { useTheme } from "@/context/ThemeContext"
import ContactInfo from "@/components/ContactSection/ContactInfo"
import ContactForm from "@/components/ContactSection/ContactForm"
import styles from '@/components/ContactSection/styles/Contact.module.css'

const ContactPage = () => {
  const { theme } = useTheme()

  return (
    <div className={`min-h-screen relative overflow-hidden ${theme === "dark" ? "bg-gray-900" : "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500"}`}>
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="w-full h-full bg-[url('/map.png')] bg-repeat"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <h1 className={` ${theme === "dark" ? styles.gradientText : "text-white"}  text-5xl font-bold text-center mb-16 mt-8  `}>
          GET IN TOUCH
        </h1>

        <ContactInfo theme={theme} />
        <ContactForm theme={theme} />

    
      </div>
    </div>
  )
}

export default ContactPage