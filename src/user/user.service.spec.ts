import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let mockUserRepository: Partial<UserRepository>;

  beforeEach(async () => {
    mockUserRepository = {
      findOne: jest.fn(),
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
});
