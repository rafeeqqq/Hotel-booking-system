const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.guest.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.user.deleteMany();

  // Create hotels
  const hotels = [
    {
      name: 'Luxury Palace Hotel',
      description: 'Experience the epitome of luxury in our 5-star hotel with world-class amenities and breathtaking views.',
      location: 'Mumbai, Maharashtra',
      price: 12500,
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
    },
    {
      name: 'Mountain View Resort',
      description: 'Nestled in the serene mountains, our resort offers a perfect getaway from the hustle and bustle of city life.',
      location: 'Shimla, Himachal Pradesh',
      price: 8500,
      imageUrl: 'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
    },
    {
      name: 'Beachside Paradise',
      description: 'Wake up to the sound of waves and enjoy the pristine beaches right at your doorstep.',
      location: 'Goa',
      price: 9500,
      imageUrl: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
    },
    {
      name: 'Heritage Haveli',
      description: 'Step back in time and experience the royal heritage of India in our meticulously restored haveli.',
      location: 'Jaipur, Rajasthan',
      price: 7500,
      imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80'
    },
    {
      name: 'Urban Oasis Hotel',
      description: 'Located in the heart of the city, our hotel offers modern amenities with easy access to business and entertainment hubs.',
      location: 'Bangalore, Karnataka',
      price: 6500,
      imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
    },
    {
      name: 'Lakeside Retreat',
      description: 'Enjoy the tranquility of the lakeside with panoramic views and outdoor activities.',
      location: 'Udaipur, Rajasthan',
      price: 9000,
      imageUrl: 'https://images.unsplash.com/photo-1580977276076-ae4b8c219b8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80'
    }
  ];

  for (const hotel of hotels) {
    await prisma.hotel.create({
      data: hotel
    });
  }

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
