/* eslint-disable prettier/prettier */
// import { IsNotEmpty, MinLength, MaxLength, IsEmail, IsString } from 'class-validator';
// import { ApiModelProperty } from '@nestjs/swagger';

export class TxSignDto {
    // @ApiModelProperty({
    //     example: 'Example Title',
    //     description: 'Title of article',
    //     format: 'string',
    //     minLength: 6,
    //     maxLength: 255,
    // })
    // @IsNotEmpty()
    // @IsString()
    // @MinLength(5)
    // @MaxLength(255)
    privateKey;
    tx;
    // amount: number;
    // tx, privateKey
    // @ApiModelProperty({
    //     example: 'Body exmaple ...',
    //     description: 'Main part of article',
    //     format: 'string',
    // })
    // @IsNotEmpty()
    // @IsString()
    // readonly body: string;
}
export class TxVerifyDto {
    // @ApiModelProperty({
    //     example: 'Example Title',
    //     description: 'Title of article',
    //     format: 'string',
    //     minLength: 6,
    //     maxLength: 255,
    // })
    // @IsNotEmpty()
    // @IsString()
    // @MinLength(5)
    // @MaxLength(255)
    privateKey;
    tx;
    publicKey: any;
    signature: any;
    // amount: number;
    // tx, privateKey
    // @ApiModelProperty({
    //     example: 'Body exmaple ...',
    //     description: 'Main part of article',
    //     format: 'string',
    // })
    // @IsNotEmpty()
    // @IsString()
    // readonly body: string;
}