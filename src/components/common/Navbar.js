"use client"; // if using the app router

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation'
const Navbar = ({ open, setOpen }) => {
    const session = useSession()
    const router = useRouter()
    const currentPath = usePathname()
    const isCurrentPath = currentPath.startsWith("/admin") || currentPath.startsWith("/auth")
    console.log("nav sesssion", session)
    return (<>{
        isCurrentPath === true ? (
            <nav className=" !px-6 !bg-red-600 text-white shadow-md flex">
                <div className=" ">

                    <button
                        onClick={() => setOpen(!open)}
                        style={{
                            backgroundColor: open ? "#625959" : "#625959", // Dynamic color
                            color: "#fff",
                            border: "none",
                            borderRadius: "50%",
                            width: "30px",
                            height: "30px",
                            marginTop: "18px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",

                            marginLeft: "-7px",
                            cursor: "pointer",

                            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        {open ? "❮" : "❯"}
                    </button>

                </div>
                <div className="container  py-2 flex justify-between items-center px-8">

                    <div className=" flex text-xl font-bold">


                        <Link href="/"><img width="5%" height="5%" src="/foody.webp" /></Link>

                    </div>
                    <div className="flex space-x-4">

                        {session.data !== null || undefined ? (<>
                            <Link href="/user" className="hover:text-gray-300">
                                <p
                                    onClick={() => router.push("/auth/signin")}
                                    className="hover:text-gray-300 cursor-pointer"
                                >
                                    {session?.data?.user?.email}
                                </p>
                            </Link>
                        </>) : (<>
                            <Link href="/user" className="hover:text-gray-300">
                                <p
                                    onClick={() => router.push("/auth/signin")}
                                    className="hover:text-gray-300 cursor-pointer"
                                >
                                    {session.data}
                                </p>
                            </Link>

                            <p
                                onClick={() => router.push("/auth/signin")}
                                className="hover:text-gray-300 cursor-pointer"
                            >
                                Signin
                            </p></>)}
                    </div>
                </div>
            </nav>
        ) : <nav className=" !px-6 !bg-red-500 text-white shadow-md flex">

            <div className="container  py-2 flex justify-between items-center">

                <div className=" flex text-xl font-bold px-4">


                    <Link href="/"><img width="5%" height="5%" src="/foody.webp" /></Link>
                </div>
                <div className="flex space-x-2">
                    <Link href="/" className="hover:text-gray-300">
                        Menu
                    </Link>


                </div>

                <div className="flex ">

                    <Link href="/orderhistory" className="">
                        <ShoppingBasketIcon />
                    </Link>

                </div>
            </div>
        </nav>
    }





    </>

    );
};

export default Navbar;
