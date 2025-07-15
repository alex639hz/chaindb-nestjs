/* eslint-disable prettier/prettier */
// import { IsNotEmpty, MinLength, MaxLength, IsEmail, IsString } from 'class-validator';
// import { ApiModelProperty } from '@nestjs/swagger';
import { Tx } from 'src/tx/interfaces/tx.interface';

export class CreateTxDto {
    publicKey?: string;
    signature?: string;
    message?: string;
    tx: Tx;
    // @ApiModelProperty({
    //     example: 'Body exmaple ...',
    //     description: 'Main part of article',
    //     format: 'string',
    // })
    // @IsNotEmpty()
    // @IsString()
    // readonly body: string;
}