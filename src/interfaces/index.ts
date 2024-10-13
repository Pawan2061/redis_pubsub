export interface ChatClient extends WebSocket {
  userId: string;
}

export interface Message {
  message: string;
}
