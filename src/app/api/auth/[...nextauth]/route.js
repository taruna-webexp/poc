import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        Credentials({
            async authorize(credentials, req) {
                const userCrendential = JSON.parse(credentials.credentialsArray);
                const user = userCrendential.find(
                    (user) =>
                        user.email === credentials.email &&
                        user.password === credentials.password
                );

                if (user) {
                    return user; // User found, return the user object
                } else {
                    throw new Error("Invalid credentials");
                }
            },
        }),
    ],
    pages: {
        error: "/auth/error", // Custom error page
    },
});

export { handler as GET, handler as POST };
