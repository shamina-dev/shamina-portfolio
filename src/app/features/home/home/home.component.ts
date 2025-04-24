import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  icons = [
    { name: 'email',     piClass: 'pi-envelope' },
    { name: 'linkedin',  piClass: 'pi-linkedin' },
    { name: 'instagram', piClass: 'pi-instagram' },
    { name: 'facebook',  piClass: 'pi-facebook' }
  ];

  selected = '';

  select(name: string, event: Event) {
    event.preventDefault();
    this.selected = name;
  }

}
