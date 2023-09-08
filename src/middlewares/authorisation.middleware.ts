import { Extensions, MiddlewareContext, NextFn } from '@nestjs/graphql';

enum ExposeGroup {
  OWNER = 'OWNER',
}

// This is for authorization. It will check if the user is the owner of the object. This protects sensitive info like email from being exposed to other users
export const OwnerOnly = () =>
  Extensions({ exposeGroups: [ExposeGroup.OWNER] });

export async function exposeFieldGroupMiddleware(
  { source, info, context }: MiddlewareContext,
  next: NextFn,
) {
  const { extensions } = info.parentType.getFields()[info.fieldName];
  if (extensions?.exposeGroups) {
    const exposeGroups = extensions.exposeGroups as ExposeGroup[];
    const userIdFromSession = context?.req?.user.id;

    if (exposeGroups.includes(ExposeGroup.OWNER)) {
      const isOwner = source?.id && userIdFromSession === source?.id;
      if (isOwner) return next();
    }

    return null;
  }

  return next();
}
