import { Component, OnInit } from '@angular/core';

export interface Skill {
  name: string;
  icon: string;
  color: string;
  category: string;
}

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {

  skillsList: Skill[] = [
    // Frontend
    { name: 'Angular', icon: 'pi-code', color: '#ff2d55', category: 'Frontend' },
    { name: 'TypeScript', icon: 'pi-info-circle', color: '#007acc', category: 'Frontend' },
    { name: 'JavaScript', icon: 'pi-globe', color: '#f7df1e', category: 'Frontend' },
    { name: 'HTML5 / CSS3', icon: 'pi-palette', color: '#e34f26', category: 'Frontend' },
    
    // Backend & DB
    { name: 'Node.js', icon: 'pi-server', color: '#339933', category: 'Backend' },
    { name: 'Python', icon: 'pi-sliders-h', color: '#3776ab', category: 'Backend' },
    { name: 'SQL Databases', icon: 'pi-database', color: '#00f2fe', category: 'Backend' },
    
    // Tools & Hardware
    { name: 'Git & GitHub', icon: 'pi-github', color: '#f05032', category: 'Tools' },
    { name: 'IoT Solutions', icon: 'pi-cog', color: '#00ffc4', category: 'Tools' },
    { name: 'UI/UX (Figma)', icon: 'pi-heart-fill', color: '#b600ff', category: 'Tools' }
  ];

  categories: string[] = ['Frontend', 'Backend', 'Tools'];

  constructor() {}

  ngOnInit(): void {}

  getSkillsByCategory(category: string): Skill[] {
    return this.skillsList.filter(s => s.category === category);
  }
}
