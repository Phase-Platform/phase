import { PrismaAdapter } from '@auth/prisma-adapter';
import { type NextApiRequest } from 'next';
import { prisma } from '@phase-platform/database';
import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import type { User } from '@prisma/client';

interface Credentials {
  email: string;
  password: string;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: Credentials | undefined) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            accounts: {
              where: {
                type: 'credentials',
              },
            },
          },
        });

        if (!user || !user.accounts[0]?.access_token) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.accounts[0].access_token
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt' as const,
  },
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
};

export const getServerSession = async (req: NextApiRequest) => {
  const session =
    (await authOptions.session?.strategy) === 'jwt'
      ? {
          user: req.headers.authorization
            ? JSON.parse(req.headers.authorization)
            : null,
        }
      : null;
  return session;
};

export const auth = {
  handler: async (req: Request) => {
    const session = await getServerSession(req as unknown as NextApiRequest);
    return new Response(JSON.stringify(session), {
      headers: { 'Content-Type': 'application/json' },
    });
  },
};
