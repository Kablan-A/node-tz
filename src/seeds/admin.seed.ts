import { connectDB } from '../config/db.config';
import { AppDataSource } from '../data-source';
import { RoleType } from '../enums/RoleType.enum';
import { hashPassword } from '../utils/hash-password.util';

const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

async function seedAdmin() {
  if (!AppDataSource.isInitialized) {
    await connectDB();
  }

  const userRepository = AppDataSource.getRepository('User');
  const roleRepository = AppDataSource.getRepository('Role');

  const adminExists = await userRepository.exists({
    where: { email: ADMIN_EMAIL },
  });
  if (adminExists) {
    console.log('Admin user already exists. Skipping admin seeding.');
    return;
  }

  const adminRole = await roleRepository.findOneBy({ name: RoleType.ADMIN });
  if (!adminRole) {
    console.error('Admin role not found. Please seed roles before seeding admin.');
    return;
  }

  const hashedPassword = await hashPassword(ADMIN_PASSWORD!);
  const adminUser = userRepository.create({
    fullName: 'Admin User',
    email: ADMIN_EMAIL,
    password: hashedPassword,
    role: adminRole,
    dateOfBirth: new Date(),
  });

  await userRepository.save(adminUser);
  console.log('Admin user seeded successfully.');
}

seedAdmin();
