import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bambino',
  templateUrl: './bambino.page.html',
  styleUrls: ['./bambino.page.scss'],
})
export class BambinoPage implements OnInit {
  qrData: any

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.qrData = this.route.snapshot.paramMap.get('data')
  }

}
