import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { BackgroundComponent } from './shared/background/background.component';

import { CursorComponent } from './shared/cursor/cursor.component';

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    BackgroundComponent,
    CursorComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [NavbarComponent, FooterComponent, BackgroundComponent, CursorComponent, RouterModule]
})
export class SharedModule { }

