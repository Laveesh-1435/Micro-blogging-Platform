const getRandomRecentTime = () => {
    const units = ['s', 'm', 'h', 'd'];
    const value = Math.floor(Math.random() * 60) + 1;
    const unit = units[Math.floor(Math.random() * units.length)];
    return `${value}${unit}`;
  };
  
  const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  
  // Collection of profile pictures (using placeholder paths)
  const profileImages = [
    './profile.jpg',
    './boys.jpg',
    './lights.jpg',
    './portrait.jpg',
    'https://randomuser.me/api/portraits/men/1.jpg',
    'https://randomuser.me/api/portraits/women/2.jpg',
    'https://randomuser.me/api/portraits/men/3.jpg',
    'https://randomuser.me/api/portraits/women/4.jpg',
    'https://randomuser.me/api/portraits/men/5.jpg',
    'https://randomuser.me/api/portraits/women/6.jpg',
    'https://randomuser.me/api/portraits/men/7.jpg',
    'https://randomuser.me/api/portraits/women/8.jpg'
  ];
  
  // Collection of post images (using placeholders)
  const postImages = [
    'https://picsum.photos/id/1011/600/400', // forest
    'https://picsum.photos/id/1015/600/400', // mountain
    'https://picsum.photos/id/1020/600/400', // beach
    'https://picsum.photos/id/1035/600/400', // city street
    'https://picsum.photos/id/1041/600/400', // cozy indoors
    'https://picsum.photos/id/1052/600/400', // architecture
    'https://picsum.photos/id/1060/600/400', // books / study
    'https://picsum.photos/id/1069/600/400', // friends outdoors
    'https://picsum.photos/id/1074/600/400', // desk setup
    'https://picsum.photos/id/1080/600/400', // scenic road
    'https://picsum.photos/id/1084/600/400', // food / brunch
    'https://picsum.photos/id/1081/600/400', // music / guitar
    'https://picsum.photos/id/1082/600/400', // workspace
    'https://picsum.photos/id/1083/600/400', // city life
    'https://picsum.photos/id/1085/600/400', // mountain lake
    'https://picsum.photos/id/1086/600/400', // night cityscape
    'https://picsum.photos/id/1087/600/400', // walking in nature
    'https://picsum.photos/id/1088/600/400', // fitness / running
    'https://picsum.photos/id/1089/600/400', // traveling
    'https://picsum.photos/id/1090/600/400'  // campfire vibes
  ];
  
  // Collection of common hashtags
  const hashtags = [
    'FlitterLife',
    'TrendingNow',
    'ThoughtOfTheDay',
    'MondayMotivation',
    'TuesdayThoughts',
    'WednesdayWisdom',
    'ThursdayThrill',
    'FridayFeeling',
    'SaturdayVibes',
    'SundayFunday',
    'TechNews',
    'FoodLovers',
    'TravelDiaries',
    'FitnessGoals',
    'BookWorm',
    'MovieNight',
    'MusicLife',
    'PetLover',
    'ArtisticSoul',
    'SportsUpdate'
  ];
  
  // Generate 40 user profiles
  const users = Array.from({ length: 40 }, (_, index) => {
    // Generate a unique set of first and last names
    const firstNames = [
      'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles',
      'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen',
      'Emily', 'Emma', 'Madison', 'Abigail', 'Olivia', 'Isabella', 'Sophia', 'Ava', 'Mia', 'Charlotte',
      'Liam', 'Noah', 'Ethan', 'Mason', 'Lucas', 'Logan', 'Caleb', 'Jacob', 'Jackson', 'Aiden'
    ];
    
    const lastNames = [
      'Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor',
      'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson',
      'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'Hernandez', 'King',
      'Wright', 'Lopez', 'Hill', 'Scott', 'Green', 'Adams', 'Baker', 'Gonzalez', 'Nelson', 'Carter'
    ];
    
    const firstName = firstNames[index % firstNames.length];
    const lastName = lastNames[getRandomNumber(0, lastNames.length - 1)];
    const handle = `${firstName.toLowerCase()}${getRandomNumber(10, 99)}`;
    
    return {
      id: index + 1,
      name: `${firstName} ${lastName}`,
      handle: handle,
      profilePic: profileImages[index % profileImages.length],
      bio: `${firstName} is a ${['passionate', 'dedicated', 'creative', 'innovative', 'professional'][getRandomNumber(0, 4)]} ${['developer', 'designer', 'writer', 'photographer', 'marketer', 'traveler', 'foodie', 'artist', 'musician', 'entrepreneur'][getRandomNumber(0, 9)]}.`,
      followers: getRandomNumber(10, 10000),
      following: getRandomNumber(10, 1000),
      joinDate: `${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][getRandomNumber(0, 11)]} ${getRandomNumber(2015, 2025)}`
    };
  });
  
  // First user is the logged-in user
  const userData = {
    id: users[0].id,
    name: users[0].name,
    handle: users[0].handle,
    profilePic: users[0].profilePic,
    bio: users[0].bio,
    followers: users[0].followers,
    following: users[0].following,
    joinDate: users[0].joinDate
  };
  
  // Generate 40 flitts (posts) - MODIFIED to ensure every flitt has an image
  const flittsData = Array.from({ length: 40 }, (_, index) => {
    
    const authorIndex = 1 + getRandomNumber(0, users.length - 2); 
    const author = users[authorIndex];
    
   
    const imageIndex = index % postImages.length;
    

    const postHashtags = Array.from({ length: getRandomNumber(0, 3) }, () => {
      return hashtags[getRandomNumber(0, hashtags.length - 1)];
    });
    
    // Generate post text content
    const postContents = [
      "Just finished an amazing book. Highly recommend!",
      "Can't believe what just happened on my commute today...",
      "New recipe turned out perfect! Who wants the recipe?",
      "This view is absolutely breathtaking!",
      "Monday motivation: just keep going!",
      "What's everyone's plan for the weekend?",
      "Throwback to that amazing vacation last year.",
      "Just announced: new project launching next month!",
      "Hot take: pineapple DOES belong on pizza.",
      "The sunset this evening is just unreal.",
      "Who else is excited for the new season of that show?",
      "Working from home today and my cat won't leave my keyboard alone.",
      "Just PR'd at the gym! Hard work pays off.",
      "Having the best coffee of my life right now.",
      "Looking for recommendations for a good podcast, any suggestions?",
      "Just moved into my new place! So excited!",
      "Saw the most incredible street art downtown today.",
      "Need advice: what's the best way to learn a new language?",
      "Attended an amazing concert last night. Still feeling the energy!",
      "Sometimes the simplest moments are the most memorable.",
      "Unpopular opinion: raisins in cookies are actually delicious.",
      "First day at my new job! Wish me luck!",
      "Just adopted the cutest puppy ever. Name suggestions?",
      "The weather today is absolutely perfect for a hike.",
      "My garden is finally blooming! All that work is paying off.",
      "Celebrating 5 years of being on Flitter today!",
      "Anyone else watching the game tonight?",
      "Trying out a new restaurant tonight, heard great things!",
      "TIL something fascinating about how bees communicate.",
      "Feeling grateful for all the support from this community.",
      "Spent the whole day coding and finally fixed that bug!",
      "Happy birthday to my best friend! Couldn't ask for better.",
      "Just launched my online store! Check it out!",
      "What's your favorite movie of all time and why?",
      "Pro tip: always backup your important files regularly.",
      "Cooking experiment gone wrong... ordering takeout tonight.",
      "Finally visited that museum I've been wanting to see forever.",
      "Anyone else experiencing this app glitch or just me?",
      "Rare sighting on my morning walk today!",
      "Current status: contemplating the meaning of life over coffee."
    ];
    
    const text = postContents[index % postContents.length];
    
    // Generate between 0 and 5 replies for each post
    const numReplies = getRandomNumber(0, 5);
    const replies = Array.from({ length: numReplies }, () => {
      // Randomly select a user to author the reply
      const replyAuthorIndex = getRandomNumber(0, users.length - 1);
      const replyAuthor = users[replyAuthorIndex];
      
      // Generate reply content
      const replyContents = [
        "Totally agree with this!",
        "This made my day!",
        "I've been thinking the same thing.",
        "Have you tried looking into this further?",
        "Thanks for sharing this perspective.",
        "I had a similar experience last week!",
        "This is so insightful!",
        "Couldn't agree more!",
        "Love this content, keep it coming!",
        "First time I've heard about this, interesting!",
        "Would love to hear more of your thoughts on this.",
        "This is exactly what I needed to hear today.",
        "Mind blown! 🤯",
        "You always have the best takes!",
        "Haha, this is so relatable!",
        "Can't believe I missed this!",
        "I'm saving this for later reference.",
        "This is the quality content I follow you for!",
        "Hard disagree, but respect your opinion.",
        "100% this!"
      ];
      
      return {
        author: {
          id: replyAuthor.id,
          name: replyAuthor.name,
          handle: replyAuthor.handle,
          profilePic: replyAuthor.profilePic
        },
        text: replyContents[getRandomNumber(0, replyContents.length - 1)],
        timePosted: getRandomRecentTime(),
        likes: getRandomNumber(0, 25)
      };
    });
    
    return {
      id: index + 1,
      author: {
        id: author.id,
        name: author.name,
        handle: author.handle,
        profilePic: author.profilePic
      },
      text: text,
      hashtags: postHashtags,
      timePosted: getRandomRecentTime(),
      image: postImages[imageIndex], // Always assign an image
      imageAlt: "Post image", // Always include imageAlt
      replies: replies,
      reflitts: getRandomNumber(0, 50),
      likes: getRandomNumber(0, 100)
    };
  });
  
  // Generate trending topics data
  const trendsData = [
    {
      category: "Trending worldwide",
      name: "#BreakingNews",
      count: "10,094 people are Flitting about this"
    },
    {
      category: "Space",
      name: "Lunar photography improves the discovery of the moon",
      count: "5,721 people are Flitting about this"
    },
    {
      category: "Trending worldwide",
      name: "#WorldNews",
      count: "125K Flitts"
    },
    {
      category: "Animals",
      name: "These cats are ready for #InternationalCatDay",
      count: "2,757 people are Flitting about this"
    },
    {
      category: "Trending worldwide",
      name: "#GreatestOfAllTime",
      count: "100K Flitts"
    },
    {
      category: "Technology",
      name: "The latest on AI development",
      count: "8,452 people are Flitting about this"
    },
    {
      category: "Sports",
      name: "#ChampionsLeague",
      count: "15K Flitts"
    },
    {
      category: "Entertainment",
      name: "New blockbuster movie breaks records",
      count: "3,211 people are Flitting about this"
    },
    {
      category: "Music",
      name: "#NewMusicFriday",
      count: "7,659 Flitts"
    },
    {
      category: "Food",
      name: "Viral recipe everyone is trying",
      count: "1,988 people are Flitting about this"
    }
  ];
  
  // Generate user suggestions data (excluding the first user who is logged in)
  const suggestionsData = users.slice(1, 11).map(user => ({
    id: user.id,
    name: user.name,
    handle: user.handle,
    profilePic: user.profilePic,
    bio: user.bio
  }));
  const mockUser = {
    name: "John Doe",
    handle: "johndoe",
    profilePic: "profile.jpg",
    bannerImage: "lights.jpg",
    bio: "Web developer and coffee enthusiast.\nBuilding awesome experiences at Flitter.",
    location: "San Francisco, CA",
    website: "https://johndoe.com",
    joinDate: "January 2023",
    following: 843,
    followers: 1258,
    flitts: [
        { content: "This is a sample flitt content placeholder.", timestamp: "Just now" },
        { content: "Another flitt to test rendering.", timestamp: "2h ago" }
    ],
    replies: [
        { 
            content: "Great point about AI development!", 
            timestamp: "1h ago",
            originalFlitt: {
                author: "Jane Smith",
                authorPic: "lights.jpg",
                content: "Excited about the latest AI breakthroughs!"
            }
        },
        { 
            content: "Totally agree with your perspective.", 
            timestamp: "3h ago",
            originalFlitt: {
                author: "Tech Insider",
                authorPic: "lights.jpg",
                content: "Machine learning is changing everything we know about technology."
            }
        }
    ],
    media: [
        { 
            url: "lights.jpg", 
            description: "Coding setup", 
            timestamp: "1 day ago" 
        },
        { 
            url: "portrait.jpg", 
            description: "Coffee break", 
            timestamp: "2 days ago" 
        },
        { 
            url: "boys.jpg", 
            description: "Weekend project", 
            timestamp: "3 days ago" 
        }
    ],
    likes: [
        {
            author: "Tech Guru",
            handle: "techguru",
            authorPic: "profile.jpg",
            content: "Just launched my latest open-source project!",
            timestamp: "4h ago"
        },
        {
            author: "Innovation Weekly",
            handle: "innovationweekly",
            authorPic: "profile.jpg",
            content: "Top 10 tech trends to watch in 2025",
            timestamp: "1 day ago"
        }
    ]
};
const mockBookmarks = [
    {
        id: 1,
        author: 'Jane Smith',
        handle: 'janesmith',
        authorPic: 'lights.jpg',
        content: 'Just finished an amazing project at work! Can\'t wait to share more details soon. Hard work really pays off. 💪🏼 #WorkLife #Success',
        timestamp: '2h ago',
        likes: 35,
        replies: 4
    },
    {
        id: 2,
        author: 'Tech Insider',
        handle: 'techinsider',
        authorPic: 'boys.jpg',
        content: 'Breaking: New AI developments set to revolutionize multiple industries. The future is now! 🚀 #Technology #Innovation',
        timestamp: '5h ago',
        likes: 98,
        replies: 12
    }
];


// Mock trends data
const trends = [
    { category: "Technology · Trending", name: "#AI", count: "120K Tweets" },
    { category: "Sports · Trending", name: "#IPL2025", count: "85K Tweets" }
];

// Mock suggestions
const suggestions = [
    { name: "Jane Smith", handle: "janesmith", profilePic: "boys.jpg" },
    { name: "Alex Johnson", handle: "alexj", profilePic: "portrait.jpg" }
];
const mockTrends = [
    {
        category: 'Technology',
        name: '#AIRevolution',
        count: '54.3K'
    },
    {
        category: 'Sports',
        name: '#WorldCup',
        count: '342K'
    },
    {
        category: 'Entertainment',
        name: '#MovieNight',
        count: '22.1K'
    }
];

const mockFollowSuggestions = [
    {
        name: 'Tech Guru',
        handle: 'techguru',
        profilePic: 'boys.jpg'
    },
    {
        name: 'Design Master',
        handle: 'designmaster',
        profilePic: 'lights.jpg'
    },
    {
        name: 'Travel Blog',
        handle: 'travelblog',
        profilePic: 'portrait.jpg'
    }
];
  // Export all data
  module.exports = {
    userData,
    users,
    flittsData,
    trendsData,
    suggestionsData,
     mockUser, mockBookmarks, trends, suggestions, mockTrends, mockFollowSuggestions 
  };