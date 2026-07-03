import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menu } from '../menu/menu'

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [RouterOutlet, Menu],
  templateUrl: './principal.html',
  styleUrl: './principal.css',
})
export class Principal {

}
