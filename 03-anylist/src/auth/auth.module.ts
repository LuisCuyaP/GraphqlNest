import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  providers: [AuthResolver, AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule, JwtModule],
  imports: [
    ConfigModule, // Import ConfigModule for environment variables
    PassportModule.register({ defaultStrategy: 'jwt' }), // Import PassportModule with JWT strategy
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule to access environment variables
      inject: [ConfigService], // Inject ConfigService to use in the factory function
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'), // Get JWT secret from environment variables
        signOptions: {
          expiresIn: '4h', // Token expiration time
        }
      })
    }), // Register JwtModule asynchronously
    UsersModule,
  ],
})
export class AuthModule {}
