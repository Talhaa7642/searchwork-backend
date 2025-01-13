// d7-networks.module.ts
import { Module } from '@nestjs/common';
import { D7NetworksService } from './d7.service';

@Module({
  providers: [D7NetworksService],
  exports: [D7NetworksService],
})
export class D7NetworksModule {}
