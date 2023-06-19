import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    };
    const result = createMockUser(
      1,
      createUserDto.firstName,
      createUserDto.lastName,
      createUserDto.email,
    );

    jest.spyOn(prismaService.user, 'create').mockResolvedValue(result);

    const user = await usersService.create(createUserDto);
    expect(user).toEqual(result);
    expect(prismaService.user.create).toHaveBeenCalledWith({
      data: createUserDto,
    });
  });

  it('should find all users', async () => {
    const result = [
      createMockUser(1, 'John', 'Doe', 'john@example.com'),
      createMockUser(2, 'Jane', 'Doe', 'jane@example.com'),
    ];

    jest.spyOn(prismaService.user, 'findMany').mockResolvedValue(result);

    const users = await usersService.findAll();

    expect(users).toEqual(result);
    expect(prismaService.user.findMany).toHaveBeenCalled();
  });

  it('should find a user by id', async () => {
    const id = '1';
    const result = createMockUser(1, 'John', 'Doe', 'john@example.com');

    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(result);

    const user = await usersService.findOne(id);

    expect(user).toEqual(result);
    expect(prismaService.user.findUnique).toHaveBeenCalledWith({
      where: { id: parseInt(id) },
    });
  });

  it('should update a user', async () => {
    const id = '1';
    const updateUserDto = {
      firstName: 'John',
      lastName: 'Doe Updated',
      email: 'john_updated@example.com',
    };

    const result = createMockUser(
      1,
      updateUserDto.firstName,
      updateUserDto.lastName,
      updateUserDto.email,
    );

    jest.spyOn(prismaService.user, 'update').mockResolvedValue(result);

    const user = await usersService.update(id, updateUserDto);

    expect(user).toEqual(result);
    expect(prismaService.user.update).toHaveBeenCalledWith({
      where: { id: parseInt(id) },
      data: updateUserDto,
    });
  });

  it('should remove a user', async () => {
    const id = '1';
    const result = createMockUser(1, 'John', 'Doe', 'john@example.com');

    jest.spyOn(prismaService.user, 'delete').mockResolvedValue(result);

    const user = await usersService.remove(id);

    expect(user).toEqual(result);
    expect(prismaService.user.delete).toHaveBeenCalledWith({
      where: { id: parseInt(id) },
    });
  });
});

function createMockUser(
  id: number,
  firstName: string,
  lastName: string,
  email: string,
): any {
  return {
    id,
    firstName,
    lastName,
    email,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
