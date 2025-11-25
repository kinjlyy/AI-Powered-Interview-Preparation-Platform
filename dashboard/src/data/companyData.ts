export interface AptitudeQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

export interface CodingQuestion {
  id: number;
  title: string;
  difficulty: string;
  link: string;
}

export interface CompanyRoundsData {
  aptitude: AptitudeQuestion[];
  coding: CodingQuestion[];
  technical: string[];
  hr: string[];
}

export interface Company {
  name: string;
  logo: string;
  rounds: CompanyRoundsData;
}

export const companyData: Record<string, Company> = {
  google: {
    name: 'Google',
    logo: '/images/Google.svg',
    rounds: {
      aptitude: [
        {
          id: 1,
          question: 'If a car travels 60 km in 1 hour, how far will it travel in 2.5 hours at the same speed?',
          options: ['120 km', '150 km', '180 km', '200 km'],
          correct: 1,
        },
        {
          id: 2,
          question: 'What is 15% of 200?',
          options: ['25', '30', '35', '40'],
          correct: 1,
        },
      ],
      coding: [
        {
          id: 1,
          title: 'Two Sum',
          difficulty: 'Easy',
          link: 'https://leetcode.com/problems/two-sum/',
        },
        {
          id: 2,
          title: 'Longest Substring Without Repeating Characters',
          difficulty: 'Medium',
          link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
        },
      ],
      technical: [
        'Explain the difference between HTTP and HTTPS',
        'What is the time complexity of binary search?',
        'Describe the concept of closures in JavaScript',
      ],
      hr: [
        'Tell me about yourself',
        'Why do you want to work at Google?',
        'Describe a challenging project you worked on',
      ],
    },
  },
  microsoft: {
    name: 'Microsoft',
    logo: '/images/Microsoft.jpg',
    rounds: {
      aptitude: [
        {
          id: 1,
          question: 'A train travels at 80 km/h. How long will it take to cover 240 km?',
          options: ['2 hours', '3 hours', '4 hours', '5 hours'],
          correct: 1,
        },
      ],
      coding: [
        {
          id: 1,
          title: 'Reverse Linked List',
          difficulty: 'Easy',
          link: 'https://leetcode.com/problems/reverse-linked-list/',
        },
        {
          id: 2,
          title: 'Merge Intervals',
          difficulty: 'Medium',
          link: 'https://leetcode.com/problems/merge-intervals/',
        },
      ],
      technical: [
        'Explain the SOLID principles',
        'What is dependency injection?',
        'Describe the difference between SQL and NoSQL databases',
      ],
      hr: [
        'What are your strengths and weaknesses?',
        'Where do you see yourself in 5 years?',
        'How do you handle conflicts in a team?',
      ],
    },
  },
  amazon: {
    name: 'Amazon',
    logo: '/images/Amazon.jpg',
    rounds: {
      aptitude: [
        { id: 1, question: 'If a book costs $12 and you buy 5, what is the total cost?', options: ['$60', '$50', '$72', '$48'], correct: 0 },
        { id: 2, question: 'What is 20% of 250?', options: ['40', '50', '60', '45'], correct: 1 },
      ],
      coding: [
        { id: 1, title: 'Kth Largest Element', difficulty: 'Medium', link: 'https://leetcode.com/problems/kth-largest-element-in-an-array/' },
        { id: 2, title: 'Product of Array Except Self', difficulty: 'Medium', link: 'https://leetcode.com/problems/product-of-array-except-self/' },
      ],
      technical: [
        'Explain eventual consistency in distributed systems',
        'How does AWS S3 ensure durability of data?',
        'Describe CAP theorem',
      ],
      hr: [
        'Tell me about a time you worked under pressure',
        'How do you prioritize tasks?',
        'What are your salary expectations?',
      ],
    },
  },
  meta: {
    name: 'Meta',
    logo: '/images/Meta.jpg',
    rounds: {
      aptitude: [
        { id: 1, question: 'If a dataset has 200 elements, what is 10% of it?', options: ['10', '20', '25', '40'], correct: 1 },
      ],
      coding: [
        { id: 1, title: 'Design a News Feed algorithm (system design)', difficulty: 'Hard', link: 'https://leetcode.com/problems/implement-trie-prefix-tree/' },
      ],
      technical: [
        'Explain the difference between GraphQL and REST',
        'What is the event loop in JavaScript?',
      ],
      hr: [
        'Why do you want to join Meta?',
        'How do you approach cross-team collaboration?',
      ],
    },
  },
  apple: {
    name: 'Apple',
    logo: '/images/Apple.jpg',
    rounds: {
      aptitude: [
        { id: 1, question: 'If an iPhone battery lasts 10 hours and you use it for 3 hours, how many hours remain?', options: ['7', '6', '8', '5'], correct: 0 },
      ],
      coding: [
        { id: 1, title: 'Design an efficient cache system', difficulty: 'Medium', link: 'https://leetcode.com/problems/lru-cache/' },
      ],
      technical: [
        'How does the MVC pattern differ from MVVM?',
        'Explain memory management in iOS',
      ],
      hr: [
        'Describe a time you showed ownership',
        'What is your approach to design decisions?',
      ],
    },
  },
  netflix: {
    name: 'Netflix',
    logo: '/images/Netflix.jpg',
    rounds: {
      aptitude: [
        { id: 1, question: 'If a movie is 2 hours long and starts at 8 PM, when does it end?', options: ['10 PM', '9 PM', '10:30 PM', '11 PM'], correct: 0 },
      ],
      coding: [
        { id: 1, title: 'Design a recommendation system', difficulty: 'Hard', link: 'https://leetcode.com/problems/design-search-autocomplete-system/' },
      ],
      technical: [
        'Explain how CDN improves content delivery',
        'Describe how you would design a scalable video streaming service',
      ],
      hr: [
        'How do you ensure continuous learning within a team?',
        'Tell me about a time you received critical feedback',
      ],
    },
  },
};

export default companyData;
