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

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto = { name: 'Test User', email: 'test@example.com' };
      const expectedUser = { id: '1', ...createUserDto, createdAt: new Date() };

      prisma.user.create.mockResolvedValue(expectedUser);

      const result = await repository.create(createUserDto);
      expect(result).toBe(expectedUser);
      expect(prisma.user.create).toHaveBeenCalledWith({ data: createUserDto });
    });
  });

  describe('findAll', () => {
    it('should return array of users', async () => {
      const expectedUsers = [
        {
          id: '1',
          name: 'User 1',
          email: 'user1@example.com',
          createdAt: new Date(),
        },
        {
          id: '2',
          name: 'User 2',
          email: 'user2@example.com',
          createdAt: new Date(),
        },
      ];

      prisma.user.findMany.mockResolvedValue(expectedUsers);

      const result = await repository.findAll();
      expect(result).toBe(expectedUsers);
      expect(prisma.user.findMany).toHaveBeenCalled();
    });
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

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto = { name: 'Updated Name' };
      const updatedUser = {
        id: '1',
        name: 'Updated Name',
        email: 'test@example.com',
        createdAt: new Date(),
      };

      prisma.user.update.mockResolvedValue(updatedUser);

      const result = await repository.update('1', updateUserDto);
      expect(result).toBe(updatedUser);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateUserDto,
      });
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const deletedUser = {
        id: '1',
        name: 'User',
        email: 'test@example.com',
        createdAt: new Date(),
      };

      prisma.user.delete.mockResolvedValue(deletedUser);

      const result = await repository.delete('1');
      expect(result).toBe(deletedUser);
      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
