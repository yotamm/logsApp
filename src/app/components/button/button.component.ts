import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Input() imgSrc?: string;
  @Input() text?: string;
  @Input() styling?: {[prop: string]: any};

  constructor() { }

  ngOnInit(): void {
  }

}
