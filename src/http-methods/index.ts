/* eslint no-param-reassign: 0 */
import 'reflect-metadata';

import parsePath from '../utils/parsePath';

import HttpMethods from './methods.enum';
import MetadataKeys from '../metadataKeys.enum';
import MetadataTypes from '../metadataTypes.enum';

function Base(path: string, method: string): Function {
  return function (target, propertyKey: string) {
    Reflect.defineMetadata(
      MetadataKeys.TYPE,
      MetadataTypes.ROUTE,
      target,
      propertyKey,
    );

    Reflect.defineMetadata(
      MetadataKeys.ROUTE_PATH,
      path,
      target,
      propertyKey,
    );

    Reflect.defineMetadata(
      MetadataKeys.ROUTE_METHOD,
      method,
      target,
      propertyKey,
    );
  };
}

export function Get(path?: string): Function {
  path = parsePath(path);
  return Base(path, HttpMethods.GET);
}

export function Post(path?: string): Function {
  path = parsePath(path);

  return Base(path, HttpMethods.POST);
}

export function Put(path?: string): Function {
  path = parsePath(path);

  return Base(path, HttpMethods.PUT);
}

export function Patch(path?: string): Function {
  path = parsePath(path);

  return Base(path, HttpMethods.PATCH);
}

export function Delete(path?: string): Function {
  path = parsePath(path);

  return Base(path, HttpMethods.DELETE);
}
