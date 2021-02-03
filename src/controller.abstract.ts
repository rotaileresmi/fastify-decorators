import { FastifyInstance } from 'fastify';
import 'reflect-metadata';

import MetadataKeys from './metadataKeys.enum';
import MetadataTypes from './metadataTypes.enum';

import IController from './controller.interface';

export default abstract class ControllerAbstract implements IController {
  authentication(allowedRoles: string[], getRole: Function): Function {
    return async (req, res, next) => {
      try {
        if (allowedRoles.indexOf('*') > -1) {
          next();
        } else {
          const role = await getRole(req);

          if (allowedRoles.indexOf(role) > -1) {
            next();
          } else {
            res.status(403).send({
              message: 'You dont have permission for this action',
            });
          }
        }
      } catch (error) {
        res.status(401).send({
          message: 'You need to login for this action',
        });
      }
    };
  }

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
          preValidation: []
        };
        const allowedRoles = Reflect.getOwnMetadata(
          MetadataKeys.ROUTE_AUTH_ROLES,
          instance,
          propertyName,
        );
        const getRole: Function = Reflect.getOwnMetadata(
          MetadataKeys.ROUTE_AUTH_GET_ROLE,
          instance,
          propertyName,
        );

        if (validationSchemas) {
          if (validationSchemas.body) {
            routeOptions.schema.body = validationSchemas.body;
          }

          if (validationSchemas.query) {
            routeOptions.schema.query = validationSchemas.query;
          }
        }

        if (allowedRoles && getRole) {
          routeOptions.preValidation.push(this.authentication(allowedRoles, getRole));
        }


        app[method](url, routeOptions, instance[propertyName]);
      });
  }
}
