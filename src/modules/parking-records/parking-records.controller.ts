import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParkingRecordsService } from './parking-records.service';
import { CreateParkingRecordDto } from './dto/create-parking-record.dto';
import { UpdateParkingRecordDto } from './dto/update-parking-record.dto';

@Controller('parking-records')
export class ParkingRecordsController {
  constructor(private readonly parkingRecordsService: ParkingRecordsService) {}

  @Post()
  create(@Body() createParkingRecordDto: CreateParkingRecordDto) {
    return this.parkingRecordsService.create(createParkingRecordDto);
  }

  @Get()
  findAll() {
    return this.parkingRecordsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parkingRecordsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParkingRecordDto: UpdateParkingRecordDto) {
    return this.parkingRecordsService.update(+id, updateParkingRecordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parkingRecordsService.remove(+id);
  }
}
