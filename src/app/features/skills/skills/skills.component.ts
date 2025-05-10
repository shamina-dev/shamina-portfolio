import { Component } from '@angular/core';

export interface Skill {
  name: string;
  icon: string;
}

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent {

  skillsList: Skill[] = [
    { name: 'Angular', icon: 'pi-microsoft' },
    { name: 'TypeScript', icon: 'pi-microsoft' },
    { name: 'HTML5', icon: 'pi-microsoft' },
    { name: 'CSS3', icon: 'css3' }
    // add more skills as needed
  ];

  constructor() {}

  ngOnInit(): void {}

}
