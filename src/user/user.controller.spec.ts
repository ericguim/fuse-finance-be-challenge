import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let mockUserService: Partial<UserService>;

  beforeEach(async () => {
    mockUserService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto = { name: 'Test User', email: 'test@example.com' };
      const expectedUser = { id: '1', ...createUserDto };

      (mockUserService.create as jest.Mock).mockResolvedValue(expectedUser);

      const result = await controller.create(createUserDto);
      expect(result).toBe(expectedUser);
    });
  });

  describe('findAll', () => {
    it('should return array of users', async () => {
      const expectedUsers = [
        { id: '1', name: 'User 1', email: 'user1@example.com' },
        { id: '2', name: 'User 2', email: 'user2@example.com' },
      ];

      (mockUserService.findAll as jest.Mock).mockResolvedValue(expectedUsers);

      const result = await controller.findAll();
      expect(result).toBe(expectedUsers);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const expectedUser = {
        id: '1',
        name: 'User 1',
        email: 'user1@example.com',
      };

      (mockUserService.findOne as jest.Mock).mockResolvedValue(expectedUser);

      const result = await controller.findOne('1');
      expect(result).toBe(expectedUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto = { name: 'Updated Name' };
      const updatedUser = {
        id: '1',
        name: 'Updated Name',
        email: 'test@example.com',
      };

      (mockUserService.update as jest.Mock).mockResolvedValue(updatedUser);

      const result = await controller.update('1', updateUserDto);
      expect(result).toBe(updatedUser);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const expectedResult = { success: true };

      (mockUserService.remove as jest.Mock).mockResolvedValue(expectedResult);

      const result = await controller.remove('1');
      expect(result).toBe(expectedResult);
    });
  });
});
