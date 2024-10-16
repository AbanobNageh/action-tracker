import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ActionsModule } from './actions/actions.module';
import { UsersModule } from './users/users.module';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilteer } from './core-utils/filter/global.exception.filter';
import { CoreUtilsModule } from './core-utils/core-utils.module';

@Module({
  imports: [ActionsModule, UsersModule, DatabaseModule, CoreUtilsModule],
  controllers: [AppController],
  providers: [AppService, { provide: APP_FILTER, useClass: GlobalExceptionFilteer }],
})
export class AppModule {}
