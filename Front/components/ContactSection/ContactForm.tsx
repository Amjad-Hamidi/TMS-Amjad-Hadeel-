"use client"

import { useState } from 'react'
import emailjs from 'emailjs-com'
const ContactForm = ({ theme }: { theme: string }) => {

    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      setIsSubmitting(true)
  
      emailjs.sendForm(
        'service_sdfdghj', 
        'template_6hp5x5b', 
        e.target as HTMLFormElement,
        'daqKmckBAnI5tBWdF' 
      )
      .then(() => {
        alert('Message sent successfully!')
        ;(e.target as HTMLFormElement).reset()
      })
      .catch((error) => {
        alert('Failed to send message: ' + error.text)
      })
      .finally(() => {
        setIsSubmitting(false)
      })
    }

    return(
        <form onSubmit={handleSubmit}>
  <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
    <div>
      <input
      name='name'
        type="text"
        placeholder="YOUR NAME *"
        className={`w-full p-4 mb-6 border ${
          theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-800"
        } rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
        required
      />

      <input
        type="email"
        placeholder="YOUR EMAIL *"
        className={`w-full p-4 mb-6 border ${
          theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-800"
        } rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
        required
      />

      <input
      name='email'
        type="tel"
        placeholder="YOUR PHONE "
        className={`w-full p-4 mb-6 border ${
          theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-800"
        } rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
        
      />
    </div>

    <div>
      <textarea
      name="message"
        placeholder="YOUR MESSAGE *"
        rows={10}
        className={`w-full p-4 mb-6 border ${
          theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-purple-200 hover:bg-purple-300 text-gray-800"
        } rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
        required
      ></textarea>

      

<button
          type="submit"
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-medium py-3 px-12 transition-colors rounded"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'SEND MESSAGE'}
        </button>
    </div>
  </div>
  </form>
    )
}

export default ContactForm