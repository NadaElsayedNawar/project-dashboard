import { User, UserRole } from '@/types'

export function generateToken(user: User): string {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + 24 * 60 * 60 * 1000,
  }
  return btoa(JSON.stringify(payload))
}

export function decodeToken(token: string): any {
  try {
    return JSON.parse(atob(token))
  } catch {
    return null
  }
}

export function isTokenValid(token: string): boolean {
  const decoded = decodeToken(token)
  if (!decoded) return false
  return decoded.exp > Date.now()
}

export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    Developer: 1,
    ProjectManager: 2,
    Admin: 3,
  }
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

export const MOCK_USERS: Array<User & { password: string }> = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'Admin',
  },
  {
    id: '2',
    email: 'pm@example.com',
    password: 'project123',
    name: 'Project Manager',
    role: 'ProjectManager',
  },
  {
    id: '3',
    email: 'dev@example.com',
    password: 'dev123',
    name: 'Developer User',
    role: 'Developer',
  },
]

export async function mockLogin(
  email: string,
  password: string
): Promise<{ user: User; token: string } | null> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const user = MOCK_USERS.find(
    (u) => u.email === email && u.password === password
  )

  if (!user) return null

  const { password: _, ...userWithoutPassword } = user
  const token = generateToken(userWithoutPassword)

  return { user: userWithoutPassword, token }
}
