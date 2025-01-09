// @Controller('support')
// export class SupportTicketController {
//   constructor(private readonly supportTicketService: SupportTicketService) {}

//   @Post()
//   async createSupportTicket(@Body() createSupportTicketDto: CreateSupportTicketDto, @GetUser() user: User) {
//     return await this.supportTicketService.createSupportTicket(createSupportTicketDto, user?.id);
//   }

//   @Get()
//   @Roles(Role.Admin)
//   async getAllSupportTickets(
//     @Query('page') page = 1,
//     @Query('limit') limit = 10,
//     @Query() filters: any,
//   ) {
//     return await this.supportTicketService.getAllSupportTickets(page, limit, filters);
//   }

//   @Patch(':id')
//   @Roles(Role.Admin)
//   async updateSupportTicket(@Param('id') id: string, @Body() updateDto: UpdateSupportTicketDto) {
//     return await this.supportTicketService.updateSupportTicket(id, updateDto);
//   }
// }
