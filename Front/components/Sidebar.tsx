"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  User,
  Briefcase,
  Users,
  CheckCircle2,
  FileText,
  UserCog,
  Building,
  Settings,
  ChevronDown,
  LogOut,
  Menu,
  X,
  BookOpenText,
  ClipboardList,
  Bell,
  MessageSquare,
  BarChart3,
  ListChecks,
  PlusCircle,
  ScrollText,
  BookMarked,
  CalendarDays,
} from "lucide-react"

interface SidebarProps {
  className?: string
}

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  roles?: string[]
  children?: NavItem[]
}

const Sidebar = ({ className = "" }: SidebarProps) => {
  const { state, dispatch } = useAuth()
  const currentUser = state.user
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(0)

  // Close mobile menu when path changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY )
    }
  
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
      dispatch({ type: "LOGOUT" })
      localStorage.removeItem("token")
      window.location.href = "/user/signin"
    } catch (error) {
      console.error("Error signing out: ", error)
    }
  }

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title)
  }

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard size={20} />,
      roles: ["admin", "company", "supervisor", "trainee"],
    },
    {
      title: "Profile",
      href: "/profile",
      icon: <User size={20} />,
      roles: ["admin", "company", "supervisor", "trainee"],
    },
    {
      title: "Courses",
      href: "/courses",
      icon: <BookOpenText size={20} />,
      roles: ["admin", "company", "supervisor", "trainee"],
    },
    // Company specific
    {
      title: "My Jobs",
      href: "/jobs",
      icon: <Briefcase size={20} />,
      roles: ["company"],
      // children: [
      //   {
      //     title: "My Jobs",
      //     href: "/jobs",
      //     icon: <FileText size={18} />,
      //   },
      //   {
      //     title: "Post Job",
      //     href: "/dashboard/post-job",
      //     icon: <PlusCircle size={18} />,
      //   },
      //   {
      //     title: "Applications",
      //     href: "/dashboard/applications",
      //     icon: <CheckCircle2 size={18} />,
      //   },
      // ],
    },
    {
      title: "Supervisors",
      href: "/supervisors",
      icon: <ScrollText size={20} />,
      roles: ["company"],
    },
    // Trainee specific
    {
      title: "Training",
      href: "/training",
      icon: <UserCog size={20} />,
      roles: ["trainee"],
    },
    {
      title: "Supervisors",
      href: "/supervisors",
      icon: <ScrollText size={20} />,
      roles: ["trainee"],
    },
    {
      title: "Certifications",
      href: "#",
      icon: <BookMarked size={20} />,
      roles: ["trainee"],
    },
    {
      title: "Timetable",
      href: "#",
      icon: <CalendarDays size={20} />,
      roles: ["trainee"],
    },
    {
      title: "Assignments",
      href: "/assignments",
      icon: <ClipboardList size={20} />,
      roles: ["trainee"],
    },
    {
      title: "Join our Team",
      href: "/jobPage",
      icon: <FileText size={20} />,
      roles: ["trainee"],
    },
    // Supervisor specific
    {
      title: "My Trainees",
      href: "/trainees",
      icon: <Users size={20} />,
      roles: ["supervisor"],
    },
    {
      title: "Training",
      href: "/training",
      icon: <UserCog size={20} />,
      roles: ["supervisor"],
    },
    {
      title: "Activities",
      href: "/activites",
      icon: <ScrollText size={20} />,
      roles: ["supervisor"],
    },
    {
      title: "Certificates",
      href: "/ceritifactions",
      icon: <BookMarked size={20} />,
      roles: ["supervisor"],
    },
    {
      title: "Evaluations",
      href: "#",
      icon: <ListChecks size={20} />,
      roles: ["supervisor"],
    },
    // Admin specific
    {
      title: "All Users",
      href: "#",
      icon: <Users size={20} />,
      roles: ["admin"],
    },
    {
      title: "Companies",
      href: "#",
      icon: <Building size={20} />,
      roles: ["admin"],
    },
    {
      title: "Reports",
      href: "#",
      icon: <ScrollText size={20} />,
      roles: ["admin"],
    },
    {
      title: "Settings",
      href: "#",
      icon: <Settings size={20} />,
      roles: ["admin"],
    },
  ]

  // Personal section items
  const personalItems: NavItem[] = [
    {
      title: "Notifications",
      href: "#",
      icon: <Bell size={20} />,
      roles: ["admin", "company", "supervisor", "trainee"],
    },
    {
      title: "Messages",
      href: "#",
      icon: <MessageSquare size={20} />,
      roles: ["admin", "company", "supervisor", "trainee"],
    },
  ]

  const filteredNavItems = navItems.filter(
    (item) => !item.roles || (currentUser && item.roles.includes(currentUser.role)),
  )

  const filteredPersonalItems = personalItems.filter(
    (item) => !item.roles || (currentUser && item.roles.includes(currentUser.role)),
  )

  const isActive = (href: string) => {
    if (href === "#") return false
    if (href === "/dashboard" && pathname === "/dashboard") return true
    return pathname.startsWith(href) && href !== "/dashboard"
  }

  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="fixed top-4 left-4 z-40 md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md bg-white dark:bg-gray-800 shadow-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
    className={`fixed top-0 inset-y-0 left-0 z-30 w-64 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-all duration-300 ease-in-out ${
    isMobileMenuOpen ? "translate-x-0  " : "-translate-x-full md:translate-x-0"
  } ${isScrolled ? "" : "md:mt-16"} ${className}`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          {isMobileMenuOpen && (
          <div className="p-4 mx-auto border-b border-gray-200 dark:border-gray-700">
        <Link
          href="/"
          className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
        >
          <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
            Training
          </span>
          Management
        </Link>
          </div>
          )}

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto py-4 px-3">
            {/* User Info */}
            {currentUser && (
              <div className="mb-6 px-2">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{currentUser.username}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{currentUser.role}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="space-y-1">
              <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Main Menu
              </p>

              {filteredNavItems.map((item) => (
                <div key={item.title}>
                  {item.children ? (
                    <div>
                      <button
                        onClick={() => toggleSubmenu(item.title)}
                        className={`flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          openSubmenu === item.title
                            ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="mr-3">{item.icon}</span>
                          <span>{item.title}</span>
                        </div>
                        <ChevronDown
                          size={16}
                          className={`transform transition-transform ${openSubmenu === item.title ? "rotate-180" : ""}`}
                        />
                      </button>
                      {openSubmenu === item.title && (
                        <div className="mt-1 ml-6 space-y-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.title}
                              href={child.href}
                              className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                                isActive(child.href)
                                  ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              }`}
                            >
                              <span className="mr-3">{child.icon}</span>
                              <span>{child.title}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive(item.href)
                          ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.title}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Personal Section */}
            {filteredPersonalItems.length > 0 && (
              <div className="mt-8 space-y-1">
                <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Personal
                </p>
                {filteredPersonalItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive(item.href)
                        ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 sticky bottom-0">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
            >
              <LogOut size={18} className="mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </>
  )
}

export default Sidebar
