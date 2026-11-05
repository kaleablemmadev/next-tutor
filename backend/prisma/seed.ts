// prisma/seed.ts
import { prisma } from '../src/prisma';

async function main() {
    console.log('🌱 Starting database seeding...');

    // 1. Seed Grades
    const grades = [
        { id: '110e8400-e29b-41d4-a716-446655440001', name: 'Grade 1', level: 1 },
        { id: '110e8400-e29b-41d4-a716-446655440002', name: 'Grade 2', level: 2 },
        { id: '110e8400-e29b-41d4-a716-446655440003', name: 'Grade 3', level: 3 },
        { id: '110e8400-e29b-41d4-a716-446655440004', name: 'Grade 4', level: 4 },
        { id: '110e8400-e29b-41d4-a716-446655440005', name: 'Grade 5', level: 5 },
        { id: '110e8400-e29b-41d4-a716-446655440006', name: 'Grade 6', level: 6 },
        { id: '110e8400-e29b-41d4-a716-446655440007', name: 'Grade 7', level: 7 },
        { id: '110e8400-e29b-41d4-a716-446655440008', name: 'Grade 8', level: 8 },
        { id: '110e8400-e29b-41d4-a716-446655440009', name: 'Grade 9', level: 9 },
        { id: '110e8400-e29b-41d4-a716-446655440010', name: 'Grade 10', level: 10 },
        { id: '110e8400-e29b-41d4-a716-446655440011', name: 'Grade 11', level: 11 },
        { id: '110e8400-e29b-41d4-a716-446655440012', name: 'Grade 12', level: 12 },
    ];

    for (const grade of grades) {
        await prisma.grade.upsert({
            where: { id: grade.id },
            update: {},
            create: { id: grade.id, name: grade.name, sortOrder: grade.level },
        });
    }
    console.log('✅ Grades seeded successfully.');

    // 2. Seed Subjects
    const subjects = [
        { name: 'Mathematics' },
        { name: 'English' },
        { name: 'Physics' },
        { name: 'Chemistry' },
        { name: 'Biology' },
        { name: 'History' },
        { name: 'Geography' },
        { name: 'Civics' },
        { name: 'Information Technology' },
    ];

    for (const subject of subjects) {
        await prisma.subject.upsert({
            where: { name: subject.name },
            update: {},
            create: subject,
        });
    }
    console.log('✅ Subjects seeded successfully.');

    console.log('🎉 Seeding finished.');
}

main()
    .catch((e) => {
        console.error('❌ Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });