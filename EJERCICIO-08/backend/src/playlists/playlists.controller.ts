import { Controller,Get,Param,ParseIntPipe } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';

@Controller('playlists')
export class PlaylistsController {
 constructor(private readonly service:PlaylistsService){}

 @Get(':id')
 findOne(@Param('id',ParseIntPipe) id:number){
   return this.service.findOne(id);
 }
}