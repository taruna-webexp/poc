"use client"; // if using the app router

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = ({ open, setOpen }) => {
    const session = useSession()
    const router = useRouter()
    console.log("nav sesssion", session)
    return (
        <nav className=" !px-6 bg-red-600 text-white shadow-md flex">
            <div className=" ">

                <button
                    onClick={() => setOpen(!open)}
                    style={{
                        backgroundColor: open ? "#000" : "#000", // Dynamic color
                        color: "#fff",
                        border: "none",
                        borderRadius: "50%",
                        width: "30px",
                        height: "30px",
                        marginTop: "20px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "7px",
                        marginLeft: "4px",
                        cursor: "pointer",

                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    {open ? "❮" : "❯"}
                </button>

            </div>
            <div className="container mx-auto py-2 flex justify-between items-center">

                <div className=" flex text-xl font-bold">


                    <Link href="/">MyApp</Link>
                </div>
                <div className="flex space-x-4">
                    <Link href="/about" className="hover:text-gray-300">
                        About
                    </Link>
                    <Link href="/services" className="hover:text-gray-300">
                        Services
                    </Link>
                    {session.data !== null || undefined ? (
                        <p
                            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                            className="hover:text-gray-300 cursor-pointer"
                        >
                            Sign out
                        </p>) : (<p
                            onClick={() => router.push("/auth/signin")}
                            className="hover:text-gray-300 cursor-pointer"
                        >
                            Sign in
                        </p>)}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
