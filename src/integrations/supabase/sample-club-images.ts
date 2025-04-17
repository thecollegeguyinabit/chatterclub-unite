
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
  },
  sports: {
    avatar: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=500&auto=format&fit=crop&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    banner: 'https://images.unsplash.com/photo-1510925758641-869d353cecc7?q=80&w=1000&auto=format&fit=crop&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  culture: {
    avatar: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?q=80&w=500&auto=format&fit=crop&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    banner: 'https://images.unsplash.com/photo-1552084117-56a987666449?q=80&w=1000&auto=format&fit=crop&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  "community service": {
    avatar: 'https://images.unsplash.com/photo-1560252829-804f1aedf1be?q=80&w=500&auto=format&fit=crop&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    banner: 'https://images.unsplash.com/photo-1593113598332-cd59a93f9dd4?q=80&w=1000&auto=format&fit=crop&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  professional: {
    avatar: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?q=80&w=500&auto=format&fit=crop&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    banner: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  }
};

export const getClubSampleImage = (category: string) => {
  const categoryLower = category.toLowerCase();
  
  if (categoryLower in CLUB_SAMPLE_IMAGES) {
    return CLUB_SAMPLE_IMAGES[categoryLower as keyof typeof CLUB_SAMPLE_IMAGES];
  }
  
  return {
    avatar: 'https://ui-avatars.com/api/?name=Club',
    banner: '/placeholder.svg'
  };
};
