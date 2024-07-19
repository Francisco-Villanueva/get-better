export interface IMessage {
  _id?: string;
  message: string;
  time: string;
  owner: string;
  type: MessageType;
  codeRoom: string;
}
export type MessageType = "text" | "image" | "audio";
