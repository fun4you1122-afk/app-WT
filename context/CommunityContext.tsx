import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PollOption {
  text: string;
  votes: number;
}

export interface Poll {
  question: string;
  options: PollOption[];
  totalVotes: number;
}

export interface Discussion {
  id: string;
  author: string;
  initials: string;
  avatarColor: string;
  time: string;
  category: string;
  title: string;
  preview: string;
  likes: number;
  comments: number;
  sentiment: { pos: number; neu: number; neg: number };
  isPoll: boolean;
  poll?: Poll;
}

interface CommunityContextType {
  posts: Discussion[];
  likedIds: Set<string>;
  bookmarkedIds: Set<string>;
  pollVotes: Record<string, number>;
  addPost: (post: Discussion) => void;
  toggleLike: (id: string) => void;
  toggleBookmark: (id: string) => void;
  castVote: (postId: string, optionIndex: number) => void;
}

// ─── Seed data ────────────────────────────────────────────────────────────────

const SEED_POSTS: Discussion[] = [
  {
    id: '1',
    author: 'Sarah Al-Rashid',
    initials: 'SR',
    avatarColor: '#7C3AED',
    time: '2h ago',
    category: 'AI',
    title: 'Is AI replacing human creativity or enhancing it?',
    preview:
      'The debate around AI-generated content has intensified. While tools like GPT-4 and Midjourney produce impressive outputs, many argue that true creativity still requires human emotion and lived experience...',
    likes: 234,
    comments: 89,
    sentiment: { pos: 45, neu: 30, neg: 25 },
    isPoll: false,
  },
  {
    id: '2',
    author: 'Mohammed Al-Farsi',
    initials: 'MF',
    avatarColor: '#0055FF',
    time: '4h ago',
    category: 'UAE',
    title: 'Poll: Should UAE mandate AI literacy in schools?',
    preview: '',
    likes: 567,
    comments: 143,
    sentiment: { pos: 70, neu: 20, neg: 10 },
    isPoll: true,
    poll: {
      question: 'Should UAE mandate AI literacy from Grade 1?',
      options: [
        { text: 'Yes, immediately', votes: 1240 },
        { text: 'Yes, from Grade 6', votes: 876 },
        { text: 'Optional only', votes: 432 },
        { text: 'No', votes: 198 },
      ],
      totalVotes: 2746,
    },
  },
  {
    id: '3',
    author: 'Priya Sharma',
    initials: 'PS',
    avatarColor: '#059669',
    time: '6h ago',
    category: 'Business',
    title: "How WeThink's AI is transforming UAE banking",
    preview:
      "Having implemented WeThink's fraud detection at three major UAE banks, I can confirm the numbers are real. The system catches 94% of fraudulent transactions in real-time, saving millions daily...",
    likes: 412,
    comments: 67,
    sentiment: { pos: 80, neu: 15, neg: 5 },
    isPoll: false,
  },
  {
    id: '4',
    author: 'James Chen',
    initials: 'JC',
    avatarColor: '#D97706',
    time: '1d ago',
    category: 'Tech',
    title: 'The case for and against autonomous vehicles in Gulf cities',
    preview:
      "Dubai's Roads and Transport Authority recently approved a pilot for fully autonomous taxis. Supporters cite efficiency gains; critics worry about job displacement for 50,000+ drivers...",
    likes: 189,
    comments: 234,
    sentiment: { pos: 35, neu: 40, neg: 25 },
    isPoll: false,
  },
];

// ─── AsyncStorage keys ────────────────────────────────────────────────────────

const KEYS = {
  posts: '@wethink_posts',
  liked: '@wethink_liked',
  bookmarked: '@wethink_bookmarked',
  votes: '@wethink_votes',
};

// ─── Context ──────────────────────────────────────────────────────────────────

const CommunityContext = createContext<CommunityContextType>({
  posts: SEED_POSTS,
  likedIds: new Set(),
  bookmarkedIds: new Set(),
  pollVotes: {},
  addPost: () => {},
  toggleLike: () => {},
  toggleBookmark: () => {},
  castVote: () => {},
});

export function CommunityProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Discussion[]>(SEED_POSTS);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [pollVotes, setPollVotes] = useState<Record<string, number>>({});

  // Load persisted state once on mount
  useEffect(() => {
    (async () => {
      const [storedPosts, storedLiked, storedBookmarked, storedVotes] = await Promise.all([
        AsyncStorage.getItem(KEYS.posts),
        AsyncStorage.getItem(KEYS.liked),
        AsyncStorage.getItem(KEYS.bookmarked),
        AsyncStorage.getItem(KEYS.votes),
      ]);

      if (storedPosts) {
        try {
          const userPosts: Discussion[] = JSON.parse(storedPosts);
          // Prepend user posts to seed data; avoid duplicates by id
          const seedIds = new Set(SEED_POSTS.map(p => p.id));
          const newOnly = userPosts.filter(p => !seedIds.has(p.id));
          setPosts([...newOnly, ...SEED_POSTS]);
        } catch (_) {}
      }
      if (storedLiked) {
        try { setLikedIds(new Set(JSON.parse(storedLiked))); } catch (_) {}
      }
      if (storedBookmarked) {
        try { setBookmarkedIds(new Set(JSON.parse(storedBookmarked))); } catch (_) {}
      }
      if (storedVotes) {
        try { setPollVotes(JSON.parse(storedVotes)); } catch (_) {}
      }
    })();
  }, []);

  const addPost = useCallback((post: Discussion) => {
    setPosts(prev => {
      const next = [post, ...prev];
      // Persist only user-created posts (non-seed)
      const seedIds = new Set(SEED_POSTS.map(p => p.id));
      const userPosts = next.filter(p => !seedIds.has(p.id));
      AsyncStorage.setItem(KEYS.posts, JSON.stringify(userPosts));
      return next;
    });
  }, []);

  const toggleLike = useCallback((id: string) => {
    setLikedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      AsyncStorage.setItem(KEYS.liked, JSON.stringify([...next]));
      return next;
    });
  }, []);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarkedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      AsyncStorage.setItem(KEYS.bookmarked, JSON.stringify([...next]));
      return next;
    });
  }, []);

  const castVote = useCallback((postId: string, optionIndex: number) => {
    setPollVotes(prev => {
      const next = { ...prev, [postId]: optionIndex };
      AsyncStorage.setItem(KEYS.votes, JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <CommunityContext.Provider value={{ posts, likedIds, bookmarkedIds, pollVotes, addPost, toggleLike, toggleBookmark, castVote }}>
      {children}
    </CommunityContext.Provider>
  );
}

export const AI_SUMMARIES: Record<string, string[]> = {
  '1': [
    'The debate centers on whether AI tools augment or replace human creativity.',
    '55% of respondents believe AI enhances rather than replaces creative work.',
    'Key concern: economic impact on creative professionals over the next decade.',
    'Consensus: human emotional depth remains irreplaceable in artistic expression.',
  ],
  '2': [
    '88% of UAE educators support some form of mandatory AI literacy curriculum.',
    'Grade 6 introduction is preferred by most education policy experts.',
    'Current pilot programs in 12 Dubai schools show measurable skill improvements.',
    'Opposition cites infrastructure readiness in rural and northern emirates.',
  ],
  '3': [
    "WeThink's fraud detection system achieved 94% accuracy across 3 UAE banks.",
    'Real-time processing reduced false positives by 67% vs. legacy systems.',
    'Estimated AED 340M saved in fraudulent transactions in Q1 alone.',
    'Full rollout to 8 additional banks planned for H2 2026.',
  ],
  '4': [
    'RTA approved a 6-month autonomous taxi pilot in Downtown Dubai and DIFC.',
    'Current fleet of 50,000+ ride-hail drivers face medium-term displacement risk.',
    'Economic modelling shows net positive job creation in AV maintenance and ops.',
    'Public sentiment: 35% positive, split evenly between safety and efficiency concerns.',
  ],
};

export const useCommunity = () => useContext(CommunityContext);
