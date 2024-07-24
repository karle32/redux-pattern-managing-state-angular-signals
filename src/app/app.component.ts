import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';

const MODULES = [RouterOutlet, HomeComponent];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [...MODULES],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
