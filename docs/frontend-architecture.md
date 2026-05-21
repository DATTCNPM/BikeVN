# Frontend Clean Architecture Design Specification

This document defines the frontend architecture for the BikeVN project. It bridges the gap between the Spring Boot backend capabilities (documented in `backend-analysis.md`) and the frontend implementation using React, TypeScript, TanStack Query, React Router, Axios, Zustand, React Hook Form, and Zod.

---

## 1. Backend Analysis Summary & Frontend Strategy

Based on the backend specifications from `backend-analysis.md`, the frontend must handle several unique behaviors:

* **Authentication Flow**: Login is public, logout is public but requires blacklisting the token, and introspect checks if a token is valid. There is no refresh token endpoint. Therefore, the access token is stored in `localStorage`.
* **CORS Blockage**: `@CrossOrigin` is only configured on `/auth` and `/user` endpoints. The `/role` and `/permission` controllers do not support CORS from `http://localhost:5173`.
  * *Frontend Strategy*: The frontend will use Vite's dev server proxy to route all api calls to `/api` which resolves the CORS issue during local development.
* **HTTP 200 on 401 Unauthenticated**: Invalid/expired JWT calls return HTTP 200 OK with `{"code":401, "message":"Unauthenticated"}` instead of HTTP 401.
  * *Frontend Strategy*: The response interceptor must check the logical `code` in the JSON body. If `code === 401`, it must clear local authentication storage and redirect the user.
* **Role & Permission System**: The user's role is not returned in the `UserResponse` DTO.
  * *Frontend Strategy*: The frontend must decode the JWT on login/restoration (using a base64 decoder or `jwt-decode`) and extract the authorities from the `scope` claim (e.g., `"ROLE_user"`, `"ROLE_admin"`, `"ROLE_employee"`). Role names are case-sensitive and lowercase.
* **Deletion & Role Assignment Bugs**: The delete role/permission endpoints expect UUID primary keys but receive names. Also, user registration assignment creates a unique constraint conflict.
  * *Frontend Strategy*: The frontend should handle error states gracefully (returning 500 or validation errors) and prepare wrappers for role/permission actions that display validation failures cleanly.

---

## 2. Monorepo Folder Structure

The project is structured as a PNPM monorepo, separating shared logic into npm packages and frontend targets into applications.

```
apps/
 ├── admin/                  # Admin SPA (React + Vite)
 └── client-web/             # Client-facing SPA (React + Vite)

packages/
 ├── api/                    # Axios instances, request configurations, and api files
 ├── services/               # Token storage, base64 JWT decoders, role helpers
 ├── types/                  # TypeScript interfaces and API DTO definitions
 ├── schemas/                # Shared Zod schemas (matching backend annotations)
 ├── constants/              # Shared keys, path routes, and error codes
 └── utils/                  # Universal utility helpers (format, helpers)
```

### Responsibility Matrix

| Module | Responsibility | Shared / Isolated |
| :--- | :--- | :--- |
| `apps/admin` | Dashboard UI, branch management, vehicle management, reviews, and payments. | Isolated |
| `apps/client-web` | Client booking system, vehicle searching, review posting, and profile edits. | Isolated |
| `packages/api` | Declares Axios clients, sets interceptors, and exposes backend endpoints. Depends on `@repo/types`. | Shared |
| `packages/services` | Manages tokens in storage, extracts JWT claims, and handles client authorization guards. | Shared |
| `packages/types` | Centralized TypeScript types for request/response payloads and database models. | Shared |
| `packages/schemas` | Shared Zod schemas for login, registration, roles, and profiles. | Shared |
| `packages/constants` | Shared constant strings, routes, storage keys, and error mappings. | Shared |
| `packages/utils` | Shared helper functions like currency formatters or date parsers. | Shared |

---

## 3. API Layer Design

### Axios Instances

We design three Axios configurations in `packages/api/src/axios.ts` to separate request profiles:

1. **`publicAxios`**: For requests that do not require any headers or authentication.
2. **`authAxios`**: For endpoints requiring JWT Authorization header validation. It automatically attaches the bearer token on every request.
3. **`adminAxios`**: Similar to `authAxios` but can be configured with distinct timeouts or error notifications for administrative operations.

---

### Interceptors Architecture

#### Request Interceptor (Auth Token Attachment)
Checks `localStorage` for the stored access token and attaches it to the request config header:
```typescript
config.headers.Authorization = `Bearer ${token}`;
```

#### Response Interceptor (Error Normalization & Anomaly Handling)
* **HTTP 200 with Logical 401 Error**: If `response.data.code === 401` or `response.data.message === "Unauthenticated"`, it executes the logout procedure (clearing local storage and redirecting to `/login`).
* **HTTP 403 Access Denied**: Captures real HTTP status 403 from `JwtAccessDeniedHandler` and triggers forbidden state handling (blocking action or showing a forbidden screen).
* **HTTP 500 Standard Backend Error**: Standardizes standard exceptions (e.g. database unique violations or incorrect password) into structured error formats.

---

### API Files Organization (`packages/api/src/`)

API declarations are separated by domain objects:
* `authApi.ts`: `login`, `logout`, `introspect`.
* `userApi.ts`: `createUser`, `getAllUsers`, `getUser`, `deleteUser`.
* `roleApi.ts`: `createRole`, `getAllRoles`, `deleteRole`.
* `permissionApi.ts`: `createPermission`, `getAllPermissions`, `deletePermission`.

---

## 4. Services Layer Design

The services layer in `packages/services/src/` handles stateful storage interactions and security evaluations.

### Auth Storage Service (`authStorageService.ts`)
Encapsulates all actions reading/writing authentication states:
* `getToken()`: Retrieves token from `localStorage`.
* `setToken(token: string)`: Stores JWT token.
* `clearToken()`: Removes token.

### Token Service (`tokenService.ts`)
Handles claims analysis:
* `decodeToken(token: string)`: Decodes the JWT without verifying the signature (base64 decode of payload segment) to read fields.
* `getRoles(token: string)`: Extracts the `scope` claim, splits roles by space, and strips `ROLE_` prefix. Returns lowercase role strings (e.g. `["user", "admin"]`).
* `getUsername(token: string)`: Extracts the `sub` claim.
* `isExpired(token: string)`: Compares the `exp` claim (in seconds) to the current timestamp.

### Permission Service (`permissionService.ts`)
* `hasRole(token: string, requiredRole: string)`: Returns true if the decoded roles array contains the target.
* `hasPermission(rolePermissions: string[], requiredPermission: string)`: Validates actions against user capabilities.

---

## 5. Types Definition (`packages/types/src/`)

Centralized type safety based on Spring Boot models.

### `ApiResponse<T>` wrapper
```typescript
export interface ApiResponse<T> {
  code: number;
  message?: string;
  result?: T;
}
```

### Model Types
* `User`: Represents fields returned in `UserResponse` (`id`, `name`, `email`, `phone`, `cccdNumber`).
* `Role`: Represents fields returned in `RoleResponse` (`name`, `description`, `permissions: Set<Permission>`).
* `Permission`: Represents fields returned in `PermissionResponse` (`name`, `description`).
* `AuthResponse`: Represents `AuthenticationResponse` (`token`, `authenticated`).

---

## 6. Zod Schemas (`packages/schemas/src/`)

Synchronizes client-side form validations with backend Spring Validation messages:

* **Login Schema**:
  * `email`: Non-empty string.
  * `password`: Non-empty string.
* **Registration Schema**:
  * `name`: `@NotBlank(message = "USER_INVALID")`.
  * `email`: Standard email validation.
  * `passwordHash`: `@Size(min = 6, message = "PASSWORD_INVALID")` (Must match field key `passwordHash` exactly!).
  * `phone`: Optional string.
  * `cccdNumber`: Optional string.
* **Role Schema**:
  * `name`: Unique role name identifier.
  * `description`: String.
  * `permissions`: Set or array of strings (names of permissions).

---

## 7. TanStack Query Layer Design

TanStack Query manages server state cache and synchronization.

### Query Keys Strategy
Defined in `@repo/api` or directly in the apps to ensure cache consistency:
```typescript
export const queryKeys = {
  auth: {
    introspect: () => ['auth', 'introspect'] as const,
  },
  user: {
    all: () => ['users'] as const,
    detail: (id: string) => ['users', id] as const,
  },
  role: {
    all: () => ['roles'] as const,
  },
  permission: {
    all: () => ['permissions'] as const,
  }
};
```

### Queries & Mutations
* **Queries**:
  * `useUsers()`: Fetches all users.
  * `useUserDetail(id)`: Fetches a user.
  * `useRoles()`: Fetches all roles.
  * `usePermissions()`: Fetches all permissions.
* **Mutations**:
  * `useLoginMutation()`: Triggers `/auth/login`, saves the token, and resets client states.
  * `useRegisterMutation()`: Triggers user creation/registration.
  * `useLogoutMutation()`: Triggers blacklist registration on the backend and clears local storage.

---

## 8. Authentication & Authorization Flow

### Login Lifecycle

```
[Login Form Submit]
       │
       ▼
[useLoginMutation.mutate(credentials)]
       │
       ▼
[authApi.login(credentials)]
       │
       ▼
[Save token via authStorageService]
       │
       ▼
[Decode token to read subject & role scopes (e.g. ROLE_admin)]
       │
       ▼
[Update Zustand Auth State (userProfile, isLogin = true)]
       │
       ▼
[Redirect to Route matching User Role (/admin for admin, / for user)]
```

### Logout Lifecycle
1. Execute `authApi.logout({ token })` to save the token to the backend blacklist.
2. Call `authStorageService.clearToken()`.
3. Reset all query cache states via `queryClient.clear()`.
4. Redirect browser to `/login`.

### Access Guard Wrappers

#### `ProtectedRoute`
Intercepts navigation to secure paths. If no token exists or the token is expired, redirects to the application's login path.

#### `RoleGuard`
Checks if the current authenticated token contains the necessary role.
```typescript
interface RoleGuardProps {
  allowedRoles: string[];
  fallbackPath?: string;
  children: React.ReactNode;
}
```

#### `PermissionGuard`
Checks if the user has the required permissions. Since the `UserResponse` does not contain roles or permissions, the roles are decoded from the token, and their associated permissions must be retrieved from the cached role definition or matched client-side if a local permission map is maintained.

---

## 9. State Management Architecture

State is split into three scopes to avoid synchronization errors:

```
┌────────────────────────────────────────────────────────┐
│                    TANSTACK QUERY                      │
│  (Server Cache: Users list, Roles, Bookings, Vehicles)  │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                     ZUSTAND STORES                     │
│    (Global App States: UI theme, Auth Session, Token)   │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                     REACT CONTEXT                      │
│   (Ephemeral Local UI States: Drawer menu, Form wizard)│
└────────────────────────────────────────────────────────┘
```

1. **TanStack Cache**: Must handle all API resource data. Do not mirror query results into Zustand.
2. **Zustand Store**: Restricted to global, client-only configurations.
   * `useAuthStore` (Client): Auth status, token validation state.
   * `useAdminAuth` (Admin): Admin auth status.
3. **React Context**: Used only for localized UI dependencies (e.g., active step indexes in forms, drawer configurations).

---

## 10. Monorepo Sharing Strategy

### Shared Artifacts
* **`packages/types`**: Type declarations to ensure strict schema adherence between the apps and the API layer.
* **`packages/schemas`**: Zod validation schemas for forms.
* **`packages/api`**: Shared client configs, interceptors, and endpoints definitions.
* **`packages/services`**: Shared token decoder and role matching operations.
* **`packages/constants`**: Shared error messages, storage keys, and API paths.

### Isolated (Client/Admin Specific) Artifacts
* **Page State & UI layouts**: Form bindings, interactive tables, and modals.
* **Business Logic**: Admin app manages CRUD models, payments audits, and branch statistics. Client-web app manages rental checkout processes and user profile updates.

---

## 11. Error Handling Architecture

```
[Axios Interceptor catches Error]
              │
              ▼
    [Normalize Error Structure]
  (Extract message & map to ErrorCode)
              │
              ├───────────────────────────────┐
              ▼                               ▼
     [HTTP 200 Code 401]             [Business Error 400/500]
              │                               │
              ▼                               ▼
    [Clear storage token &           [Pass to React Hook Form /
      redirect to /login]             TanStack mutation onError]
```

1. **Error Normalization**: All errors are normalized by the interceptor into a standard interface:
   ```typescript
   export interface NormalizedError {
     code: number;
     message: string;
     errors?: Array<{ field: string; message: string }>;
   }
   ```
2. **Form Validation Error Integration**: Fields validated on the backend (like `@NotBlank` for user creations) return specific field errors. Zod schemas handle the initial frontend filtering, and custom error parsers map backend-returned validations back into React Hook Form error fields using:
   ```typescript
   setError("passwordHash", { message: error.message });
   ```
3. **HTTP 401/403 Handling**: 
   * **401**: Auto-triggered by response interceptor to sign out user.
   * **403**: Displays access denied banner or page.

---

## 12. Security Architecture

* **Token Storage**: Saved in `localStorage` for accessibility across the SPA pages. Secure access is protected by cleaning up state immediately if standard decodes fail.
* **Cross-Site Scripting (XSS)**: All user-generated text is sanitized. Sensitive data should not be printed directly into console logs or stored inside global contexts unencrypted.
* **Role Verification**: Verified on the frontend by parsing the JWT payload. Client-side security is only for user experience (hiding/showing buttons and routes). Strict verification rests on the backend API authorization checks.

---

## 13. Routing Specifications

Using `createBrowserRouter` from `react-router-dom`:

### Client App Routes (`apps/client-web/src/routes/`)
* **Guest Only**: `/login`, `/register`.
* **Protected (User Role)**: `/profile`, `/bookings`, `/checkout`.
* **Public**: `/`, `/vehicles`, `/vehicles/:id`.

### Admin App Routes (`apps/admin/src/router/`)
* **Guest Only**: `/admin/login`.
* **Protected (Admin/Employee Roles)**:
  * `/admin` (Dashboard)
  * `/admin/vehicles` (Vehicle CRUD)
  * `/admin/users` (User list)
  * `/admin/branches` (Branch config)
  * `/admin/bookings` (Booking logs)
  * `/admin/payments` (Payment auditing)

---

## 14. Coding Standards & Naming Conventions

* **Naming Conventions**:
  * File names: camelCase for API/Service helper files (`authApi.ts`, `tokenService.ts`), PascalCase for React components/layouts (`ProtectedRoute.tsx`, `MainLayout.tsx`).
  * Folders: kebab-case (`client-web`, `protected-route`).
* **API Naming**: Match resource domains (`userApi`, `roleApi`). Use standard verbs for endpoints: `getUsers()`, `createUser()`, `deleteUser(id)`.
* **Query Naming**: Use matching React hooks for TanStack queries: `useUsersQuery()`, `useUserDetailQuery(id)`, `useCreateUserMutation()`.
