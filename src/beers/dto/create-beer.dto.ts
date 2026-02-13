import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';

export class CreateBeerDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @Min(0)
  @Max(20)
  minTempC!: number;

  @IsNumber()
  @Min(0)
  @Max(20)
  maxTempC!: number;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
