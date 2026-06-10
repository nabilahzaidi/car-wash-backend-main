import * as http from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import { User } from './app/modules/user/user.model';


let server:http.Server;

const seedDefaultUsers = async () => {
  if (config.NODE_ENV === 'production') return;

  const defaultUsers = [
    {
      name: 'Admin User',
      email: 'admin@programming-hero.com',
      password: 'ph-password',
      phone: '0000000000',
      role: 'admin',
      address: 'Admin address',
    },
    {
      name: 'Reviewer User',
      email: 'reviewer@carwash.com',
      password: '12345678',
      phone: '0000000000',
      role: 'user',
      address: 'Customer address',
    },
  ];

  for (const user of defaultUsers) {
    const existingUser = await User.findOne({ email: user.email });
    if (!existingUser) {
      await User.create(user);
      console.log(`Seeded user: ${user.email}`);
    }
  }
};

async function main() {
  try {
    await mongoose.connect(config.DATABASE_URL as string);
    await seedDefaultUsers();
    app.listen(config.PORT, () => {
      console.log(`App is listening on port ${config.PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();

process.on('unhandledRejection',()=>{
  console.log(`unhanledRajection is detecteted`);
  
  if(server){
    server.close(()=>{
      process.exit(1)
    })
  }
  process.exit(1)
})


process.on('uncaughtException',()=>{
  console.log(`UncaughtException is detected, shutting down...`);
  process.exit(1)
  
})