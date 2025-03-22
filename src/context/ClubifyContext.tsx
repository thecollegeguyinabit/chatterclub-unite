import React, { createContext, useContext, useState, useEffect } from 'react';

// Types
export type User = {
  id: string;
  name: string;
  avatar: string;
  email: string;
  role?: 'admin' | 'moderator' | 'member';
};

export type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  reactions?: string[];
};

export type Club = {
  id: string;
  name: string;
  description: string;
  category: string;
  members: string[];
  admin: string;
  avatar: string;
  banner: string;
  channels: Channel[];
  createdAt: Date;
};

export type Channel = {
  id: string;
  name: string;
  messages: Message[];
  isPrivate: boolean;
  allowedUsers?: string[];
};

export type DirectMessage = {
  id: string;
  participants: [string, string];
  messages: Message[];
};

// Context type
type ClubifyContextType = {
  currentUser: User | null;
  isAuthenticated: boolean;
  clubs: Club[];
  userClubs: Club[];
  directMessages: DirectMessage[];
  activeClub: Club | null;
  activeChannel: Channel | null;
  activeChat: DirectMessage | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  createClub: (club: Omit<Club, 'id' | 'members' | 'admin' | 'createdAt'>) => void;
  joinClub: (clubId: string) => void;
  leaveClub: (clubId: string) => void;
  sendMessage: (message: string, channelId?: string, recipientId?: string) => void;
  setActiveClub: (clubId: string | null) => void;
  setActiveChannel: (channelId: string | null) => void;
  setActiveChat: (userId: string | null) => void;
  
  // New actions for club settings
  updateClub: (clubId: string, data: Partial<Club>) => void;
  addChannel: (clubId: string, channelName: string) => void;
  removeChannel: (clubId: string, channelId: string) => void;
  removeMember: (clubId: string, memberId: string) => void;
  promoteMember: (clubId: string, memberId: string) => void;
};

// Mock data
const mockUser: User = {
  id: '1',
  name: 'John Doe',
  avatar: 'https://ui-avatars.com/api/?name=John+Doe',
  email: 'john@example.com'
};

const mockClubs: Club[] = [
  {
    id: '1',
    name: 'Programming Club',
    description: 'For students who love coding and technology',
    category: 'Technology',
    members: ['1', '2', '3'],
    admin: '1',
    avatar: 'https://ui-avatars.com/api/?name=Programming+Club',
    banner: '/placeholder.svg',
    channels: [
      {
        id: '1-1',
        name: 'general',
        messages: [
          {
            id: '101',
            senderId: '2',
            text: 'Welcome to the Programming Club!',
            timestamp: new Date('2023-01-01T12:00:00')
          },
          {
            id: '102',
            senderId: '1',
            text: 'Thanks! Excited to be here.',
            timestamp: new Date('2023-01-01T12:05:00')
          }
        ],
        isPrivate: false
      },
      {
        id: '1-2',
        name: 'projects',
        messages: [],
        isPrivate: false
      }
    ],
    createdAt: new Date('2022-12-01')
  },
  {
    id: '2',
    name: 'Photography Club',
    description: 'For students passionate about photography',
    category: 'Arts',
    members: ['2', '3'],
    admin: '2',
    avatar: 'https://ui-avatars.com/api/?name=Photography+Club',
    banner: '/placeholder.svg',
    channels: [
      {
        id: '2-1',
        name: 'general',
        messages: [],
        isPrivate: false
      }
    ],
    createdAt: new Date('2022-11-15')
  },
  {
    id: '3',
    name: 'Debate Society',
    description: 'Hone your public speaking and debate skills',
    category: 'Academic',
    members: ['3', '4'],
    admin: '3',
    avatar: 'https://ui-avatars.com/api/?name=Debate+Society',
    banner: '/placeholder.svg',
    channels: [
      {
        id: '3-1',
        name: 'general',
        messages: [],
        isPrivate: false
      }
    ],
    createdAt: new Date('2022-10-20')
  }
];

const mockDirectMessages: DirectMessage[] = [
  {
    id: 'dm-1',
    participants: ['1', '2'],
    messages: [
      {
        id: '201',
        senderId: '2',
        text: 'Hey, how are you doing?',
        timestamp: new Date('2023-01-02T10:30:00')
      },
      {
        id: '202',
        senderId: '1',
        text: 'I\'m good! How about you?',
        timestamp: new Date('2023-01-02T10:35:00')
      }
    ]
  }
];

// Create context
const ClubifyContext = createContext<ClubifyContextType | undefined>(undefined);

// Provider component
export const ClubifyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [clubs, setClubs] = useState<Club[]>(mockClubs);
  const [directMessages, setDirectMessages] = useState<DirectMessage[]>(mockDirectMessages);
  const [activeClub, setActiveClubState] = useState<Club | null>(null);
  const [activeChannel, setActiveChannelState] = useState<Channel | null>(null);
  const [activeChat, setActiveChatState] = useState<DirectMessage | null>(null);

  // Initialize with mock data for demo
  useEffect(() => {
    // Simulate user authentication
    setCurrentUser(mockUser);
    setIsAuthenticated(true);
  }, []);

  // Computed properties
  const userClubs = clubs.filter((club) => 
    club.members.includes(currentUser?.id || ''));

  // Actions
  const login = async (email: string, password: string) => {
    // Simulate API call
    setCurrentUser(mockUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setActiveClubState(null);
    setActiveChannelState(null);
    setActiveChatState(null);
  };

  const register = async (name: string, email: string, password: string) => {
    // Simulate API call
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      avatar: `https://ui-avatars.com/api/?name=${name.replace(/ /g, '+')}`,
    };
    setCurrentUser(newUser);
    setIsAuthenticated(true);
  };

  const createClub = (clubData: Omit<Club, 'id' | 'members' | 'admin' | 'createdAt'>) => {
    if (!currentUser) return;
    
    const newClub: Club = {
      ...clubData,
      id: Math.random().toString(36).substr(2, 9),
      members: [currentUser.id],
      admin: currentUser.id,
      createdAt: new Date(),
      channels: [
        {
          id: Math.random().toString(36).substr(2, 9),
          name: 'general',
          messages: [],
          isPrivate: false
        }
      ]
    };
    
    setClubs([...clubs, newClub]);
  };

  const joinClub = (clubId: string) => {
    if (!currentUser) return;
    
    setClubs(clubs.map(club => {
      if (club.id === clubId && !club.members.includes(currentUser.id)) {
        return {
          ...club,
          members: [...club.members, currentUser.id]
        };
      }
      return club;
    }));
  };

  const leaveClub = (clubId: string) => {
    if (!currentUser) return;
    
    setClubs(clubs.map(club => {
      if (club.id === clubId) {
        return {
          ...club,
          members: club.members.filter(id => id !== currentUser.id)
        };
      }
      return club;
    }));
    
    if (activeClub?.id === clubId) {
      setActiveClubState(null);
      setActiveChannelState(null);
    }
  };

  const sendMessage = (messageText: string, channelId?: string, recipientId?: string) => {
    if (!currentUser) return;
    
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: currentUser.id,
      text: messageText,
      timestamp: new Date()
    };
    
    // Send to channel
    if (channelId && activeClub) {
      setClubs(clubs.map(club => {
        if (club.id === activeClub.id) {
          return {
            ...club,
            channels: club.channels.map(channel => {
              if (channel.id === channelId) {
                return {
                  ...channel,
                  messages: [...channel.messages, newMessage]
                };
              }
              return channel;
            })
          };
        }
        return club;
      }));
    }
    
    // Send direct message
    if (recipientId) {
      const participants: [string, string] = [currentUser.id, recipientId].sort() as [string, string];
      const existingDM = directMessages.find(dm => 
        dm.participants[0] === participants[0] && dm.participants[1] === participants[1]
      );
      
      if (existingDM) {
        setDirectMessages(directMessages.map(dm => {
          if (dm.id === existingDM.id) {
            return {
              ...dm,
              messages: [...dm.messages, newMessage]
            };
          }
          return dm;
        }));
      } else {
        const newDM: DirectMessage = {
          id: Math.random().toString(36).substr(2, 9),
          participants,
          messages: [newMessage]
        };
        setDirectMessages([...directMessages, newDM]);
      }
    }
  };

  const setActiveClub = (clubId: string | null) => {
    if (!clubId) {
      setActiveClubState(null);
      setActiveChannelState(null);
      return;
    }
    
    const club = clubs.find(c => c.id === clubId) || null;
    setActiveClubState(club);
    
    // Set first channel as active by default
    if (club && club.channels.length > 0) {
      setActiveChannelState(club.channels[0]);
    } else {
      setActiveChannelState(null);
    }
    
    // Clear direct message selection
    setActiveChatState(null);
  };

  const setActiveChannel = (channelId: string | null) => {
    if (!activeClub || !channelId) {
      setActiveChannelState(null);
      return;
    }
    
    const channel = activeClub.channels.find(c => c.id === channelId) || null;
    setActiveChannelState(channel);
  };

  const setActiveChat = (userId: string | null) => {
    if (!currentUser || !userId) {
      setActiveChatState(null);
      return;
    }
    
    const participants: [string, string] = [currentUser.id, userId].sort() as [string, string];
    const chat = directMessages.find(dm => 
      dm.participants[0] === participants[0] && dm.participants[1] === participants[1]
    );
    
    if (chat) {
      setActiveChatState(chat);
    } else {
      // Create a new empty chat
      const newChat: DirectMessage = {
        id: Math.random().toString(36).substr(2, 9),
        participants,
        messages: []
      };
      setDirectMessages([...directMessages, newChat]);
      setActiveChatState(newChat);
    }
    
    // Clear club/channel selection
    setActiveClubState(null);
    setActiveChannelState(null);
  };

  const updateClub = (clubId: string, data: Partial<Club>) => {
    setClubs(clubs.map(club => {
      if (club.id === clubId) {
        return { ...club, ...data };
      }
      return club;
    }));
  };

  const addChannel = (clubId: string, channelName: string) => {
    setClubs(clubs.map(club => {
      if (club.id === clubId) {
        const newChannel: Channel = {
          id: Math.random().toString(36).substr(2, 9),
          name: channelName,
          messages: [],
          isPrivate: false
        };
        return {
          ...club,
          channels: [...club.channels, newChannel]
        };
      }
      return club;
    }));
  };

  const removeChannel = (clubId: string, channelId: string) => {
    setClubs(clubs.map(club => {
      if (club.id === clubId) {
        return {
          ...club,
          channels: club.channels.filter(channel => channel.id !== channelId)
        };
      }
      return club;
    }));
  };

  const removeMember = (clubId: string, memberId: string) => {
    setClubs(clubs.map(club => {
      if (club.id === clubId) {
        return {
          ...club,
          members: club.members.filter(id => id !== memberId)
        };
      }
      return club;
    }));
  };

  const promoteMember = (clubId: string, memberId: string) => {
    // In a real app, you would update the member's role in the database
    // For this demo we'll just show a console.log
    console.log(`Promoted member ${memberId} to moderator in club ${clubId}`);
  };

  const value = {
    currentUser,
    isAuthenticated,
    clubs,
    userClubs,
    directMessages,
    activeClub,
    activeChannel,
    activeChat,
    
    login,
    logout,
    register,
    createClub,
    joinClub,
    leaveClub,
    sendMessage,
    setActiveClub,
    setActiveChannel,
    setActiveChat,
    
    updateClub,
    addChannel,
    removeChannel,
    removeMember,
    promoteMember
  };

  return (
    <ClubifyContext.Provider value={value}>
      {children}
    </ClubifyContext.Provider>
  );
};

// Custom hook
export const useClubify = () => {
  const context = useContext(ClubifyContext);
  if (context === undefined) {
    throw new Error('useClubify must be used within a ClubifyProvider');
  }
  return context;
};
