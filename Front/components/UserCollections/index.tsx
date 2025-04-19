import Link from 'next/link'
import React, { ReactElement } from 'react'
interface IuserCollection
  {name:string,href:string,icon:ReactElement,numpers:number}

const UserCollections = ({name,href,icon,numpers}:IuserCollection) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
    <div className="flex justify-between mb-6">
      <div>
        <div className="flex items-center mb-1">
          <div className="text-2xl font-semibold">{numpers}</div>
        </div>
        <div className="text-sm font-medium text-gray-400">{name}</div>
      </div>
{icon}   
    </div>

    <Link
      href={href}
      className="text-[#f84525] font-medium text-sm hover:text-red-800"
    >
      View
    </Link>
  </div>  )
}

export default UserCollections