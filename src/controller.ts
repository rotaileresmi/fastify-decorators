import MetadataKeys from './metadataKeys.enum';

export default function Controller (prefix: string): Function {
  return function (target) {
    Reflect.defineMetadata(
      MetadataKeys.CONTROLLER_PREFIX,
      prefix,
      target,
    );
  };
}
