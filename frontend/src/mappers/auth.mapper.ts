import { AuthResponseDto, LoginRequestDto, UserResponseDto } from "@/dtos/auth.dto";
import { AuthSession, User, UserRole } from "@/entities/user.entity";

export class AuthMapper {
  static toSession(dto: AuthResponseDto): AuthSession {
    const roles = (dto.roles || []) as UserRole[];
    const user: User = {
      username: dto.username,
      fullName: dto.fullName || dto.username,
      email: dto.email,
      roles: roles,
      enabled: true,
    };

    return {
      token: dto.token,
      user: user,
      isAuthenticated: !!dto.token,
      isAdmin: roles.includes("ROLE_ADMIN"),
    };
  }

  static toUserFromResponse(dto: UserResponseDto): User {
    return {
      id: dto.id,
      username: dto.username,
      fullName: dto.fullName || dto.username,
      email: dto.email,
      roles: (dto.roles || []) as UserRole[],
      enabled: dto.enabled,
    };
  }

  static toLoginDto(credentials: { username: string; password: string }): LoginRequestDto {
    return {
      username: credentials.username.trim(),
      password: credentials.password,
    };
  }
}
