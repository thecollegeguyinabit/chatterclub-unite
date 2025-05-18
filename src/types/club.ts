
export interface Channel {
  id: string;
  name: string;
  isPrivate?: boolean;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  avatar: string;
  banner: string;
  admin: string;
  members: string[];
  channels: Channel[];
}
