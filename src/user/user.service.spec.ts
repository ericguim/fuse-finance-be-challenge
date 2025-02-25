import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let mockUserRepository: Partial<UserRepository>;

  beforeEach(async () => {
    mockUserRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto = { name: 'Test User', email: 'test@example.com' };
      const expectedUser = { id: '1', ...createUserDto };

      (mockUserRepository.create as jest.Mock).mockResolvedValue(expectedUser);

      const result = await service.create(createUserDto);
      expect(result).toBe(expectedUser);
    });
  });

  describe('findAll', () => {
    it('should return array of users', async () => {
      const expectedUsers = [
        { id: '1', name: 'User 1', email: 'user1@example.com' },
        { id: '2', name: 'User 2', email: 'user2@example.com' },
      ];

      (mockUserRepository.findAll as jest.Mock).mockResolvedValue(
        expectedUsers,
      );

      const result = await service.findAll();
      expect(result).toBe(expectedUsers);
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const expectedUser = {
        id: '1',
        name: 'User 1',
        email: 'user1@example.com',
      };

      (mockUserRepository.findOne as jest.Mock).mockResolvedValue(expectedUser);

      const result = await service.findOne('1');
      expect(result).toBe(expectedUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      (mockUserRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto = { name: 'Updated Name' };
      const existingUser = {
        id: '1',
        name: 'Old Name',
        email: 'test@example.com',
      };
      const updatedUser = { ...existingUser, ...updateUserDto };

      (mockUserRepository.findOne as jest.Mock).mockResolvedValue(existingUser);
      (mockUserRepository.update as jest.Mock).mockResolvedValue(updatedUser);

      const result = await service.update('1', updateUserDto);
      expect(result).toBe(updatedUser);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const existingUser = { id: '1', name: 'User', email: 'test@example.com' };

      (mockUserRepository.findOne as jest.Mock).mockResolvedValue(existingUser);
      (mockUserRepository.delete as jest.Mock).mockResolvedValue({
        success: true,
      });

      const result = await service.remove('1');
      expect(result).toEqual({ success: true });
    });
  });
});
