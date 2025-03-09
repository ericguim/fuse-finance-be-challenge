import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { PrismaService } from '../prisma/prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

describe('UserRepository', () => {
  let repository: UserRepository;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
  });

  describe('findOne', () => {
    it('should find a user by id', async () => {
      const expectedUser = {
        id: '1',
        name: 'User 1',
        email: 'user1@example.com',
        createdAt: new Date(),
      };

      prisma.user.findUnique.mockResolvedValue(expectedUser);

      const result = await repository.findOne('1');
      expect(result).toBe(expectedUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
