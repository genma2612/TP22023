import { AnimationTriggerMetadata, animate, animateChild, group, query, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { ChildrenOutletContexts } from '@angular/router';

//  Animation definition

export const transformer =
  trigger('routeAnimations', [
    transition('* => lobby', transformTo({ x: 100, y: -100, rotate: 90 }) ),
    transition('* => home', transformTo({ x: 100, y: -100, rotate: 90 }) ),
    transition('* => registro', transformTo({ x: 100, y: -100, rotate: 90 }) ),
    //transition('* => lobby', transformTo({ x: -100, y: -100, rotate: -720 }) ),
    transition('* => welcome', transformTo({ x: 100, y: -100, rotate: 90 }) ),
]);


function transformTo({x = 100, y = 0, rotate = 0}) {
  const optional = { optional: true };
  return [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      })
    ], optional),
    query(':enter', [
      style({ transform: `translate(${x}%, ${y}%) rotate(${rotate}deg)`})
    ]),
    group([
      query(':leave', [
        animate('600ms ease-out', style({ transform: `translate(${x}%, ${y}%) rotate(${rotate}deg)`}))
      ], optional),
      query(':enter', [
        animate('600ms ease-out', style({ transform: `translate(0, 0) rotate(0)`}))
      ])
    ]),
  ];
}
//  Animation definition


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [ transformer ]
})
export class AppComponent {
  title = 'TP22023';

  constructor(private contexts: ChildrenOutletContexts) {}

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];  }

}

