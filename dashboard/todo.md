# Interview Preparation Platform - Development Plan

## Core Files to Create (8 files max)

1. **src/App.tsx** - Update routing for all pages
2. **src/pages/Index.tsx** - Dashboard home page with company and role selection
3. **src/pages/CompanyRounds.tsx** - Company interview rounds with questions
4. **src/pages/RolePreparation.tsx** - Role-based preparation content
5. **src/pages/Practice.tsx** - Coding questions with LeetCode links and company tags
6. **src/pages/StarPractice.tsx** - STAR method behavioral questions
7. **src/pages/MockInterview.tsx** - Mock interview simulator
8. **src/pages/Profile.tsx** - User profile and progress tracking

## Data Structure
- Companies with rounds (Aptitude, Coding, Technical, HR)
- Questions with answers and LeetCode links
- Roles with preparation content
- User progress tracking (localStorage)

## Features
- Interactive answer checking for aptitude questions
- Company tags/icons for coding questions
- STAR framework practice
- Mock interview with timer
- Progress tracking

## Implementation Order
1. Update App.tsx with routes
2. Create Index.tsx (dashboard home)
3. Create CompanyRounds.tsx (company selection + rounds)
4. Create RolePreparation.tsx (role-based content)
5. Create Practice.tsx (coding questions list)
6. Create StarPractice.tsx (behavioral questions)
7. Create MockInterview.tsx (interview simulator)
8. Create Profile.tsx (user stats)
9. Update index.html title
10. Run lint and build