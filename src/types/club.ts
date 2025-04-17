
export interface Channel {
  id: string;
  name: string;
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
