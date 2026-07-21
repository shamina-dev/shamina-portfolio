import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  icons = [
    { name: 'linkedin', piClass: 'pi-linkedin', url: 'https://www.linkedin.com/in/shamina-palansooriya/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BKEoZLU65RQqn7cbm7x6SPQ%3D%3D' },
    { name: 'github', piClass: 'pi-github', url: 'https://github.com/shamina-dev' },
    { name: 'email', piClass: 'pi-envelope', url: 'mailto:shaminapalansooriya@gmail.com' }
  ];
  
  roles: string[] = ['Software Engineer Intern', 'Full Stack Developer', 'UI/UX Enthusiast', 'Problem Solver'];
  currentRole: string = '';
  private roleIndex: number = 0;
  private charIndex: number = 0;
  private isDeleting: boolean = false;
  private typingTimeout: any;

  ngOnInit(): void {
    this.typeRole();
  }

  ngOnDestroy(): void {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
  }

  typeRole() {
    const fullRole = this.roles[this.roleIndex];
    
    if (this.isDeleting) {
      this.currentRole = fullRole.substring(0, this.charIndex - 1);
      this.charIndex--;
    } else {
      this.currentRole = fullRole.substring(0, this.charIndex + 1);
      this.charIndex++;
    }
    
    let typingSpeed = this.isDeleting ? 40 : 100;
    
    if (!this.isDeleting && this.charIndex === fullRole.length) {
      typingSpeed = 2200; // Hold full text
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.roleIndex = (this.roleIndex + 1) % this.roles.length;
      typingSpeed = 400; // Delay before starting next word
    }
    
    this.typingTimeout = setTimeout(() => {
      this.typeRole();
    }, typingSpeed);
  }

  scrollToContact(event: Event) {
    event.preventDefault();
    const el = document.getElementById('contact');
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }
}
