import { Component, OnInit } from '@angular/core';

export interface TimelineItem {
  year: string;
  role: string;
  institution: string;
  description: string;
}

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss']
})
export class ResumeComponent implements OnInit {

  experienceList: TimelineItem[] = [
    {
      year: '2026 - Present',
      role: 'Software Engineer Intern',
      institution: 'N-Meg Technologies',
      description: 'Developing responsive web applications, refining user interface components with Angular, and collaborating on feature implementations.'
    }
  ];

  educationList: TimelineItem[] = [
    {
      year: '2023 - Present',
      role: 'B.Sc. (Hons) in Software Engineering',
      institution: 'Undergraduate Institute',
      description: 'Focusing on database architectures, frontend framework structures, UI/UX methodologies, and embedded IoT system designs.'
    }
  ];

  constructor() { }

  ngOnInit(): void { }
}
