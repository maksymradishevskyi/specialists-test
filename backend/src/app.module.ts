import { Module } from '@nestjs/common';
import { SpecialistsModule } from './specialists/specialists.module';

@Module({
  imports: [SpecialistsModule]
})
export class AppModule {}

