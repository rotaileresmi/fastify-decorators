import { FastifyInstance } from 'fastify';
import 'reflect-metadata';

import MetadataKeys from './metadataKeys.enum';
import MetadataTypes from './metadataTypes.enum';

import IController from './controller.interface';

export default abstract class ControllerAbstract implements IController {
  injectRoutes(app: FastifyInstance): void {
    const instance = this.constructor.prototype;
    Object.getOwnPropertyNames(instance)
      .filter((propertyName: string): boolean => {
        const metadata = Reflect.getOwnMetadata(
          MetadataKeys.TYPE,
          instance,
          propertyName,
        );
        return metadata === MetadataTypes.ROUTE;
      })
      .forEach((propertyName: string) => {
        const routePath: string = Reflect.getOwnMetadata(
          MetadataKeys.ROUTE_PATH,
          instance,
          propertyName,
        );
        const method: string = Reflect.getOwnMetadata(
          MetadataKeys.ROUTE_METHOD,
          instance,
          propertyName,
        );
        const prefix: string = Reflect.getOwnMetadata(
          MetadataKeys.CONTROLLER_PREFIX,
          this.constructor,
        );
        const validationSchemas = Reflect.getOwnMetadata(
          MetadataKeys.ROUTE_VALIDATION,
          instance,
          propertyName,
        );
        const url: string = `${prefix}${routePath}`;
        const routeOptions = {
          validatorCompiler: (param) => (
            (data) => param.schema.validate(data, { abortEarly: false })
          ),
          schema: {
            body: undefined,
            query: undefined,
          },
        };

        if (validationSchemas) {
          if (validationSchemas.body) {
            routeOptions.schema.body = validationSchemas.body;
          }

          if (validationSchemas.query) {
            routeOptions.schema.query = validationSchemas.query;
          }
        }
        app[method](url, routeOptions, instance[propertyName]);
      });
  }
}
