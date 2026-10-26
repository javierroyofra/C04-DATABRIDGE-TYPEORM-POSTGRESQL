// app.module.ts
// Esta isla tiene su propia conexiÃ³n y su propia base de datos.
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibrosModule } from './libros/libros.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'databridge_e06',
      autoLoadEntities: true,
      synchronize: true,
    }),
    LibrosModule,
  ],
})
export class AppModule {}
