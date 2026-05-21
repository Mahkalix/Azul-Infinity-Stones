import { io, Socket } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL: string | undefined = import.meta.env.PROD ? undefined : "http://localhost:3001";

export const socket: Socket = io(URL as any);

export default socket;
