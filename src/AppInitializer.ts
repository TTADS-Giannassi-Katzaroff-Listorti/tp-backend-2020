import bodyParser from 'body-parser';
import express from 'express';
import { Server } from 'http';
import 'reflect-metadata';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import errorHandler from './middleware/errorHandler';

export default class AppInitializer {
  public app: express.Application;
  public server?: Server;
  public connection?: Connection;

  constructor() {
    this.app = express();
  }

  public async init(connectionOptions?: ConnectionOptions) {
    const options: ConnectionOptions = connectionOptions || {
      type: 'postgres',
      host: process.env['DB_HOST'],
      port: parseInt(process.env['DB_PORT']!),
      username: process.env['DB_USERNAME'],
      password: process.env['DB_PASSWORD'],
      database: process.env['DB_DATABASE'],
      synchronize: true,
      entities: [__dirname + '/entities/*.js'],
    };
    try {
      this.connection = await createConnection(options);
      const port = parseInt(process.env['APP_PORT']!) || 4444;

      this.app.use(bodyParser.json({ limit: '500kb' }));

      this.app.use(errorHandler);

      this.server = this.app.listen(port, () =>
        console.log('Listening on port ' + port)
      );
    } catch (error) {
      console.error(error);
    }
  }
}
