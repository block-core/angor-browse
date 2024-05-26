import { Component } from '@angular/core';
   import { MatDialog } from '@angular/material/dialog';
import { ThemeColorComponent } from '../theme-color/theme-color.component';
  
@Component({
  selector: 'app-theme',
  templateUrl: './theme.component.html',
  styleUrl: './theme.component.css'
})
export class ThemeComponent {
  constructor( public dialog: MatDialog) { }


  openSettings() {
    this.dialog.open(ThemeColorComponent, {
      width: '420px',
      panelClass: 'custom-dialog-container'
    });
  }
}
