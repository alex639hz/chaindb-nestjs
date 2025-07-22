/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, UseGuards, Query } from '@nestjs/common';
// import {
//     ApiCreatedResponse,
//     ApiOkResponse,
//     ApiUseTags,
//     ApiBearerAuth,
//     ApiImplicitHeader,
//     ApiOperation,
//     ApiImplicitParam,
// } from '@nestjs/swagger';
// import { AuthGuard } from '@nestjs/passport';

import { TxService } from './tx.service';
import { CreateTxDto } from './dto/create-tx.dto';
import { CryptoService } from '../crypto/crypto.service';
import { TxSignDto } from './dto/sign-tx.dto';
// import { RolesGuard } from 'src/auth/guards/roles.guard';
// import { Roles } from './../auth/decorators/roles.decorator';

// @ApiUseTags('Article')
// @UseGuards(RolesGuard)
@Controller('tx')
export class TxController {
    constructor(
        private readonly txService: TxService,
        private readonly cryptoService: CryptoService,
    ) { }

    @Get()
    async getAllTx() {
        return await this.txService.getAllTxs();
    }

    @Post()
    async createTx(@Body() createTxDto: CreateTxDto) {
        return await this.txService.txCreate(createTxDto);
    }
    // @HttpCode(HttpStatus.OK)
    // @ApiOperation({title: 'Get All article',})
    // @ApiOkResponse({})
    @Get('/test')
    async test(): Promise<any> {
        return await this.txService.test();
    }

    @Get('/demo')
    async demo(): Promise<any> {
        return await this.txService.demo();
    }

    @Get('/demo-init')
    async demoInit(): Promise<any> {
        return await this.txService.demoInit();
    }

    @Post('/hash')
    async hash(@Body() body): Promise<any> {
        return await this.txService.hash(body.message);
    }

    @Get('/balance')
    async getBalance(@Query('address') address: string) {
        return await this.txService.getBalance(address);
    }

    @Get('/generate-account')
    generateAccount() {
        return this.cryptoService.generateKeyPair();
    }

    @Get('/generate-wallet')
    generateWallet() {
        return this.cryptoService.generateWallet();
    }

    @Get('/all-accounts')
    getAllAccounts() {
        return this.txService.getAllAccounts();
    }

    @Get('/system-balance')
    getAccountsBalance() {
        return this.txService.getSystemBalance();
    }

    @Post('/sign')
    signTx(@Body() body: TxSignDto) {
        return this.cryptoService.sign(body);
    }

    @Post('/verify')
    encrypt(@Body() body) {
        return this.cryptoService.verify(body);
    }

    @Get('/jwt')
    jwt() {
        return this.txService.JwtTest();
    }

    // @Get(':id')
    // @HttpCode(HttpStatus.OK)
    // @ApiOperation({title: 'Get One article',})
    // @ApiImplicitParam({name: 'id', description: 'id of article'})
    // @ApiOkResponse({})
    // async getOneArticles(@Param() params) {
    //     return await this.txService.getOneArticle(params.id);
    // }

    // @HttpCode(HttpStatus.CREATED)
    // @UseGuards(AuthGuard('jwt'))
    // @Roles('admin')
    // @ApiOperation({title: 'Create one article',})
    // @ApiBearerAuth()
    // @ApiImplicitHeader({
    //     name: 'Bearer',
    //     description: 'the token we need for auth.'
    // })
    // @ApiCreatedResponse({})
    // @Post()
    // async createTx(@Body() createTxDto: CreateTxDto) {
    //     return await this.txService.createTx(createTxDto);
    // }


    // @Put(':id')
    // @HttpCode(HttpStatus.OK)
    // @UseGuards(AuthGuard('jwt'))
    // @Roles('admin')
    // @ApiOperation({title: 'Update one article by id ( all params )',})
    // @ApiBearerAuth()
    // @ApiImplicitParam({name: 'id', description: 'id of article'})
    // @ApiImplicitHeader({
    //     name: 'Bearer',
    //     description: 'the token we need for auth.'
    // })
    // @ApiOkResponse({})
    // async updateWithAllParams(@Param() params, @Body() createArticleDto: CreateTxDto) {
    //     return await this.txService.updateArticlePut(params.id, createArticleDto);
    // }

    // @Delete(':id')
    // @HttpCode(HttpStatus.OK)
    // @UseGuards(AuthGuard('jwt'))
    // @Roles('admin')
    // @ApiOperation({title: 'Delete one article',})
    // @ApiBearerAuth()
    // @ApiImplicitHeader({
    //     name: 'Bearer',
    //     description: 'the token we need for auth.'
    // })
    // @ApiImplicitParam({name: 'id', description: 'id of article we want to delete.'})
    // @ApiOkResponse({})
    // async deleteOneArticle(@Param() params) {
    //     return await this.txService.deleteArticle(params.id);
    // }
}
