export interface Notification {
    id: string;
    kind: number;
    pubkey: string;
    created_at: number;
    content: string;
    read: boolean;
    tags: string[][];
  }
  