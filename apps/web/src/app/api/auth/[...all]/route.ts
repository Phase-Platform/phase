import NextAuth from 'next-auth';

import { authOptions } from '@phase-platform/auth';

const handler = NextAuth(authOptions);

export const { GET, POST } = handler;
