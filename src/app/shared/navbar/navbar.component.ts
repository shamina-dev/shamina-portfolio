import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isScrolled = false;
  activeSection = 'home';

  sections = ['home', 'skills', 'services', 'projects', 'resume', 'contact'];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Initial check
    setTimeout(() => {
      this.checkActiveSection();
    }, 100);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 30;
    this.checkActiveSection();
  }

  checkActiveSection() {
    if (this.router.url.startsWith('/free-services')) {
      this.activeSection = 'services';
      return;
    }

    const scrollPos = window.scrollY + 120; // 120px offset
    
    for (const section of this.sections) {
      const el = document.getElementById(section);
      if (el) {
        const top = el.getBoundingClientRect().top + window.pageYOffset;
        const height = el.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          this.activeSection = section;
          break;
        }
      }
    }
  }

  scrollTo(sectionId: string, event: Event) {
    event.preventDefault();
    
    const currentBaseUrl = this.router.url.split('#')[0].split('?')[0];
    
    if (currentBaseUrl !== '/' && currentBaseUrl !== '') {
      this.router.navigate(['/'], { fragment: sectionId });
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        const yOffset = -90; // Adjust header offset
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  }
}
