export interface IMessage {
  message: string;
  time: string;
  owner: string;
  codeRoom: string;
  type: MessageType;
}
export type MessageType = 'text' | 'image' | 'audio';
