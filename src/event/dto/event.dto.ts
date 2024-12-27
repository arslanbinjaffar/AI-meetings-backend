import {
  IsNotEmpty,
  IsString,
  IsNumber,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { IsNotEmptyTypeCast } from 'src/common/decorator/validation.decorator';

class TimeSlot {
  @IsNotEmptyTypeCast(Date)
  startTime: Date;
  @IsNotEmptyTypeCast(Date)
  endTime: Date;
}

export class CreateEvent {
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsNotEmpty()
  @IsString()
  agenda: string;
  @IsNotEmpty()
  @IsString()
  description: string;
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  timeSlots: TimeSlot[];

  @IsNumber(
    {
      maxDecimalPlaces: 0,
    },
    {
      each: true,
    },
  )
  participants: number[];
}

export class CreateTimeSlotVote {
  @IsNotEmpty()
  @IsNumber()
  slotId: number;
}

export class GetEventById {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
