import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
  } from "@nestjs/common";
  import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
  import { SupportTicketService } from "./support-ticket.service";
  import { CreateSupportTicketDto, UpdateSupportTicketDto } from "./dto/support-ticket.dto";
  import { GetUser } from "../auth/decorators/get-user.decorator";
  import { User } from "./entities/user.entity";
  import { Roles } from "../auth/decorators/roles.decorator";
  import { Role } from "../utils/constants/constants";
  import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
  import { RolesGuard } from "../auth/guards/roles.guard";
    
  @ApiTags('Support')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Controller('support')
  export class SupportTicketController {
    constructor(private readonly supportTicketService: SupportTicketService) {}
  
    @Post()
    @ApiOperation({ summary: 'Create a new support ticket' })
    @ApiResponse({
      status: HttpStatus.CREATED,
      description: 'The support ticket has been successfully created.',
    })
    async createSupportTicket(
      @Body() createSupportTicketDto: CreateSupportTicketDto,
      @GetUser() user: User,
    ) {
      return await this.supportTicketService.createSupportTicket(createSupportTicketDto, user?.id);
    }
  
    @Get()
    @Roles(Role.Admin)
    @ApiOperation({ summary: 'Retrieve all support tickets' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'List of all support tickets retrieved successfully.',
    })
    async getAllSupportTickets(
      @Query('page') page = 1,
      @Query('limit') limit = 10,
      @Query() filters: any,
    ) {
      return await this.supportTicketService.getAllSupportTickets(page, limit, filters);
    }
  
    @Patch(':id')
    @Roles(Role.Admin)
    @ApiOperation({ summary: 'Update a support ticket by ID' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'The support ticket has been successfully updated.',
    })
    async updateSupportTicket(
      @Param('id') id: string,
      @Body() updateDto: UpdateSupportTicketDto,
    ) {
      return await this.supportTicketService.updateSupportTicket(id, updateDto);
    }
  }