import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule } from './features/home/home.module';
import { SkillsModule } from './features/skills/skills.module';
import { ProjectsModule } from './features/projects/projects.module';
import { ResumeModule } from './features/resume/resume.module';
import { ContactModule } from './features/contact/contact.module';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SharedModule } from './shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HomeModule,
    SkillsModule,
    ProjectsModule,
    ResumeModule,
    ContactModule,
    SharedModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
