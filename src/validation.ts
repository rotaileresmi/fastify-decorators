import 'reflect-metadata';

import MetadataKeys from './metadataKeys.enum';

export default function Validation(validation): Function {
  return function (target, propertyKey: string) {
    Reflect.defineMetadata(
      MetadataKeys.ROUTE_VALIDATION,
      validation,
      target,
      propertyKey,
    );
  };
}
