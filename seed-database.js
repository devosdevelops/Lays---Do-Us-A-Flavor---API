import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { User } from './src/models/Placeholder.js';
import { Submission } from './src/models/Submission.js';
import { Vote } from './src/models/Vote.js';

dotenv.config();

const FLAVORS = [
  { name: 'Spicy Mango Tango', color: '#FF6B35', font: 'Bold Sans', notes: ['Mango', 'Spicy', 'Tropical'] },
  { name: 'Berry Blast Supreme', color: '#8B3A8B', font: 'Modern', notes: ['Berry', 'Sweet', 'Refreshing'] },
  { name: 'Tangy Lime Dream', color: '#00FF00', font: 'Italic', notes: ['Lime', 'Citrus', 'Zesty'] },
  { name: 'Smoky BBQ Heaven', color: '#8B4513', font: 'Bold Sans', notes: ['Smoke', 'BBQ', 'Savory'] },
  { name: 'Wasabi Lightning', color: '#FFD700', font: 'Modern', notes: ['Wasabi', 'Hot', 'Intense'] },
  { name: 'Chocolate Cherry Paradise', color: '#6B3C2B', font: 'Italic', notes: ['Chocolate', 'Cherry', 'Rich'] },
  { name: 'Jalapeño Fiesta', color: '#228B22', font: 'Bold Sans', notes: ['Jalapeno', 'Spicy', 'Bold'] },
  { name: 'Strawberry Cheesecake', color: '#FF69B4', font: 'Modern', notes: ['Strawberry', 'Cheesecake', 'Sweet'] },
  { name: 'Garlic Herb Explosion', color: '#90EE90', font: 'Italic', notes: ['Garlic', 'Herb', 'Savory'] },
  { name: 'Cosmic Space Dust', color: '#800080', font: 'Bold Sans', notes: ['Mysterious', 'Space', 'Unique'] },
  { name: 'Teriyaki Dragon', color: '#FF4500', font: 'Modern', notes: ['Teriyaki', 'Asian', 'Sweet'] },
  { name: 'Mint Mojito Madness', color: '#00CED1', font: 'Italic', notes: ['Mint', 'Refreshing', 'Cool'] },
  { name: 'Sriracha Sunrise', color: '#FF0000', font: 'Bold Sans', notes: ['Sriracha', 'Hot', 'Asian'] },
  { name: 'Maple Bacon Bliss', color: '#8B7355', font: 'Modern', notes: ['Maple', 'Bacon', 'Savory'] },
  { name: 'Passion Fruit Paradise', color: '#FFB6C1', font: 'Italic', notes: ['Passion Fruit', 'Tropical', 'Sweet'] },
  { name: 'Ghost Pepper Inferno', color: '#DC143C', font: 'Bold Sans', notes: ['Ghost Pepper', 'Extreme Heat', 'Bold'] },
  { name: 'Pistachio Dream', color: '#6B8E23', font: 'Modern', notes: ['Pistachio', 'Nutty', 'Unique'] },
  { name: 'Lavender Honey', color: '#E6E6FA', font: 'Italic', notes: ['Lavender', 'Honey', 'Sweet'] },
  { name: 'Ginger Snap', color: '#CD853F', font: 'Bold Sans', notes: ['Ginger', 'Spicy', 'Crisp'] },
  { name: 'Blueberry Lemon', color: '#4169E1', font: 'Modern', notes: ['Blueberry', 'Lemon', 'Citrus'] },
];

function generateUsernames(count) {
  const adjectives = ['spicy', 'crispy', 'salty', 'sweet', 'bold', 'zesty', 'tangy', 'cool', 'hot', 'crunchy', 'savory', 'tasty'];
  const nouns = ['chip', 'snack', 'flavor', 'craving', 'lover', 'addict', 'master', 'king', 'queen', 'genius', 'wizard', 'guru'];
  
  const usernames = new Set();
  while (usernames.size < count) {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 1000);
    usernames.add(`${adj}_${noun}_${num}`);
  }
  return Array.from(usernames);
}

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Submission.deleteMany({});
    await Vote.deleteMany({});
    console.log('✓ Cleared existing data');

    // Create admin user first
    const adminPassword = await bcrypt.hash('Admin', 10);
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@admin.com',
      password: adminPassword,
      isBanned: false,
      isAdmin: true,
    });
    console.log('✓ Created admin user (admin@admin.com / Admin)');

    // Create regular users
    const userCount = 200;
    const usernames = generateUsernames(userCount);
    const users = [adminUser];
    
    for (const username of usernames) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = await User.create({
        username,
        email: `${username}@example.com`,
        password: hashedPassword,
        isBanned: false,
        isAdmin: false,
      });
      users.push(user);
    }
    console.log(`✓ Created ${userCount} regular users (${userCount + 1} total with admin)`);

    // Create submissions (~60, distributed across users)
    const submissions = [];
    const submissionCount = 60;
    let flavorIndex = 0;
    
    for (let i = 0; i < submissionCount; i++) {
      // Distribute submissions: some users have multiple, most have 0-1
      const randomUserIdx = Math.floor(Math.random() * users.length);
      const flavor = FLAVORS[flavorIndex % FLAVORS.length];
      const imageIdx = i % 5; // Vary images
      
      const submission = await Submission.create({
        userId: users[randomUserIdx]._id,
        flavorName: `${flavor.name} v${i + 1}`,
        bagColor: flavor.color,
        fontChoice: flavor.font,
        keyFlavors: flavor.notes,
        bagImageUrl: `https://picsum.photos/400/400?random=${i * 10}`,
        voteCount: 0,
        hasWon: false,
      });
      submissions.push(submission);
      flavorIndex++;
    }
    console.log(`✓ Created ${submissionCount} submissions`);

    // Create votes (~1000+)
    // Each user votes on 5-8 submissions on average
    let voteCount = 0;
    const targetVotes = 1000;
    
    for (let i = 0; i < users.length && voteCount < targetVotes; i++) {
      // Vary votes per user (5-8)
      const votesPerUser = Math.floor(Math.random() * 4) + 5;
      const votedSubmissions = new Set();
      
      for (let j = 0; j < votesPerUser && voteCount < targetVotes; j++) {
        let randomSubmissionIdx;
        do {
          randomSubmissionIdx = Math.floor(Math.random() * submissions.length);
        } while (votedSubmissions.has(randomSubmissionIdx));
        
        votedSubmissions.add(randomSubmissionIdx);
        
        // Create vote
        try {
          await Vote.create({
            userId: users[i]._id,
            submissionId: submissions[randomSubmissionIdx]._id,
          });
          
          // Increment vote count on submission
          submissions[randomSubmissionIdx].voteCount += 1;
          await submissions[randomSubmissionIdx].save();
          voteCount++;
        } catch (e) {
          // Duplicate vote, skip
        }
      }
    }
    console.log(`✓ Created ${voteCount} votes`);

    // Fetch and display stats
    const finalUserCount = await User.countDocuments();
    const finalSubmissionCount = await Submission.countDocuments();
    const finalVoteCount = await Vote.countDocuments();

    console.log('\n📊 Database Seeding Complete!');
    console.log(`   Users: ${finalUserCount}`);
    console.log(`   Submissions: ${finalSubmissionCount}`);
    console.log(`   Votes: ${finalVoteCount}`);
    console.log('\n🧪 Admin Account:');
    console.log('   Email: admin@admin.com');
    console.log('   Password: Admin');
    console.log('\n🧪 Sample User Account:');
    console.log('   Email: spicy_chip_123@example.com');
    console.log('   Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();
