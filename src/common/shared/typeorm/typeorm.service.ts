import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigSerivce implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;
  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '240601',
      database: 'mypham',
      synchronize: true,
    };
  }
}
