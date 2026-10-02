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
            onboardingCompleted: false, // Pehli baar false rahega
            isPro: false,
            createdAt: new Date(),
          });
        }
        return true;
      } catch (error) {
        console.error("SignIn error:", error);
        return true;
      }
    },
    async session({ session }) {
      try {
        const client = await clientPromise;
        const db = client.db("aurafit");
        const dbUser = await db.collection("users").findOne({ email: session.user.email });
        
        if (dbUser) {
          session.user.id = dbUser._id.toString();
          session.user.onboardingCompleted = dbUser.onboardingCompleted || false;
          session.user.isPro = dbUser.isPro || false;
        }
      } catch (error) {
        console.error("Session error:", error);
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Yahan hum default callback URL handle kar sakte hain
      return baseUrl + "/dashboard";
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };