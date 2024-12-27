import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEvent, CreateTimeSlotVote } from './dto/event.dto';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  async getEventById(id: number) {
    return this.prisma.event.findFirst({
      where: {
        id,
      },
      include: {
        organizer: true,
        timeSlots: true,
        participants: {
          include: {
            participant: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async getUserUpcomingEvents(user: User) {
    return this.prisma.event.findMany({
      where: {
        OR: [
          {
            organizerId: user.id,
          },
          {
            participants: {
              some: {
                participantId: user.id,
              },
            },
          },
        ],
      },
      include: {
        organizer: true,
        timeSlots: true,
        participants: {
          include: {
            participant: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async createEvent(user: User, event: CreateEvent) {
    return this.prisma.event.create({
      data: {
        title: event.title,
        agenda: event.agenda,
        description: event.description,
        organizerId: user.id,
        timeSlots: {
          createMany: {
            data: event.timeSlots.map((timeSlot) => ({
              startTime: timeSlot.startTime,
              endTime: timeSlot.endTime,
            })),
          },
        },
        participants: {
          createMany: {
            data: event.participants.map((participantId) => ({
              participantId: participantId,
            })),
          },
        },
      },
    });
  }

  async createTimeSlotVote(user: User, createTimeSlotVote: CreateTimeSlotVote) {
    return this.prisma.timeSlotVote.create({
      data: {
        slotId: createTimeSlotVote.slotId,
        voterId: user.id,
      },
    });
  }

  async getUpcomingAndPastEvents(user: User) {
    const currentTime = new Date();
    console.log(currentTime.toISOString(), 'currentTime');

    const pending = await this.prisma.event.findMany({
      where: {
        timeSlots: {
          some: {
            startTime: {
              gt: currentTime,
            },
            timeSlotVote: {
              none: {
                voterId: user.id,
              },
            },
          },
        },
      },
      include: {
        organizer: true,
        timeSlots: true,
      },
    });

    const confirmation = await this.prisma.event.findMany({
      where: {
        timeSlots: {
          some: {
            startTime: {
              gt: currentTime,
            },
            timeSlotVote: {
              some: {
                voterId: user.id,
              },
            },
          },
        },
        participants: {
          none: {
            participantId: user.id,
            status: {
              in: ['ACCEPTED', 'REJECTED'],
            },
          },
        },
      },
      include: {
        organizer: true,
        timeSlots: true,
        participants: true,
      },
    });
    const acceptedRejected = await this.prisma.event.findMany({
      where: {
        timeSlots: {
          some: {
            startTime: {
              gt: currentTime,
            },
            timeSlotVote: {
              some: {
                voterId: user.id,
              },
            },
          },
        },
        participants: {
          some: {
            participantId: user.id,
            status: {
              in: ['ACCEPTED', 'REJECTED'],
            },
          },
        },
      },
      include: {
        organizer: true,
        timeSlots: true,
        participants: true,
      },
    });
    const pastEvents = await this.prisma.event.findMany({
      where: {
        participants: {
          some: {
            participantId: user.id,
          },
        },
        OR: [
          {
            timeSlots: {
              every: {
                endTime: {
                  lt: currentTime,
                },
              },
            },
          },
          {
            participants: {
              some: {
                participantId: user.id,
                status: {
                  in: ['ACCEPTED', 'REJECTED'],
                },
              },
            },
          },
        ],
      },
      include: {
        organizer: true,
        timeSlots: true,
        participants: true,
      },
    });
    console.log('Past Events:', pastEvents);

    return {
      pending,
      confirmation,
      pastEvents,
      acceptedRejected,
    };
  }

  async confirmationEvents(user: User, body: any) {
    const confirmations = await this.prisma.event.update({
      where: {
        id: body.eventId,
        participants: {},
      },
      data: {
        participants: {
          update: {
            where: {
              id: body.id,
              participantId: body.participantId,
              eventId: body.id,
            },
            data: {
              status: body.status,
            },
          },
        },
      },
      include: {
        organizer: true,
        participants: true,
      },
    });
    return confirmations;
  }
}
