import "@testing-library/jest-dom/vitest";
import type { ReactNode } from "react";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { server } from "./mocks/server";

// Set environment variables for HttpClient
process.env.NEXT_PUBLIC_BASE_API_URL = "http://localhost:8000";
process.env.PLATFORM_KEY = "test-platform-key";

// Setup MSW
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => "/mx-es",
  useSearchParams: () => new URLSearchParams(),
}));

// Create mock translation function that returns keys or provides rich text support
const createMockTranslations = () => {
  const t = (key: string) => key;
  t.raw = (key: string) => {
    // Return mock arrays for known content keys
    if (key === "content") {
      return [
        "1. First section heading",
        "First section content paragraph",
        "2. Second section heading",
        "Second section content paragraph",
      ];
    }
    if (key.includes("bullets")) {
      return ["Bullet point 1", "Bullet point 2", "Bullet point 3"];
    }
    return [key];
  };
  t.rich = (key: string, options?: Record<string, unknown>) => {
    if (options?.strong) {
      return (options.strong as (chunks: string) => ReactNode)(key);
    }
    return key;
  };
  return t;
};

// Mock next-intl (client-side)
vi.mock("next-intl", () => ({
  useTranslations: () => createMockTranslations(),
  useLocale: () => "mx-es",
}));

// Mock next-intl/server (server-side)
vi.mock("next-intl/server", () => ({
  getTranslations: () => Promise.resolve(createMockTranslations()),
  getLocale: () => Promise.resolve("mx-es"),
}));

// Mock Clerk
vi.mock("@clerk/nextjs", () => ({
  useUser: () => ({
    isSignedIn: true,
    user: { id: "test-user-id", username: "testuser" },
  }),
  useAuth: () => ({
    userId: "test-user-id",
    isLoaded: true,
    isSignedIn: true,
  }),
  auth: () =>
    Promise.resolve({
      userId: "test-user-id",
      getToken: () => Promise.resolve("test-token"),
    }),
  currentUser: () =>
    Promise.resolve({
      id: "test-user-id",
      username: "testuser",
      imageUrl: "https://example.com/avatar.png",
    }),
  SignedIn: ({ children }: { children: ReactNode }) => children,
  SignedOut: ({ children }: { children: ReactNode }) => children,
  SignInButton: ({ children }: { children?: ReactNode }) =>
    children || "Sign In",
  SignUpButton: ({ children }: { children?: ReactNode }) =>
    children || "Sign Up",
  ClerkProvider: ({ children }: { children: ReactNode }) => children,
}));

// Mock Next.js Image component
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    ...props
  }: {
    src: string | { src: string };
    alt: string;
  }) => {
    const imgSrc = typeof src === "object" ? src.src : src;
    // biome-ignore lint/performance/noImgElement: Test mock for Next.js Image
    return <img src={imgSrc} alt={alt} {...props} />;
  },
}));
