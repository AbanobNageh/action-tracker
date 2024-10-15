import { Controller, Get, NotFoundException, Param, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { GetUserByIdDto } from './dto/get.user.by.id.dto';
import { UserView } from '../core-data/view/user.view';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/:userId')
  getUserById(@Param(new ValidationPipe({ transform: true })) queryParams: GetUserByIdDto): UserView {
    const user = this.usersService.getUserById(queryParams.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return new UserView(user).render() as UserView;
  }
}
