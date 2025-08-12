// Script to set admin@example.com as admin
const mongoose = require('mongoose');
const config = require('./config/config');
const User = require('./models/User');

async function setAdmin() {
  await mongoose.connect(config.mongoURI);
  const user = await User.findOne({ email: 'admin@example.com' });
  if (!user) {
    console.log('admin@example.com not found.');
    process.exit(1);
  }
  let changed = false;
  if (user.role !== 'admin') {
    user.role = 'admin';
    changed = true;
  }
  if (!user.isVerified) {
    user.isVerified = true;
    changed = true;
  }
  if (changed) {
    await user.save();
    console.log('admin@example.com set as admin and verified.');
  } else {
    console.log('admin@example.com is already admin and verified.');
  }
  process.exit(0);
}

setAdmin().catch(e => { console.error(e); process.exit(1); });
