import { Module } from '@nestjs/common';
import { AuthCoreModule } from '../auth-core/auth-core.module';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  imports: [AuthCoreModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
