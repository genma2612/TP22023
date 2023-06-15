import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  menu_btn = document.querySelector("#menu-btn");
  sidebar = document.querySelector("#sidebar");
  container = document.querySelector(".my-container");


  constructor() {
    if (this.menu_btn != null) {
      this.menu_btn.addEventListener("click", () => {
        if (this.sidebar != null)
          this.sidebar.classList.toggle("active-nav");
        if (this.container)
          this.container.classList.toggle("active-cont");
      });
    }

  }



}
