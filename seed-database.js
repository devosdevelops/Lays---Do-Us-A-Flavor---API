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
];

const USERNAMES = [
  'alex_flavor', 'design_master', 'chip_wizard', 'taste_explorer', 'snack_genius',
  'creative_cook', 'flavor_queen', 'crispy_king', 'spice_seeker', 'sweet_tooth',
  'bold_baker', 'zesty_zoe', 'savory_sam', 'pepper_paul', 'citrus_chris'
];

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

    // Create users
    const users = [];
    for (const username of USERNAMES) {
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
    console.log(`✓ Created ${users.length} users`);

    // Create submissions
    const submissions = [];
    let flavorIndex = 0;
    
    for (let i = 0; i < users.length; i++) {
      const flavor = FLAVORS[flavorIndex % FLAVORS.length];
      const bagImages = [
        `https://picsum.photos/400/400?random=${i * 4 + 1}`,
        `https://picsum.photos/400/400?random=${i * 4 + 2}`,
        `https://picsum.photos/400/400?random=${i * 4 + 3}`,
        `https://picsum.photos/400/400?random=${i * 4 + 4}`,
      ];
      
      const submission = await Submission.create({
        userId: users[i]._id,
        flavorName: flavor.name,
        bagColor: flavor.color,
        fontChoice: flavor.font,
        keyFlavors: flavor.notes,
        bagImageUrl: bagImages[flavorIndex % bagImages.length],
        voteCount: 0,
        hasWon: false,
      });
      submissions.push(submission);
      flavorIndex++;
    }
    console.log(`✓ Created ${submissions.length} submissions`);

    // Create votes - each user votes on random submissions
    let voteCount = 0;
    for (let i = 0; i < users.length; i++) {
      // Each user votes on 3-5 random submissions (excluding their own)
      const votesPerUser = Math.floor(Math.random() * 3) + 3; // 3-5 votes
      const votedSubmissions = new Set([i]); // Exclude their own submission
      
      for (let j = 0; j < votesPerUser; j++) {
        let randomIdx;
        do {
          randomIdx = Math.floor(Math.random() * submissions.length);
        } while (votedSubmissions.has(randomIdx));
        
        votedSubmissions.add(randomIdx);
        
        // Create vote
        await Vote.create({
          userId: users[i]._id,
          submissionId: submissions[randomIdx]._id,
        });
        
        // Increment vote count on submission
        submissions[randomIdx].voteCount += 1;
        await submissions[randomIdx].save();
        voteCount++;
      }
    }
    console.log(`✓ Created ${voteCount} votes`);

    // Fetch and display stats
    const userCount = await User.countDocuments();
    const submissionCount = await Submission.countDocuments();
    const voteCount2 = await Vote.countDocuments();

    console.log('\n📊 Database Seeding Complete!');
    console.log(`   Users: ${userCount}`);
    console.log(`   Submissions: ${submissionCount}`);
    console.log(`   Votes: ${voteCount2}`);
    console.log('\n🧪 Test Credentials:');
    console.log('   Username: alex_flavor');
    console.log('   Email: alex_flavor@example.com');
    console.log('   Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();
