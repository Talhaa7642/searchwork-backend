import type { JwtModuleOptions } from '@nestjs/jwt';
export class JwtConfig {
  static createConfig(): () => {
    jwtAccess: JwtModuleOptions;
    jwtRefresh: JwtModuleOptions;
  } {
    return () => ({
      jwtAccess: {
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: process.env.JWT_ACCESS_EXPIRY },
      },
      jwtRefresh: {
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: process.env.JWT_REFRESH_EXPIRY },
      },
    });
  }
}
