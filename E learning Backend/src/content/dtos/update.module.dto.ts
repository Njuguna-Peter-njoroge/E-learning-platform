import { PartialType } from '@nestjs/mapped-types';
import { CreateContentDto } from './create-module.dto';

export class UpdateContentDto extends PartialType(CreateContentDto) {}
