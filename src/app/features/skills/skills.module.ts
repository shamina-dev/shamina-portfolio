import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkillsRoutingModule } from './skills-routing.module';
import { SkillsComponent } from './skills/skills.component';
import { PanelModule } from 'primeng/panel';


@NgModule({
  declarations: [SkillsComponent],
  imports: [CommonModule, SkillsRoutingModule, PanelModule],
  exports:[SkillsComponent]
})
export class SkillsModule { }
