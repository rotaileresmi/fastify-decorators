import 'reflect-metadata';

import MetadataKeys from './metadataKeys.enum';

export default function Authentication(roles: string[], getRole?: Function): Function {
  return function (target, propertyKey: string) {
    if (!getRole) { getRole = function (req) { return req.user.role }; }
    Reflect.defineMetadata(
      MetadataKeys.ROUTE_AUTH_ROLES,
      roles,
      target,
      propertyKey,
    );

    Reflect.defineMetadata(
      MetadataKeys.ROUTE_AUTH_GET_ROLE,
      getRole,
      target,
      propertyKey,
    );
  };
}
