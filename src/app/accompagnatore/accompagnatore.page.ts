import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accompagnatore',
  templateUrl: './accompagnatore.page.html',
  styleUrls: ['./accompagnatore.page.scss'],
})
export class AccompagnatorePage implements OnInit {
  qrResultString?: string;

  constructor() { }

  onCodeResult(resultString: string) {
    this.qrResultString = resultString;
  }

  ngOnInit() {
    this
  }

}
