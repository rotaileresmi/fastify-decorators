import { FastifyInstance } from 'fastify';

export default interface IController {
  injectRoutes(app: FastifyInstance): void;
}
