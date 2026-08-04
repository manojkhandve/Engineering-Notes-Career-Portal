// dsaData.js — Central data store for all DSA topics & questions

export const DSA_TOPICS = [
  {
    id: "arrays",
    title: "Arrays",
    icon: "▦",
    color: "blue",
    days: [
      {
        day: "Day 1 · Arrays (Part 1)",
        questions: [
          { id: "a1", name: "Two Sum", link: "https://leetcode.com/problems/two-sum/", level: "Easy", youtube: "https://www.youtube.com/watch?v=KLlXCFG5TnA", companies: ["Google", "Amazon"] },
          { id: "a2", name: "Best Time to Buy and Sell Stock", link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", level: "Easy", youtube: "https://www.youtube.com/watch?v=1pkOgXD63yU", companies: ["Amazon", "Facebook"] },
          { id: "a3", name: "Contains Duplicate", link: "https://leetcode.com/problems/contains-duplicate/", level: "Easy", youtube: "https://www.youtube.com/watch?v=3OamzN90kPg", companies: ["Amazon"] },
          { id: "a4", name: "Maximum Subarray", link: "https://leetcode.com/problems/maximum-subarray/", level: "Medium", youtube: "https://www.youtube.com/watch?v=5WZl3MMT0Eg", companies: ["Apple", "Adobe"] },
        ],
      },
      {
        day: "Day 2 · Arrays (Part 2)",
        questions: [
          { id: "a5", name: "Product of Array Except Self", link: "https://leetcode.com/problems/product-of-array-except-self/", level: "Medium", youtube: "https://www.youtube.com/watch?v=bNvIQI2wAjk", companies: ["Google", "Microsoft"] },
          { id: "a6", name: "Find Minimum in Rotated Sorted Array", link: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/", level: "Medium", youtube: "https://www.youtube.com/watch?v=nIVW4P8b1VA", companies: ["Microsoft"] },
          { id: "a7", name: "Search in Rotated Sorted Array", link: "https://leetcode.com/problems/search-in-rotated-sorted-array/", level: "Medium", youtube: "https://www.youtube.com/watch?v=U8XENwh8Oy8", companies: ["Facebook", "Uber"] },
          { id: "a8", name: "Median of Two Sorted Arrays", link: "https://leetcode.com/problems/median-of-two-sorted-arrays/", level: "Hard", youtube: "https://www.youtube.com/watch?v=q6IEA26hvXc", companies: ["Google", "Amazon"] },
        ],
      },
    ],
  },
  {
    id: "strings",
    title: "Strings",
    icon: "≈",
    color: "purple",
    days: [
      {
        day: "Day 3 · Strings (Part 1)",
        questions: [
          { id: "s1", name: "Valid Palindrome", link: "https://leetcode.com/problems/valid-palindrome/", level: "Easy", youtube: "https://www.youtube.com/watch?v=jJXJ16kPFWg", companies: ["Facebook", "Apple"] },
          { id: "s2", name: "Longest Substring Without Repeating Characters", link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", level: "Medium", youtube: "https://www.youtube.com/watch?v=wiGpQwVHdE0", companies: ["Amazon", "Adobe"] },
          { id: "s3", name: "Longest Palindromic Substring", link: "https://leetcode.com/problems/longest-palindromic-substring/", level: "Medium", youtube: "https://www.youtube.com/watch?v=y2BD4MJqV20", companies: ["Amazon", "Microsoft"] },
        ],
      },
      {
        day: "Day 4 · Strings (Part 2)",
        questions: [
          { id: "s4", name: "Group Anagrams", link: "https://leetcode.com/problems/group-anagrams/", level: "Medium", youtube: "https://www.youtube.com/watch?v=vzdNOK2oB2E", companies: ["Amazon", "Uber"] },
          { id: "s5", name: "Valid Anagram", link: "https://leetcode.com/problems/valid-anagram/", level: "Easy", youtube: "https://www.youtube.com/watch?v=9UtInBqnCgA", companies: ["Amazon"] },
          { id: "s6", name: "Minimum Window Substring", link: "https://leetcode.com/problems/minimum-window-substring/", level: "Hard", youtube: "https://www.youtube.com/watch?v=jSto0O4AJbM", companies: ["Facebook", "LinkedIn"] },
        ],
      },
    ],
  },
  {
    id: "linkedlist",
    title: "Linked List",
    icon: "⇢",
    color: "green",
    days: [
      {
        day: "Day 5 · Linked List (Part 1)",
        questions: [
          { id: "l1", name: "Reverse Linked List", link: "https://leetcode.com/problems/reverse-linked-list/", level: "Easy", youtube: "https://www.youtube.com/watch?v=G0_I-ZF0S38", companies: ["Amazon", "Apple"] },
          { id: "l2", name: "Merge Two Sorted Lists", link: "https://leetcode.com/problems/merge-two-sorted-lists/", level: "Easy", youtube: "https://www.youtube.com/watch?v=XIdigk956u0", companies: ["Amazon", "Microsoft"] },
          { id: "l3", name: "Linked List Cycle", link: "https://leetcode.com/problems/linked-list-cycle/", level: "Easy", youtube: "https://www.youtube.com/watch?v=gBTe7lFR3vc", companies: ["Amazon", "Bloomberg"] },
          { id: "l4", name: "Remove Nth Node From End", link: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/", level: "Medium", youtube: "https://www.youtube.com/watch?v=XVuQxVej6y8", companies: ["Facebook", "Google"] },
        ],
      },
    ],
  },
  {
    id: "trees",
    title: "Trees",
    icon: "⌥",
    color: "amber",
    days: [
      {
        day: "Day 6 · Binary Trees (Part 1)",
        questions: [
          { id: "t1", name: "Maximum Depth of Binary Tree", link: "https://leetcode.com/problems/maximum-depth-of-binary-tree/", level: "Easy", youtube: "https://www.youtube.com/watch?v=hTM3phVI6YQ", companies: ["LinkedIn", "Apple"] },
          { id: "t2", name: "Same Tree", link: "https://leetcode.com/problems/same-tree/", level: "Easy", youtube: "https://www.youtube.com/watch?v=vRbbcKXCxOw", companies: ["Bloomberg"] },
          { id: "t3", name: "Invert Binary Tree", link: "https://leetcode.com/problems/invert-binary-tree/", level: "Easy", youtube: "https://www.youtube.com/watch?v=OnSn2XEQ4MY", companies: ["Google", "Uber"] },
          { id: "t4", name: "Binary Tree Level Order Traversal", link: "https://leetcode.com/problems/binary-tree-level-order-traversal/", level: "Medium", youtube: "https://www.youtube.com/watch?v=6ZnyEApgFYg", companies: ["Amazon", "Facebook"] },
        ],
      },
    ],
  },
  {
    id: "dp",
    title: "Dynamic Programming",
    icon: "◈",
    color: "rose",
    days: [
      {
        day: "Day 7 · DP (Part 1)",
        questions: [
          { id: "d1", name: "Climbing Stairs", link: "https://leetcode.com/problems/climbing-stairs/", level: "Easy", youtube: "https://www.youtube.com/watch?v=Y0lT9Fck7qI", companies: ["Amazon", "Apple"] },
          { id: "d2", name: "House Robber", link: "https://leetcode.com/problems/house-robber/", level: "Medium", youtube: "https://www.youtube.com/watch?v=73r3KWiEvyk", companies: ["Airbnb", "Amazon"] },
          { id: "d3", name: "Coin Change", link: "https://leetcode.com/problems/coin-change/", level: "Medium", youtube: "https://www.youtube.com/watch?v=H9bfqozjoqs", companies: ["Amazon", "Microsoft"] },
          { id: "d4", name: "Longest Increasing Subsequence", link: "https://leetcode.com/problems/longest-increasing-subsequence/", level: "Medium", youtube: "https://www.youtube.com/watch?v=cjWnW0hdF1Y", companies: ["Microsoft", "Google"] },
          { id: "d5", name: "Edit Distance", link: "https://leetcode.com/problems/edit-distance/", level: "Hard", youtube: "https://www.youtube.com/watch?v=XYi2-LPrwm4", companies: ["Google", "Uber"] },
        ],
      },
    ],
  },
  {
    id: "graphs",
    title: "Graphs",
    icon: "◎",
    color: "cyan",
    days: [
      {
        day: "Day 8 · Graphs (Part 1)",
        questions: [
          { id: "g1", name: "Number of Islands", link: "https://leetcode.com/problems/number-of-islands/", level: "Medium", youtube: "https://www.youtube.com/watch?v=pV2kpPD66nE", companies: ["Amazon", "Google", "Facebook"] },
          { id: "g2", name: "Clone Graph", link: "https://leetcode.com/problems/clone-graph/", level: "Medium", youtube: "https://www.youtube.com/watch?v=mQeF6bN8hMk", companies: ["Facebook", "Amazon"] },
          { id: "g3", name: "Course Schedule", link: "https://leetcode.com/problems/course-schedule/", level: "Medium", youtube: "https://www.youtube.com/watch?v=EgI5nU9etnU", companies: ["Amazon", "Uber"] },
          { id: "g4", name: "Word Ladder", link: "https://leetcode.com/problems/word-ladder/", level: "Hard", youtube: "https://www.youtube.com/watch?v=h9iTnkgv05E", companies: ["Amazon", "LinkedIn"] },
        ],
      },
    ],
  },
];

export const getAllQuestions = () =>
  DSA_TOPICS.flatMap(topic =>
    topic.days.flatMap(day =>
      day.questions.map(q => ({ ...q, topic: topic.id, topicTitle: topic.title }))
    )
  );

export const TOTAL_COUNTS = {
  Easy:   DSA_TOPICS.flatMap(t => t.days.flatMap(d => d.questions)).filter(q => q.level === "Easy").length,
  Medium: DSA_TOPICS.flatMap(t => t.days.flatMap(d => d.questions)).filter(q => q.level === "Medium").length,
  Hard:   DSA_TOPICS.flatMap(t => t.days.flatMap(d => d.questions)).filter(q => q.level === "Hard").length,
};
