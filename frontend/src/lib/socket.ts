import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

function resolveSocketBaseUrl(): string {
  const explicitSocketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
  if (explicitSocketUrl && explicitSocketUrl.trim().length > 0) {
    return explicitSocketUrl.trim().replace(/\/+$/, "");
  }

  if (typeof window !== "undefined") {
    const isLocalHost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    if (isLocalHost) {
      return (process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001").replace(/\/+$/, "");
    }

    return "";
  }

  return (process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001").replace(/\/+$/, "");
}

export function getSocket(): Socket {
  if (!socket) {
    const baseUrl = resolveSocketBaseUrl();

    socket = io(baseUrl, {
      path: "/socket.io",
      withCredentials: true,
      transports: ["polling", "websocket"],
      reconnection: true,
      reconnectionAttempts: 8,
      reconnectionDelay: 600
    });
  }
  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
