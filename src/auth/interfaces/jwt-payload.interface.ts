import { Role } from '../../utils/constants/constants';

export interface JwtPayload {
  userId: number;
  role: Role;
  isEmailVerified: boolean;
}
