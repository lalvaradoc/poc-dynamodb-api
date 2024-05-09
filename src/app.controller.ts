import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AppServiceV2 } from './app.servicev2';
import { AppServiceV3 } from './app.servicev3';

@Controller()
export class AppController {
  constructor(private readonly appService: AppServiceV3) {}

  @Get()
  getAll() {
    return this.appService.getAll();
  }
  @Get('/filter')
  filter(@Query('brand') brand: string, @Query('category') category: string) {
    return this.appService.getByIdentifier(brand, category);
  }

  @Post()
  create() {
    return this.appService.create();
  }

  @Patch('/:contentId')
  update(@Param('contentId') contentId: string) {
    return this.appService.update(contentId);
  }

  @Delete('/:contentId')
  remove(@Param('contentId') contentId: string) {
    return this.appService.remove(contentId);
  }
}
