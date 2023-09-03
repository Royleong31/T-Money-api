import { Injectable } from '@nestjs/common';

import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class MerchantService {
  constructor(private readonly databaseService: DatabaseService) {}
}
