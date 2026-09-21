import { SentenceItem } from '@/types/typing';

export const RAW_SENTENCES: Omit<SentenceItem, 'charCount' | 'wordCount'>[] = [
  // ==========================================
  // 1. EVERYDAY CONVERSATION (16 sentences)
  // ==========================================
  // Beginner
  { id: 'conv-b-1', text: 'I drink a cup of warm tea every morning.', category: 'conversation', difficulty: 'beginner' },
  { id: 'conv-b-2', text: 'Please remember to lock the front door.', category: 'conversation', difficulty: 'beginner' },
  { id: 'conv-b-3', text: 'We are planning to eat lunch together.', category: 'conversation', difficulty: 'beginner' },
  { id: 'conv-b-4', text: 'The weather is very sunny and pleasant today.', category: 'conversation', difficulty: 'beginner' },
  { id: 'conv-b-5', text: 'I hope you have a wonderful weekend.', category: 'conversation', difficulty: 'beginner' },
  { id: 'conv-b-6', text: 'Can you call me when you get home?', category: 'conversation', difficulty: 'beginner' },
  // Intermediate
  { id: 'conv-i-1', text: 'I was thinking about going for a run, but it looks like rain outside.', category: 'conversation', difficulty: 'intermediate' },
  { id: 'conv-i-2', text: 'Let me know if you would like to grab dinner after work this evening.', category: 'conversation', difficulty: 'intermediate' },
  { id: 'conv-i-3', text: 'We had a great conversation about our favorite books during the coffee break.', category: 'conversation', difficulty: 'intermediate' },
  { id: 'conv-i-4', text: 'It took me longer than expected to find parking near the community center.', category: 'conversation', difficulty: 'intermediate' },
  { id: 'conv-i-5', text: 'My friend recommended a quiet cafe downtown where we can sit and talk.', category: 'conversation', difficulty: 'intermediate' },
  // Advanced
  { id: 'conv-a-1', text: 'If you are free this Saturday around 6:30 PM, we could try that new Italian restaurant downtown.', category: 'conversation', difficulty: 'advanced' },
  { id: 'conv-a-2', text: 'She mentioned that her flight arrives at terminal 3 by 9:45 AM, so we should leave early.', category: 'conversation', difficulty: 'advanced' },
  { id: 'conv-a-3', text: 'I haven\'t seen Marcus since our college reunion in 2022, but we still chat online regularly.', category: 'conversation', difficulty: 'advanced' },
  { id: 'conv-a-4', text: 'Although the traffic was backed up for 45 minutes, we still arrived before the movie began.', category: 'conversation', difficulty: 'advanced' },
  { id: 'conv-a-5', text: 'Do you prefer meeting on Thursday at 2:00 PM, or would Friday morning work better for your schedule?', category: 'conversation', difficulty: 'advanced' },

  // ==========================================
  // 2. WORKPLACE COMMUNICATION (16 sentences)
  // ==========================================
  // Beginner
  { id: 'work-b-1', text: 'The team will meet in conference room B.', category: 'workplace', difficulty: 'beginner' },
  { id: 'work-b-2', text: 'Please send me the notes from the meeting.', category: 'workplace', difficulty: 'beginner' },
  { id: 'work-b-3', text: 'Our supervisor approved the new proposal.', category: 'workplace', difficulty: 'beginner' },
  { id: 'work-b-4', text: 'I will finish my task before the end of the day.', category: 'workplace', difficulty: 'beginner' },
  { id: 'work-b-5', text: 'We need to review the project guidelines.', category: 'workplace', difficulty: 'beginner' },
  { id: 'work-b-6', text: 'Everyone worked together to solve the issue.', category: 'workplace', difficulty: 'beginner' },
  // Intermediate
  { id: 'work-i-1', text: 'Please make sure all team members have access to the shared project repository.', category: 'workplace', difficulty: 'intermediate' },
  { id: 'work-i-2', text: 'We should schedule a brief follow-up discussion to address any remaining questions.', category: 'workplace', difficulty: 'intermediate' },
  { id: 'work-i-3', text: 'The client requested several adjustments to the design layout before final approval.', category: 'workplace', difficulty: 'intermediate' },
  { id: 'work-i-4', text: 'Our weekly sprint planning session will begin immediately after the standup.', category: 'workplace', difficulty: 'intermediate' },
  { id: 'work-i-5', text: 'Cross-functional collaboration helped us deliver the feature ahead of schedule.', category: 'workplace', difficulty: 'intermediate' },
  // Advanced
  { id: 'work-a-1', text: 'According to the Q3 performance report, our team exceeded the initial target by 14.5%.', category: 'workplace', difficulty: 'advanced' },
  { id: 'work-a-2', text: 'Please submit your quarterly expense receipts to the finance department by Friday at 5:00 PM.', category: 'workplace', difficulty: 'advanced' },
  { id: 'work-a-3', text: 'The stakeholders agreed to extend milestone 2 until November 18 to ensure high product quality.', category: 'workplace', difficulty: 'advanced' },
  { id: 'work-a-4', text: 'During the board meeting, we reviewed 4 strategic initiatives aimed at expanding market share.', category: 'workplace', difficulty: 'advanced' },
  { id: 'work-a-5', text: 'All department heads must sign off on the 2027 fiscal budget proposal before next Wednesday.', category: 'workplace', difficulty: 'advanced' },

  // ==========================================
  // 3. EMAILS & PROFESSIONAL WRITING (16 sentences)
  // ==========================================
  // Beginner
  { id: 'email-b-1', text: 'Thank you for your quick response.', category: 'emails', difficulty: 'beginner' },
  { id: 'email-b-2', text: 'Please find the attached invoice.', category: 'emails', difficulty: 'beginner' },
  { id: 'email-b-3', text: 'Let me know if you need more details.', category: 'emails', difficulty: 'beginner' },
  { id: 'email-b-4', text: 'I am writing to confirm our appointment.', category: 'emails', difficulty: 'beginner' },
  { id: 'email-b-5', text: 'We look forward to hearing from you soon.', category: 'emails', difficulty: 'beginner' },
  { id: 'email-b-6', text: 'Best regards to you and your team.', category: 'emails', difficulty: 'beginner' },
  // Intermediate
  { id: 'email-i-1', text: 'I appreciate your patience while we investigated the technical matter with our engineers.', category: 'emails', difficulty: 'intermediate' },
  { id: 'email-i-2', text: 'Could you please confirm whether you are available for a 30-minute introductory call?', category: 'emails', difficulty: 'intermediate' },
  { id: 'email-i-3', text: 'Attached you will find the revised proposal reflecting the changes we discussed yesterday.', category: 'emails', difficulty: 'intermediate' },
  { id: 'email-i-4', text: 'Please review the attached contract and return a signed copy at your earliest convenience.', category: 'emails', difficulty: 'intermediate' },
  { id: 'email-i-5', text: 'I would be happy to provide additional references or documentation upon your request.', category: 'emails', difficulty: 'intermediate' },
  // Advanced
  { id: 'email-a-1', text: 'Dear Mr. Harrison, as per our conversation on October 12, here is the updated contract (v2.4).', category: 'emails', difficulty: 'advanced' },
  { id: 'email-a-2', text: 'Please review invoice #84920 for $3,450.00 and notify our billing department of any discrepancies.', category: 'emails', difficulty: 'advanced' },
  { id: 'email-a-3', text: 'Thank you for contacting customer support; your reference ticket is #US-9821, opened on March 4.', category: 'emails', difficulty: 'advanced' },
  { id: 'email-a-4', text: 'We would like to invite you to our annual technology summit held at the Grand Plaza, Room 402.', category: 'emails', difficulty: 'advanced' },
  { id: 'email-a-5', text: 'Kindly submit all requested onboarding forms by 11:59 PM EST to avoid any processing delays.', category: 'emails', difficulty: 'advanced' },

  // ==========================================
  // 4. EDUCATION & LEARNING (16 sentences)
  // ==========================================
  // Beginner
  { id: 'edu-b-1', text: 'Reading books helps expand your vocabulary.', category: 'education', difficulty: 'beginner' },
  { id: 'edu-b-2', text: 'She studies mathematics for two hours.', category: 'education', difficulty: 'beginner' },
  { id: 'edu-b-3', text: 'The teacher explained the lesson clearly.', category: 'education', difficulty: 'beginner' },
  { id: 'edu-b-4', text: 'Practice every day to improve your skills.', category: 'education', difficulty: 'beginner' },
  { id: 'edu-b-5', text: 'Curiosity is the key to deep learning.', category: 'education', difficulty: 'beginner' },
  { id: 'edu-b-6', text: 'He wrote an essay about clean energy.', category: 'education', difficulty: 'beginner' },
  // Intermediate
  { id: 'edu-i-1', text: 'Consistent daily practice is significantly more effective than cramming before an exam.', category: 'education', difficulty: 'intermediate' },
  { id: 'edu-i-2', text: 'The university library offers extensive digital archives for student research projects.', category: 'education', difficulty: 'intermediate' },
  { id: 'edu-i-3', text: 'Understanding foundational principles makes it much easier to master advanced concepts.', category: 'education', difficulty: 'intermediate' },
  { id: 'edu-i-4', text: 'Active recall and spaced repetition are proven techniques for long-term memory retention.', category: 'education', difficulty: 'intermediate' },
  { id: 'edu-i-5', text: 'Students who ask questions during lectures tend to develop stronger analytical thinking skills.', category: 'education', difficulty: 'intermediate' },
  // Advanced
  { id: 'edu-a-1', text: 'In 1905, Albert Einstein published 4 groundbreaking papers that changed the foundation of physics.', category: 'education', difficulty: 'advanced' },
  { id: 'edu-a-2', text: 'The course syllabus includes 12 modules, 3 midterm quizzes, and a final capstone project worth 40%.', category: 'education', difficulty: 'advanced' },
  { id: 'edu-a-3', text: 'According to cognitive psychologists, taking handwritten notes improves conceptual recall by 25%.', category: 'education', difficulty: 'advanced' },
  { id: 'edu-a-4', text: 'The biology laboratory session will take place on Tuesdays from 1:30 PM to 4:30 PM in Hall 7.', category: 'education', difficulty: 'advanced' },
  { id: 'edu-a-5', text: 'Students scoring above 85% on the preliminary assessment qualify for the advanced scholarship fund.', category: 'education', difficulty: 'advanced' },

  // ==========================================
  // 5. TECHNOLOGY (16 sentences)
  // ==========================================
  // Beginner
  { id: 'tech-b-1', text: 'The browser updated to the latest version.', category: 'technology', difficulty: 'beginner' },
  { id: 'tech-b-2', text: 'Cloud storage keeps your files safe.', category: 'technology', difficulty: 'beginner' },
  { id: 'tech-b-3', text: 'She writes code using modern tools.', category: 'technology', difficulty: 'beginner' },
  { id: 'tech-b-4', text: 'Touch typing helps you work faster.', category: 'technology', difficulty: 'beginner' },
  { id: 'tech-b-5', text: 'The server is running without any errors.', category: 'technology', difficulty: 'beginner' },
  { id: 'tech-b-6', text: 'Always use strong and unique passwords.', category: 'technology', difficulty: 'beginner' },
  // Intermediate
  { id: 'tech-i-1', text: 'Modern web applications rely on responsive designs that work smoothly across all screen sizes.', category: 'technology', difficulty: 'intermediate' },
  { id: 'tech-i-2', text: 'Implementing automated testing ensures that software updates do not break existing features.', category: 'technology', difficulty: 'intermediate' },
  { id: 'tech-i-3', text: 'Static site generation allows web pages to load almost instantaneously for end users.', category: 'technology', difficulty: 'intermediate' },
  { id: 'tech-i-4', text: 'Version control systems help engineering teams collaborate efficiently on complex codebases.', category: 'technology', difficulty: 'intermediate' },
  { id: 'tech-i-5', text: 'Accessible digital products ensure that everyone can interact with information effortlessly.', category: 'technology', difficulty: 'intermediate' },
  // Advanced
  { id: 'tech-a-1', text: 'The microservices architecture processed 1,250,000 requests per minute with 99.99% uptime.', category: 'technology', difficulty: 'advanced' },
  { id: 'tech-a-2', text: 'Upgrading the database cluster from PostgreSQL 14 to 16 reduced query response times by 38%.', category: 'technology', difficulty: 'advanced' },
  { id: 'tech-a-3', text: 'To enable two-factor authentication (2FA), scan the QR code using your authenticator app on mobile.', category: 'technology', difficulty: 'advanced' },
  { id: 'tech-a-4', text: 'The latest Wi-Fi 6 standard operates on both 2.4 GHz and 5 GHz frequency bands for higher throughput.', category: 'technology', difficulty: 'advanced' },
  { id: 'tech-a-5', text: 'React 18 introduced concurrent rendering capabilities, including startTransition and useDeferredValue.', category: 'technology', difficulty: 'advanced' },

  // ==========================================
  // 6. TRAVEL (16 sentences)
  // ==========================================
  // Beginner
  { id: 'trav-b-1', text: 'We packed our bags for the summer trip.', category: 'travel', difficulty: 'beginner' },
  { id: 'trav-b-2', text: 'The train arrives at the station soon.', category: 'travel', difficulty: 'beginner' },
  { id: 'trav-b-3', text: 'They visited a historic castle on the hill.', category: 'travel', difficulty: 'beginner' },
  { id: 'trav-b-4', text: 'Traveling opens your mind to new cultures.', category: 'travel', difficulty: 'beginner' },
  { id: 'trav-b-5', text: 'The ocean view from the room is beautiful.', category: 'travel', difficulty: 'beginner' },
  { id: 'trav-b-6', text: 'We took many photos during our vacation.', category: 'travel', difficulty: 'beginner' },
  // Intermediate
  { id: 'trav-i-1', text: 'Exploring local food markets is one of the best ways to experience a new city authentic culture.', category: 'travel', difficulty: 'intermediate' },
  { id: 'trav-i-2', text: 'We decided to rent a bicycle so we could navigate through the narrow cobblestone streets.', category: 'travel', difficulty: 'intermediate' },
  { id: 'trav-i-3', text: 'The mountain hiking trail offered breathtaking views of the valley below in early autumn.', category: 'travel', difficulty: 'intermediate' },
  { id: 'trav-i-4', text: 'Always double-check your passport expiration date before booking international flight tickets.', category: 'travel', difficulty: 'intermediate' },
  { id: 'trav-i-5', text: 'Taking the scenic coastal train route saved us money and provided unforgettable landscapes.', category: 'travel', difficulty: 'intermediate' },
  // Advanced
  { id: 'trav-a-1', text: 'Flight BA-294 to London Heathrow departs from Gate 18B at 21:15, with boarding starting 40 minutes prior.', category: 'travel', difficulty: 'advanced' },
  { id: 'trav-a-2', text: 'The hotel reservation confirmation number is #HTL-90432, covering 4 nights for a total of $780.00.', category: 'travel', difficulty: 'advanced' },
  { id: 'trav-a-3', text: 'After traveling across 6 countries in 28 days, we realized that light packing was our smartest decision.', category: 'travel', difficulty: 'advanced' },
  { id: 'trav-a-4', text: 'The high-speed rail connects Tokyo and Kyoto in approximately 2 hours and 15 minutes at 320 km/h.', category: 'travel', difficulty: 'advanced' },
  { id: 'trav-a-5', text: 'Please ensure your carry-on luggage does not exceed 55 x 40 x 20 cm or weigh more than 10 kg.', category: 'travel', difficulty: 'advanced' },

  // ==========================================
  // 7. SHOPPING (16 sentences)
  // ==========================================
  // Beginner
  { id: 'shop-b-1', text: 'She bought fresh apples at the market.', category: 'shopping', difficulty: 'beginner' },
  { id: 'shop-b-2', text: 'The grocery store opens at eight o\'clock.', category: 'shopping', difficulty: 'beginner' },
  { id: 'shop-b-3', text: 'I need to buy a pair of running shoes.', category: 'shopping', difficulty: 'beginner' },
  { id: 'shop-b-4', text: 'This jacket is both warm and comfortable.', category: 'shopping', difficulty: 'beginner' },
  { id: 'shop-b-5', text: 'We found a great discount on kitchen tools.', category: 'shopping', difficulty: 'beginner' },
  { id: 'shop-b-6', text: 'Always check the price tag before buying.', category: 'shopping', difficulty: 'beginner' },
  // Intermediate
  { id: 'shop-i-1', text: 'Comparing customer reviews online helps you find durable products at reasonable prices.', category: 'shopping', difficulty: 'intermediate' },
  { id: 'shop-i-2', text: 'The store offers free standard shipping on all orders that exceed fifty dollars.', category: 'shopping', difficulty: 'intermediate' },
  { id: 'shop-i-3', text: 'I prefer buying seasonal produce from local farmers because it tastes much fresher.', category: 'shopping', difficulty: 'intermediate' },
  { id: 'shop-i-4', text: 'Make sure to keep your digital receipt in case you need to exchange an item later.', category: 'shopping', difficulty: 'intermediate' },
  { id: 'shop-i-5', text: 'Creating a strict shopping list prevents impulse purchases and keeps your monthly budget intact.', category: 'shopping', difficulty: 'intermediate' },
  // Advanced
  { id: 'shop-a-1', text: 'The annual Black Friday promotion offers 35% off electronics, plus an extra $20 coupon on orders over $150.', category: 'shopping', difficulty: 'advanced' },
  { id: 'shop-a-2', text: 'Your order #ORD-77491 containing 3 items has shipped via express courier and will arrive by 3:00 PM.', category: 'shopping', difficulty: 'advanced' },
  { id: 'shop-a-3', text: 'We saved $142.50 by purchasing refurbished hardware with a certified 2-year manufacturer warranty.', category: 'shopping', difficulty: 'advanced' },
  { id: 'shop-a-4', text: 'Customers who enroll in the rewards club earn 5 points per $1.00 spent on all in-store purchases.', category: 'shopping', difficulty: 'advanced' },
  { id: 'shop-a-5', text: 'Items returned within 30 days of purchase in original packaging are eligible for a 100% full refund.', category: 'shopping', difficulty: 'advanced' },

  // ==========================================
  // 8. PERSONAL PRODUCTIVITY (16 sentences)
  // ==========================================
  // Beginner
  { id: 'prod-b-1', text: 'Set clear goals for your day each morning.', category: 'productivity', difficulty: 'beginner' },
  { id: 'prod-b-2', text: 'Taking short breaks keeps your mind sharp.', category: 'productivity', difficulty: 'beginner' },
  { id: 'prod-b-3', text: 'Organize your desk to stay focused on tasks.', category: 'productivity', difficulty: 'beginner' },
  { id: 'prod-b-4', text: 'Write down your ideas before you forget them.', category: 'productivity', difficulty: 'beginner' },
  { id: 'prod-b-5', text: 'Small daily habits lead to great results.', category: 'productivity', difficulty: 'beginner' },
  { id: 'prod-b-6', text: 'Focus on one important task at a time.', category: 'productivity', difficulty: 'beginner' },
  // Intermediate
  { id: 'prod-i-1', text: 'Time blocking allows you to dedicate uninterrupted focus to your most demanding priorities.', category: 'productivity', difficulty: 'intermediate' },
  { id: 'prod-i-2', text: 'Breaking down large projects into manageable steps reduces procrastination significantly.', category: 'productivity', difficulty: 'intermediate' },
  { id: 'prod-i-3', text: 'Silencing unnecessary notifications helps maintain deep concentration throughout the afternoon.', category: 'productivity', difficulty: 'intermediate' },
  { id: 'prod-i-4', text: 'A brief evening review helps you start the next workday with clarity and peace of mind.', category: 'productivity', difficulty: 'intermediate' },
  { id: 'prod-i-5', text: 'Establishing a consistent morning routine builds momentum that carries through your entire day.', category: 'productivity', difficulty: 'intermediate' },
  // Advanced
  { id: 'prod-a-1', text: 'Using the Pomodoro Technique (25 minutes of deep work followed by a 5-minute rest) boosts daily output.', category: 'productivity', difficulty: 'advanced' },
  { id: 'prod-a-2', text: 'By auditing his weekly schedule, David reclaimed 8.5 hours previously lost to unproductive meetings.', category: 'productivity', difficulty: 'advanced' },
  { id: 'prod-a-3', text: 'According to the 80/20 rule (Pareto principle), 20% of your focused efforts yield 80% of your meaningful outcomes.', category: 'productivity', difficulty: 'advanced' },
  { id: 'prod-a-4', text: 'Setting 3 high-impact objectives every Monday ensures steady progress toward 90-day strategic goals.', category: 'productivity', difficulty: 'advanced' },
  { id: 'prod-a-5', text: 'Improving your typing speed from 20 WPM to 60 WPM saves approximately 21 working days per calendar year.', category: 'productivity', difficulty: 'advanced' },

  // ==========================================
  // 9. GENERAL KNOWLEDGE (16 sentences)
  // ==========================================
  // Beginner
  { id: 'gen-b-1', text: 'Water boils at one hundred degrees Celsius.', category: 'general', difficulty: 'beginner' },
  { id: 'gen-b-2', text: 'The sun rises in the east every day.', category: 'general', difficulty: 'beginner' },
  { id: 'gen-b-3', text: 'Trees produce oxygen through photosynthesis.', category: 'general', difficulty: 'beginner' },
  { id: 'gen-b-4', text: 'The Pacific Ocean is the largest on Earth.', category: 'general', difficulty: 'beginner' },
  { id: 'gen-b-5', text: 'Honey bees play a vital role in nature.', category: 'general', difficulty: 'beginner' },
  { id: 'gen-b-6', text: 'A standard leap year has 366 days.', category: 'general', difficulty: 'beginner' },
  // Intermediate
  { id: 'gen-i-1', text: 'Renewable energy sources like wind and solar power help reduce carbon emissions worldwide.', category: 'general', difficulty: 'intermediate' },
  { id: 'gen-i-2', text: 'The human brain contains approximately eighty-six billion neurons connected by synapses.', category: 'general', difficulty: 'intermediate' },
  { id: 'gen-i-3', text: 'The Great Barrier Reef is the largest living coral reef ecosystem on the entire planet.', category: 'general', difficulty: 'intermediate' },
  { id: 'gen-i-4', text: 'Sound travels much faster through water and solid steel than it does through open air.', category: 'general', difficulty: 'intermediate' },
  { id: 'gen-i-5', text: 'Light from the Sun takes approximately eight minutes and twenty seconds to reach Earth.', category: 'general', difficulty: 'intermediate' },
  // Advanced
  { id: 'gen-a-1', text: 'Mount Everest reaches an official elevation of 8,848.86 meters (29,031.7 feet) above sea level.', category: 'general', difficulty: 'advanced' },
  { id: 'gen-a-2', text: 'The speed of light in a vacuum is exactly 299,792,458 meters per second, denoted as constant c.', category: 'general', difficulty: 'advanced' },
  { id: 'gen-a-3', text: 'In 1969, Apollo 11 landed on the Moon, allowing Neil Armstrong and Buzz Aldrin to walk on lunar soil.', category: 'general', difficulty: 'advanced' },
  { id: 'gen-a-4', text: 'The Amazon rainforest spans across 9 South American nations and produces roughly 6% of global oxygen.', category: 'general', difficulty: 'advanced' },
  { id: 'gen-a-5', text: 'Jupiter is more than 318 times as massive as Earth and has at least 95 confirmed natural moons.', category: 'general', difficulty: 'advanced' },

  // ==========================================
  // 10. STORYTELLING (16 sentences)
  // ==========================================
  // Beginner
  { id: 'story-b-1', text: 'The old lighthouse stood strong against the wind.', category: 'storytelling', difficulty: 'beginner' },
  { id: 'story-b-2', text: 'A quiet river flowed through the green valley.', category: 'storytelling', difficulty: 'beginner' },
  { id: 'story-b-3', text: 'Stars twinkled brightly in the clear night sky.', category: 'storytelling', difficulty: 'beginner' },
  { id: 'story-b-4', text: 'They walked along the calm sandy beach.', category: 'storytelling', difficulty: 'beginner' },
  { id: 'story-b-5', text: 'The gentle morning breeze carried the scent of pine.', category: 'storytelling', difficulty: 'beginner' },
  { id: 'story-b-6', text: 'An owl hooted softly from the tall oak tree.', category: 'storytelling', difficulty: 'beginner' },
  // Intermediate
  { id: 'story-i-1', text: 'As the golden sun sank below the horizon, the quiet village was bathed in warm amber light.', category: 'storytelling', difficulty: 'intermediate' },
  { id: 'story-i-2', text: 'She found a dusty leather journal hidden beneath the floorboards of the old family attic.', category: 'storytelling', difficulty: 'intermediate' },
  { id: 'story-i-3', text: 'The ancient stone bridge had endured centuries of winter storms and spring floods.', category: 'storytelling', difficulty: 'intermediate' },
  { id: 'story-i-4', text: 'He opened the weathered wooden door and stepped into the warm glow of the cozy cottage.', category: 'storytelling', difficulty: 'intermediate' },
  { id: 'story-i-5', text: 'A flock of wild geese flew in formation across the vast autumn sky as twilight descended.', category: 'storytelling', difficulty: 'intermediate' },
  // Advanced
  { id: 'story-a-1', text: 'By 7:00 PM, the rainstorm had passed, leaving behind glistening puddles that reflected the city lights.', category: 'storytelling', difficulty: 'advanced' },
  { id: 'story-a-2', text: 'In the heart of the bustling harbor, 3 ancient ships rested peacefully under the silver moonlight.', category: 'storytelling', difficulty: 'advanced' },
  { id: 'story-a-3', text: 'The clock in the old church tower struck 12 times, signaling the arrival of a quiet new year.', category: 'storytelling', difficulty: 'advanced' },
  { id: 'story-a-4', text: 'Holding a map dated 1884, the young explorer embarked on a journey across the uncharted mountain pass.', category: 'storytelling', difficulty: 'advanced' },
  { id: 'story-a-5', text: 'From the summit of Ridge Peak (elevation 2,400 m), they watched the dawn break over seven distinct valleys.', category: 'storytelling', difficulty: 'advanced' },
];

/**
 * Enriched sentence items with calculated wordCount and charCount
 */
export const SENTENCE_DATABASE: SentenceItem[] = RAW_SENTENCES.map((item) => ({
  ...item,
  charCount: item.text.length,
  wordCount: item.text.trim().split(/\s+/).length,
}));

/**
 * Sentences grouped by difficulty and category for fast lookup
 */
export const SENTENCES_BY_DIFFICULTY: Record<string, SentenceItem[]> = {
  beginner: SENTENCE_DATABASE.filter((s) => s.difficulty === 'beginner'),
  intermediate: SENTENCE_DATABASE.filter((s) => s.difficulty === 'intermediate'),
  advanced: SENTENCE_DATABASE.filter((s) => s.difficulty === 'advanced'),
};

export const CATEGORIES: { id: string; label: string; description: string }[] = [
  { id: 'all', label: 'All Categories', description: 'Mix of all topics' },
  { id: 'conversation', label: 'Everyday Conversation', description: 'Natural daily dialogues and phrases' },
  { id: 'workplace', label: 'Workplace', description: 'Office teamwork and project discussions' },
  { id: 'emails', label: 'Emails & Professional', description: 'Business correspondence and formal notes' },
  { id: 'education', label: 'Education & Learning', description: 'Study habits, academic concepts, science' },
  { id: 'technology', label: 'Technology', description: 'Coding, software, internet, and computers' },
  { id: 'travel', label: 'Travel & Navigation', description: 'Flights, destinations, and transit' },
  { id: 'shopping', label: 'Shopping & Finance', description: 'Retail, orders, budget, and prices' },
  { id: 'productivity', label: 'Personal Productivity', description: 'Time management, habits, and goals' },
  { id: 'general', label: 'General Knowledge', description: 'Science facts, geography, and nature' },
  { id: 'storytelling', label: 'Storytelling & Literature', description: 'Descriptive narrative passages' },
];
