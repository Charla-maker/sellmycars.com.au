import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminPassword = await hash('Admin123!', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@sellmycars.com.au' },
    update: {},
    create: {
      email: 'admin@sellmycars.com.au',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  })

  console.log('✅ Created admin user:', admin.email)

  // Create default categories
  const categories = [
    { name: 'News', slug: 'news', description: 'Latest news and updates' },
    { name: 'Tips', slug: 'tips', description: 'Car selling tips and advice' },
    { name: 'Industry', slug: 'industry', description: 'Automotive industry insights' },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }

  console.log('✅ Created default categories')

  // Create default settings
  const settings = [
    { key: 'site_name', value: 'Sell My Cars', type: 'string', group: 'general' },
    { key: 'site_description', value: 'Get cash for your car today', type: 'string', group: 'general' },
    { key: 'contact_email', value: 'info@sellmycars.com.au', type: 'string', group: 'general' },
    { key: 'contact_phone', value: '0420 587 575', type: 'string', group: 'general' },
    { key: 'default_meta_title', value: 'Sell My Cars - Cash for Cars Sydney', type: 'string', group: 'seo' },
    { key: 'default_meta_description', value: 'Get instant cash for your car in Sydney. Free pickup, same-day service.', type: 'string', group: 'seo' },
  ]

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    })
  }

  console.log('✅ Created default settings')

  // Create sample page
  await prisma.page.upsert({
    where: { slug: 'about' },
    update: {},
    create: {
      title: 'About Us',
      slug: 'about',
      content: '<p>Welcome to Sell My Cars - your trusted car buying service in Sydney.</p>',
      excerpt: 'Learn more about our company and services',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      template: 'default',
      authorId: admin.id,
      metaTitle: 'About Us - Sell My Cars',
      metaDescription: 'Learn about our cash for cars service in Sydney',
    },
  })

  console.log('✅ Created sample page')

  console.log('🎉 Seeding completed!')
  console.log('')
  console.log('📧 Admin Login:')
  console.log('   Email: admin@sellmycars.com.au')
  console.log('   Password: Admin123!')
  console.log('')
  console.log('⚠️  Please change the admin password after first login!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
