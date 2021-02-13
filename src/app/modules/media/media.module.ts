import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaService } from './media.service';
import { EffectsModule } from '@ngrx/effects';
import { MediaEffects } from './state/media.effects';
import { StoreModule } from '@ngrx/store';
import { reducer } from './state/media.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('media', reducer),
    EffectsModule.forFeature([MediaEffects])
  ],
  exports: [],
  providers: [MediaService]
})
export class MediaModule {}
