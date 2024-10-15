import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsNumber, Min, Max } from 'class-validator';


export class GetUserByIdDto {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  userId: number;
}