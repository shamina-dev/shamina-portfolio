import { Component, OnInit } from '@angular/core';

interface Service {
  title: string;
  description: string;
  icon: string;
}

export interface Project {
  title: string;
  description: string;
  tags: string[];
  githubUrl: string;
  liveUrl: string;
  gradientClass: string;
}

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  services: Service[] = [
    { 
      title: 'UI/UX Design', 
      description: 'Creating high-fidelity wireframes, interactive user flows, and cohesive design systems utilizing Figma.', 
      icon: 'pi-palette' 
    },
    { 
      title: 'Web Development', 
      description: 'Developing high-performance, responsive single page applications using Angular, TypeScript, and modern SCSS.', 
      icon: 'pi-globe' 
    },
    { 
      title: 'IoT Solutions', 
      description: 'Integrating hardware (ESP32, microcontrollers) with API services and real-time dashboard visualization.', 
      icon: 'pi-cog' 
    }
  ];

  projects: Project[] = [
    {
      title: 'E-Learning Lecture Portal',
      description: 'A responsive platform for streaming lectures, managing subscriptions, and tracking lesson progress with roles for instructors and students.',
      tags: ['Angular', 'TypeScript', 'SCSS', 'Reactive Forms'],
      githubUrl: 'https://github.com',
      liveUrl: 'https://google.com',
      gradientClass: 'project-grad-1'
    },
    {
      title: 'IoT Hydroponics Monitor',
      description: 'A telemetry visualizer reading pH, temperature, and nutrient levels from sensor nodes and adjusting pumps via real-time WebSockets.',
      tags: ['Angular', 'C++', 'ESP32', 'Node.js', 'ChartJS'],
      githubUrl: 'https://github.com',
      liveUrl: 'https://google.com',
      gradientClass: 'project-grad-2'
    },
    {
      title: 'Smart Home Hub Dashboard',
      description: 'A sleek, glassmorphic layout panel that controls indoor lighting, door locks, and temperature sensors with responsive layout switches.',
      tags: ['Angular', 'Figma', 'Web APIs', 'RxJS'],
      githubUrl: 'https://github.com',
      liveUrl: 'https://google.com',
      gradientClass: 'project-grad-3'
    }
  ];

  ngOnInit(): void {}
}
