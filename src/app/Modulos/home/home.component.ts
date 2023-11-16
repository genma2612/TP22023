import { animate, animateChild, group, query, stagger, state, style, transition, trigger, useAnimation } from '@angular/animations';
import { Component } from '@angular/core';
import { ChildrenOutletContexts, Router, RouterOutlet } from '@angular/router';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation } from 'angular-animations'; 

//  Animation definition

export const slider =
  trigger('routeAnimations', [
    transition('* => pacientes', slideTo('right') ),
    transition('pacientes => *', slideTo('left') ),
    transition('* => solicitarTurno', slideTo('right') ),
    transition('usuarios => *', slideTo('right') ),
    transition('* => usuarios', slideTo('left') ),
    transition('solicitarTurno => *', slideTo('left') ),
    transition('turnos => usuarios', slideTo('left') ),
    transition('turnos => *', slideTo('right') ),
    transition('encuestas => turnos', slideTo('left') ),
    transition('encuestas => usuarios', slideTo('left') ),
    transition('encuestas => *', slideTo('right') ),
    transition('logs => turnos', slideTo('left') ),
    transition('logs => encuestas', slideTo('left') ),
    transition('logs => *', slideTo('right') ),
    transition('estadisticas => perfil', slideTo('right') ),
    transition('estadisticas => solicitarTurno', slideTo('right') ),
    transition('estadisticas => *', slideTo('left') ),
    transition('perfil => solicitarTurno', slideTo('right') ),
    transition('perfil => misturnos', slideTo('right') ),
    transition('perfil => *', slideTo('left') ),
    transition('misturnos => perfil', slideTo('left') ),

  ]);

function slideTo(direction:string) {
  const optional = { optional: true };
  return [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        [direction]: 0,
        width: '100%'
      })
    ], optional),
    query(':enter', [
      style({ [direction]: '-100%'})
    ],),
    group([
      query(':leave', [
        animate('600ms ease', style({ [direction]: '100%'}))
      ], optional),
      query(':enter', [
        animate('600ms ease', style({ [direction]: '0%'}))
      ])
    ]),
  ];
}
//  Animation definition

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [slider]
})
export class HomeComponent {


  
  constructor(private router:Router, private contexts: ChildrenOutletContexts){}
  
  isHomeRoute() {
    return this.router.url === '/home';
  }
  
  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }

  prepareRoute(outlet: RouterOutlet) {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }

}
