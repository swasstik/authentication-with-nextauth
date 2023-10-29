import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import CredentialsProviders from "next-auth/providers/credentials"

const prisma = new PrismaClient();
export const authOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID??"",
      clientSecret: process.env.GITHUB_SECRET??"",
    }),
    CredentialsProviders({
      name:"credentials",
      credentials:{
       email:{label: "Email",type: "text",placeholder:"jsmith"},
       password:{label:"Password",type:"password"},
       username:{label:"Username",type:"text",placeholder:"John Smith"},
      } ,
      async authorize(credentials){
        if(!credentials.email  || !credentials.password){
          throw new Error('Please enter an email and password')
       }

       const user = await prisma.user.findUnique({
          where: {
              email:credentials.email
          }
       });

       if(!user || !user?.hashedPassword){
          throw new Error('No user found');
       }
       const passwordsMatch = await bcrypt.compare(credentials.password,user.hashedPassword);
       if(!passwordsMatch){
          throw new Error('Incorrect password');
       }
       return user;
      
      }
    }),
    
    // ...add more providers here
  ],
  session:{
    strategy: "jwt",
},
secret: process.env.NEXTAUTH_SECRET,
debug:  process.env.NODE_ENV === "development",

}




export const handler = NextAuth(authOptions);

export {handler as GET,handler as POST}