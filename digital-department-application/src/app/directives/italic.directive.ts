import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appItalic]',
  standalone: true
})
export class ItalicDirective implements OnInit {
  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.el.nativeElement.style.fontStyle = 'italic';
  }
}