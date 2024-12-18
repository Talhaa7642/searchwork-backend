import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CanonicalIdService {
  generateId(prefix: string): string {
    const datePart = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const uniquePart = uuidv4().split('-')[0]; // For simplicity, just use the first part of the UUID

    return `${prefix}-${datePart}-${uniquePart}`;
  }
}
