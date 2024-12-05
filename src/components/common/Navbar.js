"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Badge from "@mui/material/Badge";

const Navbar = ({ open, setOpen }) => {
    const { data: session } = useSession();
    const router = useRouter();
    const currentPath = usePathname();
    const isCurrentPath = currentPath.startsWith("/admin") || currentPath.startsWith("/auth");

    const [cartData, setCartData] = useState([]);

    // Load cart data from localStorage
    useEffect(() => {
        const storedCartData = localStorage.getItem("cartDatalength");
        if (storedCartData) {
            setCartData(JSON.parse(storedCartData));
        }
    }, []);

    const orderItem = cartData?.length > 0 ? cartData.length : "0";

    return (
        <>
            {isCurrentPath ? (
                <nav className="px-6 bg-red-600 text-white shadow-md flex">
                    <div>
                        <button
                            onClick={() => setOpen(!open)}
                            style={{
                                backgroundColor: "#625959",
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
                    <div className="container py-2 flex justify-between items-center px-8">
                        <div className="flex text-xl font-bold">
                            <Link href="/">
                                <img
                                    width="40"
                                    height="40"
                                    src="/foody.webp"
                                    alt="Foody Logo"
                                />
                            </Link>
                        </div>
                        <div className="flex space-x-4">
                            {session ? (
                                <Link href="/user" className="hover:text-gray-300">
                                    <p className="cursor-pointer">{session.user?.email}</p>
                                </Link>
                            ) : (
                                <>
                                    <p
                                        onClick={() => router.push("/auth/signin")}
                                        className="hover:text-gray-300 cursor-pointer"
                                    >
                                        Sign in
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </nav>
            ) : (
                <nav className="px-6 bg-red-500 text-white shadow-md flex">
                    <div className="container py-2 flex justify-between items-center">
                        <div className="flex text-xl font-bold px-4">
                            <Link href="/">
                                <img
                                    width="40"
                                    height="40"
                                    src="/foody.webp"
                                    alt="Foody Logo"
                                />
                            </Link>
                        </div>

                        <div className="flex gap-6">
                            <Link href="/" className="hover:text-gray-300">
                                Menu
                            </Link>
                            <Link href="/cart" className="hover:text-gray-300">
                                <Badge badgeContent={orderItem} color="success">
                                    <ShoppingBasketIcon />
                                </Badge>
                            </Link>
                        </div>
                    </div>
                </nav>
            )}
        </>
    );
};

export default Navbar;
