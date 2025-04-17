
export const CLUB_SAMPLE_IMAGES = {
  technology: {
    avatar: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=500&auto=format&fit=crop&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    banner: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  arts: {
    avatar: 'https://images.unsplash.com/photo-1509281373149-e957c6296abc?q=80&w=500&auto=format&fit=crop&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    banner: 'https://images.unsplash.com/photo-1511804146441-33e47f4d2d27?q=80&w=1000&auto=format&fit=crop&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  academic: {
    avatar: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=500&auto=format&fit=crop&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    banner: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?q=80&w=1000&auto=format&fit=crop&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  }
};

export const getClubSampleImage = (category: string) => {
  const categoryLower = category.toLowerCase();
  
  switch (categoryLower) {
    case 'technology':
      return CLUB_SAMPLE_IMAGES.technology;
    case 'arts':
      return CLUB_SAMPLE_IMAGES.arts;
    case 'academic':
      return CLUB_SAMPLE_IMAGES.academic;
    default:
      return {
        avatar: 'https://ui-avatars.com/api/?name=Club',
        banner: '/placeholder.svg'
      };
  }
};
