import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "@/lib/mongodb";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        const client = await clientPromise;
        const db = client.db("aurafit");
        const usersCollection = db.collection("users");

        const existingUser = await usersCollection.findOne({ email: user.email });

        if (!existingUser) {
          await usersCollection.insertOne({
            name: user.name,
            email: user.email,
            image: user.image,
            isPro: false,
            createdAt: new Date(),
          });
        }
        return true;
      } catch (error) {
        // 🔥 Yahan terminal mein exact error print hoga
        console.error("DETAILED SIGNIN ERROR:", error.message, error.stack);
        return true; // Temporary: Error hone par bhi login allow karne ke liye true return kar rahe hain taaki pata chale
      }
    },
    async session({ session }) {
      try {
        const client = await clientPromise;
        const db = client.db("aurafit");
        const dbUser = await db.collection("users").findOne({ email: session.user.email });
        
        if (dbUser) {
          session.user.id = dbUser._id.toString();
          session.user.isPro = dbUser.isPro || false;
        }
      } catch (error) {
        console.error("Session callback error:", error);
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };