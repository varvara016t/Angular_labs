import { Component, OnInit, OnChanges, DoCheck, AfterContentInit, 
  AfterContentChecked, AfterViewInit, AfterViewChecked, 
  OnDestroy, SimpleChanges, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-greeting',
  templateUrl: './greeting.component.html',
  styleUrls: ['./greeting.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class GreetingComponent implements OnInit, OnChanges, DoCheck, 
  AfterContentInit, AfterContentChecked, AfterViewInit, 
  AfterViewChecked, OnDestroy {
  
  @Input() parentData: string = '';
  userName: string = '';
  greeting: string = '';
  showGreeting: boolean = false;
  lifecycleLog: string[] = [];

  constructor() {
    this.logLifecycleHook('constructor');
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.logLifecycleHook('ngOnChanges');
    if (changes['parentData']) {
      console.log('parentData changed:', changes['parentData'].currentValue);
    }
  }

  ngOnInit(): void {
    this.logLifecycleHook('ngOnInit');
  }

  ngDoCheck(): void {
    this.logLifecycleHook('ngDoCheck');
  }

  ngAfterContentInit(): void {
    this.logLifecycleHook('ngAfterContentInit');
  }

  ngAfterContentChecked(): void {
    this.logLifecycleHook('ngAfterContentChecked');
  }

  ngAfterViewInit(): void {
    this.logLifecycleHook('ngAfterViewInit');
  }

  ngAfterViewChecked(): void {
    this.logLifecycleHook('ngAfterViewChecked');
  }

  ngOnDestroy(): void {
    this.logLifecycleHook('ngOnDestroy');
  }

  showGreetingMessage(): void {
    if (this.userName) {
      this.greeting = `Привет, ${this.userName}!`;
      this.showGreeting = true;
    } else {
      this.greeting = 'Пожалуйста, введите ваше имя.';
      this.showGreeting = true;
    }
  }

  private logLifecycleHook(hook: string): void {
    console.log(`Lifecycle Hook: ${hook}`);
    this.lifecycleLog.push(`${new Date().toLocaleTimeString()}: ${hook}`);
  }
}