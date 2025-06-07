import { createTRPCRouter } from './trpc';
import { userRouter } from './routers/user';
import { organizationRouter } from './routers/organization';
import { projectRouter } from './routers/project';
import { projectMemberRouter } from './routers/project-member';
import { featureRouter } from './routers/feature';
import { bugRouter } from './routers/bug';
import { sprintRouter } from './routers/sprint';

export const appRouter = createTRPCRouter({
  user: userRouter,
  organization: organizationRouter,
  project: projectRouter,
  projectMember: projectMemberRouter,
  feature: featureRouter,
  bug: bugRouter,
  sprint: sprintRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
