import { PartialType } from '@nestjs/mapped-types';
import { CreateParkingRecordDto } from './create-parking-record.dto';

export class UpdateParkingRecordDto extends PartialType(CreateParkingRecordDto) {}
