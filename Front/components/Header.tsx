"use client";

import { Button, Navbar, TextInput, Avatar, Dropdown, Modal } from "flowbite-react";
import Link from "next/link";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext"; 
import { useAuth } from "@/context/AuthContext";  
import { usePathname } from "next/navigation";
import { useState } from "react";

interface IProps {
  href: string;
  children: React.ReactNode;
}

const NavLink = ({ href, children }: IProps) => (
  <Link href={href} className="block w-full">
    {children}
  </Link>
);

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { state, dispatch } = useAuth();
  const router = useRouter();
  const path = usePathname();
  
  const [isSearchOpen, setIsSearchOpen] = useState(false); 

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST', credentials: 'include' });
      dispatch({ type: 'LOGOUT' });
      router.push('/user/signin');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const isLoggedIn = state.user !== null;

  return (
    <>
      <Navbar className="border-b-2">
        <Link
          href="/"
          className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
        >
          <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
            Training
          </span>
          Management
        </Link>

        <form className="hidden lg:inline">
          <TextInput
            type="text"
            placeholder="Search..."
            rightIcon={AiOutlineSearch}
          />
        </form>

        <Button className="w-12 h-10 lg:hidden" color="gray" pill onClick={() => setIsSearchOpen(true)}>
          <AiOutlineSearch />
        </Button>

        <div className="flex gap-2 md:order-2">
          <Button className="w-12 h-10 hidden sm:inline" color="gray" pill onClick={toggleTheme}>
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </Button>

          {isLoggedIn ? (
            <Dropdown arrowIcon={false} inline label={<Avatar alt="user" img={state.user?.googlePhotoUrl} rounded />}>
              <Dropdown.Header>
                <span className="block text-sm">@{state.user?.username}</span>
                <span className="block text-sm font-medium truncate">{state.user?.email}</span>
              </Dropdown.Header>
              <Dropdown.Item as={Link} href="/profile">Profile</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item as={Link} href="/dashboard">Dashboard</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
            </Dropdown>
          ) : (
            <Link href="/user/signin">
              <Button gradientDuoTone="purpleToBlue" outline>Sign In</Button>
            </Link>
          )}

          <Navbar.Toggle />
        </div>

        <Navbar.Collapse>
          <Navbar.Link active={path === "/"} as={"div"}>
            <NavLink href="/">Home</NavLink>
          </Navbar.Link>
          <Navbar.Link active={path === "/about"} as={"div"}>
            <NavLink href="/about">About</NavLink>
          </Navbar.Link>
          
          <Navbar.Link active={path === "/jobPage"} as={"div"}>
            <NavLink href="/jobPage">Join our Team </NavLink>
          </Navbar.Link>

          <Navbar.Link active={path === "/coursepage"} as={"div"}>
            <NavLink href="/coursepage">Courses</NavLink>
          </Navbar.Link>
          
          <Navbar.Link active={path === "/contact"} as={"div"}>
            <NavLink href="/contact">Contact</NavLink>
          </Navbar.Link>
          
        </Navbar.Collapse>
      </Navbar>

      <Modal show={isSearchOpen}  onClose={() => setIsSearchOpen(false)}>
        <Modal.Header>Search</Modal.Header>
        <Modal.Body>
          <TextInput type="text" placeholder="Search..." rightIcon={AiOutlineSearch} />
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setIsSearchOpen(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
