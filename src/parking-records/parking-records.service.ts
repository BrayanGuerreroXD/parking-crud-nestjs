import { Injectable } from '@nestjs/common';
import { CreateParkingRecordDto } from './dto/create-parking-record.dto';
import { UpdateParkingRecordDto } from './dto/update-parking-record.dto';

@Injectable()
export class ParkingRecordsService {
  create(createParkingRecordDto: CreateParkingRecordDto) {
    return 'This action adds a new parkingRecord';
  }

  findAll() {
    return `This action returns all parkingRecords`;
  }

  findOne(id: number) {
    return `This action returns a #${id} parkingRecord`;
  }

  update(id: number, updateParkingRecordDto: UpdateParkingRecordDto) {
    return `This action updates a #${id} parkingRecord`;
  }

  remove(id: number) {
    return `This action removes a #${id} parkingRecord`;
  }
}
