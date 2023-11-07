import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { Subscription, first } from 'rxjs';
import { UserAuthService } from 'src/app/Servicios/user-auth.service';

@Directive({
  selector: '[appDirectivaBotonEspecialidad]'
})
export class DirectivaBotonEspecialidadDirective implements OnInit {

  $especialidades: Subscription = new Subscription;
  especialidades: any;
  @Input() defaultColor = 'gray';
  @Input() especialidadDirect!: any[];
  @Input() especialidadPropia: any;
  @Input() appHighlight = '';

  url = '';

  constructor(private el: ElementRef, private renderer: Renderer2, private auth: UserAuthService) {
    this.renderer.setStyle(this.el.nativeElement, 'background-image', `url(${this.url})`);
    this.renderer.setStyle(el.nativeElement, 'border-style', `solid`);
    this.renderer.setStyle(el.nativeElement, 'border-color', `#0d6efd`);

    this.renderer.setStyle(el.nativeElement, 'background-color', `#0d6efd`);
    this.renderer.setStyle(el.nativeElement, 'background', `center`);
    this.renderer.setStyle(el.nativeElement, 'background-size', `50px 50px`);
    this.renderer.setStyle(el.nativeElement, 'background-repeat', 'no-repeat');
    this.renderer.setStyle(el.nativeElement, 'width', '100px');
    this.renderer.setStyle(el.nativeElement, 'height', '50px');

  }

  ngOnInit(): void {
    this.auth.traerColeccionOrdenada('especialidades', 'nombre').pipe(first()).subscribe(
      response => {
        this.especialidades = response;
        for (const iterator of this.especialidades) {
          if (iterator.nombre == this.especialidadPropia) {
            this.url = iterator.imagen;
            this.renderer.setStyle(this.el.nativeElement, 'background-image', `url(${this.url})`);
            break;
          }
        }
      }
    )

  }

  @HostListener('mouseenter') onMouseEnter() {
    //this.highlight(this.appHighlight || this.defaultColor || 'red');
  }

  @HostListener('mouseout') onMouseLeave() {
    //this.highlight('');
  }

  @HostListener('click') onMouseClick() {
    //this.highlight('#0d6efd');
  }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }

}
