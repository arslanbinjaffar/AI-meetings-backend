import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { EventService } from './event.service';
import { User } from 'src/common/decorator/user.decorator';
import { User as UserType } from '@prisma/client';
import { UtilService } from 'src/util/util.service';
import { CreateEvent, CreateTimeSlotVote, GetEventById } from './dto/event.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('event')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly util: UtilService,
  ) {}

  @Get('all')
  getUserEvents(@User() user: UserType) {
    return this.util.tryCatchWrapper(() =>
      this.eventService.getUpcomingAndPastEvents(user),
    )();
  }

  @Get('upcoming')
  getUserUpcomingEvents(@User() user: UserType) {
    return this.util.tryCatchWrapper(() =>
      this.eventService.getUserUpcomingEvents(user),
    )();
  }

  @Get(':id')
  getEventById(@Param('id') id: number) {
    return this.util.tryCatchWrapper(() =>
      this.eventService.getEventById(id),
    )();
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  createEvent(@User() user: UserType, @Body() body: CreateEvent) {
    return this.util.tryCatchWrapper(() =>
      this.eventService.createEvent(user, body),
    )();
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/timeslot/vote')
  voteEventTimeSot(@User() user: UserType, @Body() body: CreateTimeSlotVote) {
    return this.util.tryCatchWrapper(() =>
      this.eventService.createTimeSlotVote(user, body),
    )();
  }

  @HttpCode(HttpStatus.CREATED)
  @Put('confirmation/status')
  confirmationStatusEvent(@User() user: UserType, @Body() body: any) {
    return this.util.tryCatchWrapper(() =>
      this.eventService.confirmationEvents(user, body),
    )();
  }
}
